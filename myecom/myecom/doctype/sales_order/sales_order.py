# Copyright (c) 2024, SanU and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class SalesOrder(Document):
	def before_save(self):
		self.calculate_total_amount()

	def calculate_total_amount(self):
		total_amount = 0
		for item in self.items:
			total_amount += item.quantity * item.rate
		self.total_amount = total_amount
