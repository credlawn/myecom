import frappe
from collections import defaultdict

@frappe.whitelist(allow_guest=True)
def get_product_list():
    # Step 1: Products fetch (ORM safe)
    products = frappe.get_all(
        "Product",
        fields=[
            "name", "product_name", "brand_name", "unit", "min_purchase_qty",
            "discount_type", "discount_percent", "discount_amount", "price",
            "discounted_price", "stock", "product_slug", "product_image_1",
            "product_image_2", "product_tag", "product_rating", "rating_count"
        ],
        order_by="modified desc"
    )

    product_map = {p.name: p for p in products}  # dict for fast access

    categories = frappe.db.sql("""
        SELECT
            ct.parent AS product,
            c.category AS category_name
        FROM `tabCategory Table` ct
        LEFT JOIN `tabCategory` c ON c.name = ct.category
        WHERE ct.parent IN %(products)s
    """, {"products": tuple(product_map.keys())}, as_dict=1)

    cat_map = defaultdict(set)
    for c in categories:
        if c.category_name:
            cat_map[c.product].add(c.category_name)

    result = []
    for prod in products:
        result.append({
            **prod,
            "product_category": list(cat_map.get(prod.name, []))
        })

    return {"messages": result}
