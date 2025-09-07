import frappe
from frappe.model.document import Document
import random
import re


class Product(Document):
    def validate(self):
        self.calculate_discount()
        self.calculate_discounted_price()
        self.set_product_slug()
        self.set_reviews_and_ratings()
        self.validation_checks()

    def autoname(self):
        charset = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"
        max_attempts = 50
        for _ in range(max_attempts):
            candidate = "".join(random.choices(charset, k=5))
            if not frappe.db.exists("Product", candidate):
                self.name = candidate
                return
        frappe.throw("Could not generate a unique product code. Consider using a longer format.")

    def calculate_discount(self):
        if self.discount_type == "Zero":
            self.discount_percent = 0
            self.discount_amount = 0
        elif self.discount_type == "Fixed":
            if self.price and self.price > 0:
                self.discount_percent = (self.discount_amount or 0) / self.price * 100
        elif self.discount_type == "Percent":
            if self.discount_percent is not None:
                self.discount_amount = round(((self.price or 0) * (self.discount_percent / 100)),0)

    def calculate_discounted_price(self):
        self.discounted_price = round((self.price - self.discount_amount),0)

    def set_product_slug(self):
        if not self.product_name:
            return

        name = self.product_name.lower()

        name = re.sub(r'&', 'and', name)

        stop_phrases = [
            r'\b1\s*pc\b',
            r'\b1\s*piece\b',
            r'\b2\s*pc\b',
            r'\bset of \d+\b',
            r'\buniversal\b',
            r'\bbig\b',
            r'\bsmall\b',
            r'\bmedium\b',
            r'\bfree gift\b',
            r'\bpack of \d+\b'
        ]
        for pattern in stop_phrases:
            name = re.sub(pattern, '', name, flags=re.IGNORECASE)

        name = re.sub(r'[^a-z0-9\s-]', '', name)

        name = re.sub(r'\s+', ' ', name).strip()

        slug_parts = "-".join(name.split())

        if not slug_parts:
            slug_parts = "product"

        self.product_slug = f"{slug_parts}-{self.name.lower()}"


    def set_reviews_and_ratings(self):
        self.rating_count = self.custom_rating_count or 0 + self.actual_rating_count or 0
        self.review_count = self.custom_review_count or 0 + self.actual_review_count or 0
        self.product_rating = (self.custom_rating + self.actual_rating) / 2 if (self.custom_rating and self.actual_rating) else self.custom_rating or self.actual_rating or 0
        self.units_sold = self.custom_units_sold or 0 + self.actual_units_sold or 0

        


    def validation_checks(self):

        if self.product_rating > 5:
            frappe.throw("Product rating cannot exceed 5.")
        
        images = getattr(self, "product_img", [])
        if not images:
            frappe.throw("Please upload primary & Secondary image.")

        primary_count = 0
        secondary_count = 0

        for idx, img in enumerate(getattr(self, "product_img", []), start=1):
            is_primary = getattr(img, "primary_image", 0)
            is_secondary = getattr(img, "secondary_image", 0)

            if is_primary and is_secondary:
                frappe.throw(f"Row {idx}: A single image cannot be both primary and secondary.")

            if is_primary:
                primary_count += 1
            if is_secondary:
                secondary_count += 1

        if primary_count == 0:
            frappe.throw("Please Select Primary Image.")
        elif primary_count > 1:
            frappe.throw("You Can Select only 1 Primary Image.")

        if secondary_count == 0:
            frappe.throw("Please Select Secondary Image.")
        elif secondary_count > 1:
            frappe.throw("You Can Select only 1 Secondary Image.")


        