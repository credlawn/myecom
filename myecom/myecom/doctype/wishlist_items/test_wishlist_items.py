# Copyright (c) 2025, Credlawn India and Contributors
# See license.txt

import frappe
from frappe.tests import IntegrationTestCase


class IntegrationTestWishlistItems(IntegrationTestCase):
	"""
	Integration tests for Wishlist Items.
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
		frappe.db.delete("Product", {"product_name": "Test Product"})
	
	def test_wishlist_items_creation(self):
		"""Test creating wishlist items"""
		wishlist_item = frappe.get_doc({
			"doctype": "Wishlist Items",
			"product": self.test_product.name,
			"product_name": "Test Product",
			"product_image": "/test-image.jpg",
			"price": 100.00
		}).insert()
		
		self.assertEqual(wishlist_item.product, self.test_product.name)
		self.assertEqual(wishlist_item.product_name, "Test Product")
		self.assertEqual(wishlist_item.price, 100.00)
	
	def test_auto_populate_product_details(self):
		"""Test auto-population of product details"""
		wishlist_item = frappe.get_doc({
			"doctype": "Wishlist Items",
			"product": self.test_product.name
		}).insert()
		
		# Check if product details were auto-populated
		self.assertEqual(wishlist_item.product_name, self.test_product.product_name)
		self.assertEqual(wishlist_item.product_image, self.test_product.image)
		self.assertEqual(wishlist_item.price, self.test_product.price)