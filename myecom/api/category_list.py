import frappe
from .camel_case import dict_keys_to_camel

@frappe.whitelist(allow_guest=True)
def get_category_list():
    base_url = frappe.utils.get_url()
    
    categories = frappe.get_all(
        "Category",
        filters={"enable": 1},
        fields=[
            "category_name",
            "parent_category",
            "sequence",
            "slug",
            "attributes",
            "category_image"
        ],
        order_by="sequence",
        limit=20
    )

    result = []
    for cat in categories:
        if cat.get("category_image"):
            cat["category_image"] = f"{base_url}{cat['category_image']}"
        else:
            cat["category_image"] = None

        if cat.get("attributes"):
            parts = [p.strip() for p in cat["attributes"].replace("\n", ",").split(",")]
            parts = [p for p in parts if p]
            cat["attributes"] = ",".join(parts)
        else:
            cat["attributes"] = None

        result.append(dict_keys_to_camel(cat))

    return result
