# Copyright (c) 2025, Credlawn India and Contributors
# See license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import now


class Wishlist(Document):
	def before_insert(self):
		if not self.created_on:
			self.created_on = now()
		
		# Ensure either user or visitor_id is provided
		if not self.user and not self.visitor_id:
			frappe.throw("Either User or Visitor ID is required")
		
		# Check for existing wishlist
		existing = self.get_existing_wishlist()
		if existing:
			return frappe.get_doc("Wishlist", existing)
	
	def validate(self):
		# Ensure no duplicate products in wishlist
		product_ids = [item.product for item in self.items]
		if len(product_ids) != len(set(product_ids)):
			frappe.throw("Duplicate products are not allowed in wishlist")
	
	def get_existing_wishlist(self):
		"""Find existing wishlist for user or visitor"""
		filters = {}
		if self.user:
			filters["user"] = self.user
		elif self.visitor_id:
			filters["visitor_id"] = self.visitor_id
		
		existing = frappe.db.exists("Wishlist", filters)
		return existing
	
	def add_item(self, product_id):
		"""Add a product to wishlist"""
		if not product_id:
			return False
		
		# Check if product already exists
		existing_products = [item.product for item in self.items]
		if product_id in existing_products:
			return False
		
		# Get product details
		product = frappe.get_doc("Product", product_id)
		if not product:
			return False
		
		# Add new item
		self.append("items", {
			"product": product.name,
			"product_name": product.product_name,
			"product_image": product.image,
			"price": product.price,
			"added_on": now()
		})
		
		self.save()
		return True
	
	def remove_item(self, product_id):
		"""Remove a product from wishlist"""
		if not product_id:
			return False
		
		# Find and remove the item
		items_to_remove = []
		for item in self.items:
			if item.product == product_id:
				items_to_remove.append(item)
		
		for item in items_to_remove:
			self.remove(item)
		
		if items_to_remove:
			self.save()
			return True
		
		return False
	
	def get_items_count(self):
		"""Get total number of items in wishlist"""
		return len(self.items)
	
	def clear_wishlist(self):
		"""Remove all items from wishlist"""
		self.items = []
		self.save()
		return True


@frappe.whitelist(allow_guest=True)
def get_or_create_wishlist(user=None, visitor_id=None):
	"""Get or create wishlist for user or visitor"""
	if not user and not visitor_id:
		frappe.throw("Either User or Visitor ID is required")
	
	filters = {}
	if user:
		filters["user"] = user
	elif visitor_id:
		filters["visitor_id"] = visitor_id
	
	existing = frappe.db.exists("Wishlist", filters)
	if existing:
		return frappe.get_doc("Wishlist", existing)
	
	# Create new wishlist
	wishlist = frappe.new_doc("Wishlist")
	if user:
		wishlist.user = user
	if visitor_id:
		wishlist.visitor_id = visitor_id
	
	wishlist.insert()
	return wishlist


@frappe.whitelist(allow_guest=True)
def add_to_wishlist(product_id, user=None, visitor_id=None):
	"""Add product to wishlist"""
	if not product_id:
		return {"success": False, "message": "Product ID is required"}
	
	wishlist = get_or_create_wishlist(user, visitor_id)
	success = wishlist.add_item(product_id)
	
	if success:
		return {
			"success": True,
			"message": "Product added to wishlist",
			"wishlist_count": wishlist.get_items_count()
		}
	else:
		return {
			"success": False,
			"message": "Product already in wishlist or not found"
		}


@frappe.whitelist(allow_guest=True)
def remove_from_wishlist(product_id, user=None, visitor_id=None):
	"""Remove product from wishlist"""
	if not product_id:
		return {"success": False, "message": "Product ID is required"}
	
	wishlist = get_or_create_wishlist(user, visitor_id)
	success = wishlist.remove_item(product_id)
	
	if success:
		return {
			"success": True,
			"message": "Product removed from wishlist",
			"wishlist_count": wishlist.get_items_count()
		}
	else:
		return {
			"success": False,
			"message": "Product not found in wishlist"
		}


@frappe.whitelist(allow_guest=True)
def get_wishlist_items(user=None, visitor_id=None):
	"""Get all items in wishlist"""
	wishlist = get_or_create_wishlist(user, visitor_id)
	
	items = []
	for item in wishlist.items:
		items.append({
			"product": item.product,
			"product_name": item.product_name,
			"product_image": item.product_image,
			"price": item.price,
			"added_on": item.added_on
		})
	
	return {
		"success": True,
		"items": items,
		"total_items": len(items)
	}


@frappe.whitelist(allow_guest=True)
def clear_wishlist(user=None, visitor_id=None):
	"""Clear all items from wishlist"""
	wishlist = get_or_create_wishlist(user, visitor_id)
	success = wishlist.clear_wishlist()
	
	if success:
		return {
			"success": True,
			"message": "Wishlist cleared",
			"wishlist_count": 0
		}
	else:
		return {
			"success": False,
			"message": "Failed to clear wishlist"
		}