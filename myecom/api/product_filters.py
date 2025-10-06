
import frappe
from .camel_case import dict_keys_to_camel

@frappe.whitelist(allow_guest=True)
def get_filter_data():
    """
    Retrieves data required for populating product filters on the frontend.
    Fetches all unique categories, brands, and the maximum product price.
    """
    try:
        # Fetch all unique, non-empty brand names
        brands = frappe.get_all(
            "Product",
            fields=["DISTINCT brand_name"],
            filters={"brand_name": ["is", "set"]},
            pluck="brand_name",
            order_by="brand_name"
        )

        # Fetch all unique category names from the linked Category doctype
        categories = frappe.get_all(
            "Category",
            fields=["DISTINCT category_name"],
            filters={"category_name": ["is", "set"]},
            pluck="category_name",
            order_by="category_name"
        )

        # Fetch the maximum price from all products
        max_price_result = frappe.get_all(
            "Product",
            fields=["MAX(price) as max_price"],
            as_list=True
        )
        max_price = max_price_result[0][0] if max_price_result and max_price_result[0][0] is not None else 1000

        filter_data = {
            "brands": brands,
            "categories": categories,
            "maxPrice": max_price
        }

        return dict_keys_to_camel(filter_data)

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Failed to get filter data")
        return frappe.throw("An error occurred while fetching filter data.")

