# Copyright (c) 2025, Credlawn India and Contributors
# See license.txt

import frappe
from frappe.model.document import Document


class WishlistItems(Document):
	def validate(self):
		# Ensure product exists
		if not frappe.db.exists("Product", self.product):
			frappe.throw("Invalid product selected")
		
		# Auto-populate product details
		if self.product and not self.product_name:
			product = frappe.get_doc("Product", self.product)
			self.product_name = product.product_name
			self.product_image = product.image
			self.price = product.price
		
		# Set added_on if not provided
		if not self.added_on:
			from frappe.utils import now
			self.added_on = now()