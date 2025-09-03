# Copyright (c) 2025, Credlawn India and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase


class IntegrationTestWishlist(IntegrationTestCase):
	"""
	Integration tests for Wishlist.
	Use this class for testing interactions between multiple components.
	"""
	
	def setUp(self):
		# Create test product
		self.test_product = frappe.get_doc({
			"doctype": "Product",
			"product_name": "Test Product",
			"price": 100.00,
			"image": "/test-image.jpg"
		}).insert()
	
	def tearDown(self):
		# Clean up test data
		frappe.db.delete("Wishlist")
		frappe.db.delete("Product", {"product_name": "Test Product"})
	
	def test_create_wishlist_for_user(self):
		"""Test creating wishlist for logged-in user"""
		wishlist = frappe.get_doc({
			"doctype": "Wishlist",
			"user": "Administrator"
		}).insert()
		
		self.assertEqual(wishlist.user, "Administrator")
		self.assertIsNone(wishlist.visitor_id)
	
	def test_create_wishlist_for_visitor(self):
		"""Test creating wishlist for visitor"""
		wishlist = frappe.get_doc({
			"doctype": "Wishlist",
			"visitor_id": "test-visitor-123"
		}).insert()
		
		self.assertEqual(wishlist.visitor_id, "test-visitor-123")
		self.assertIsNone(wishlist.user)
	
	def test_add_item_to_wishlist(self):
		"""Test adding item to wishlist"""
		wishlist = frappe.get_doc({
			"doctype": "Wishlist",
			"visitor_id": "test-visitor-123"
		}).insert()
		
		success = wishlist.add_item(self.test_product.name)
		self.assertTrue(success)
		self.assertEqual(wishlist.get_items_count(), 1)
	
	def test_add_duplicate_item(self):
		"""Test adding duplicate item to wishlist"""
		wishlist = frappe.get_doc({
			"doctype": "Wishlist",
			"visitor_id": "test-visitor-123"
		}).insert()
		
		wishlist.add_item(self.test_product.name)
		success = wishlist.add_item(self.test_product.name)  # Duplicate
		
		self.assertFalse(success)
		self.assertEqual(wishlist.get_items_count(), 1)
	
	def test_remove_item_from_wishlist(self):
		"""Test removing item from wishlist"""
		wishlist = frappe.get_doc({
			"doctype": "Wishlist",
			"visitor_id": "test-visitor-123"
		}).insert()
		
		wishlist.add_item(self.test_product.name)
		success = wishlist.remove_item(self.test_product.name)
		
		self.assertTrue(success)
		self.assertEqual(wishlist.get_items_count(), 0)
	
	def test_get_or_create_wishlist_user(self):
		"""Test get_or_create_wishlist function for user"""
		from .wishlist import get_or_create_wishlist
		
		wishlist = get_or_create_wishlist(user="Administrator")
		self.assertIsNotNone(wishlist)
		self.assertEqual(wishlist.user, "Administrator")
	
	def test_get_or_create_wishlist_visitor(self):
		"""Test get_or_create_wishlist function for visitor"""
		from .wishlist import get_or_create_wishlist
		
		wishlist = get_or_create_wishlist(visitor_id="test-visitor-123")
		self.assertIsNotNone(wishlist)
		self.assertEqual(wishlist.visitor_id, "test-visitor-123")
	
	def test_api_add_to_wishlist(self):
		"""Test API endpoint for adding to wishlist"""
		from .wishlist import add_to_wishlist
		
		result = add_to_wishlist(
			product_id=self.test_product.name,
			visitor_id="test-visitor-123"
		)
		
		self.assertTrue(result["success"])
		self.assertEqual(result["wishlist_count"], 1)
	
	def test_api_remove_from_wishlist(self):
		"""Test API endpoint for removing from wishlist"""
		from .wishlist import add_to_wishlist, remove_from_wishlist
		
		# Add first
		add_to_wishlist(
			product_id=self.test_product.name,
			visitor_id="test-visitor-123"
		)
		
		# Then remove
		result = remove_from_wishlist(
			product_id=self.test_product.name,
			visitor_id="test-visitor-123"
		)
		
		self.assertTrue(result["success"])
		self.assertEqual(result["wishlist_count"], 0)
	
	def test_clear_wishlist(self):
		"""Test clearing wishlist"""
		wishlist = frappe.get_doc({
			"doctype": "Wishlist",
			"visitor_id": "test-visitor-123"
		}).insert()
		
		wishlist.add_item(self.test_product.name)
		success = wishlist.clear_wishlist()
		
		self.assertTrue(success)
		self.assertEqual(wishlist.get_items_count(), 0)