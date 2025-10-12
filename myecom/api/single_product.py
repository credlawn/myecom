import frappe
from .camel_case import dict_keys_to_camel

@frappe.whitelist(allow_guest=True)
def get_product_by_slug():
    slug = frappe.form_dict.get("slug")
    try:
        product_name = frappe.db.get_value("Product", {"product_slug": slug}, "name")
        if not product_name:
            return {"error": "Product not found"}

        product = frappe.get_doc("Product", product_name)
        site_settings = frappe.get_single("Site Settings")

        categories = []
        if product.category:
            category_ids = [row.category for row in product.category]
            category_docs = frappe.get_all(
                "Category",
                filters={'name': ['in', category_ids]},
                fields=['name', 'category_name']
            )
            categories = [{"id": doc.name, "name": doc.category_name} for doc in category_docs]

        product_images = frappe.db.sql("""
            SELECT
                name,
                cdn_image,
                image_url,
                attach_image,
                primary_image,
                secondary_image,
                modified
            FROM `tabProduct Images`
            WHERE parent = %(product)s
            ORDER BY modified DESC
        """, {"product": product_name}, as_dict=True)

        def get_image_url(img):
            if img.cdn_image and img.image_url:
                return img.image_url
            elif img.attach_image:
                return frappe.utils.get_url(img.attach_image)
            return None

        primary_images = [img for img in product_images if img.primary_image]
        if primary_images:
            product_image_1 = get_image_url(primary_images[0])
        elif product_images:
            product_image_1 = get_image_url(product_images[0])
        else:
            product_image_1 = "/files/placeholder.jpg"

        all_images = []
        for img in product_images[:8]:
            image_url = get_image_url(img)
            if image_url:
                all_images.append(image_url)

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
            "review_count": product.review_count,
            "units_sold": product.units_sold,
            "product_slug": product.product_slug,
            "product_image_1": product_image_1,
            "product_images": all_images,
            "product_tag": product.product_tag,
            "short_description": product.short_description,
            "description": product.description,
            "unit": product.unit,
            "featured": product.featured,
            "categories": categories,
            "currency": site_settings.currency,
        }

        return dict_keys_to_camel(data)

    except Exception as e:
        frappe.log_error(message=frappe.get_traceback(), title="get_product_by_slug Error")
        return {"error": str(e)}