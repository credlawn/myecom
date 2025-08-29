import frappe

@frappe.whitelist(allow_guest=True)
def get_product_by_slug(slug: str):
    try:
        product_name = frappe.db.get_value("Product", {"product_slug": slug}, "name")
        if not product_name:
            return {"error": "Product not found"}

        product = frappe.get_doc("Product", product_name)
        site_settings = frappe.get_single("Site Settings")

        categories = []
        for row in product.table_multiselect_lnaq:
            category = frappe.db.get_value("Category", row.category, ["name", "category"], as_dict=True)
            if category:
                categories.append({
                    "id": category.name,
                    "name": category.category
                })

        data = {
            "id": product.name,
            "product_name": product.product_name,
            "brand_name": product.brand_name,
            "price": product.price,
            "discounted_price": product.discounted_price,
            "discount_type": product.discount_type,
            "discount_percent": product.discount_percent,
            "discount_amount": product.discount_amount,
            "stock": product.stock,
            "min_purchase_qty": product.min_purchase_qty,
            "product_rating": product.product_rating,
            "rating_count": product.rating_count,
            "product_slug": product.product_slug,
            "product_image_1": product.product_image_1,
            "product_image_2": product.product_image_2,
            "product_tag": product.product_tag,
            "description": product.discription,
            "unit": product.unit,
            "featured": product.featured,
            "categories": categories,
            "currency": site_settings.currency,
        }

        return {"data": data}

    except Exception as e:
        frappe.log_error(message=frappe.get_traceback(), title="get_product_by_slug Error")
        return {"error": str(e)}
