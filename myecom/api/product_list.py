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
            "discounted_price", "stock", "product_slug", "product_tag",
            "product_rating", "rating_count", "nd_text", "featured"
        ],
        order_by="modified desc"
    )

    product_names = [p.name for p in products]
    product_map = {p.name: p for p in products}

    # Fetch categories
    categories = frappe.db.sql("""
        SELECT
            ct.parent AS product,
            c.category AS category_name
        FROM `tabCategory Table` ct
        LEFT JOIN `tabCategory` c ON c.name = ct.category
        WHERE ct.parent IN %(products)s
    """, {"products": product_names}, as_dict=1)

    cat_map = defaultdict(set)
    for c in categories:
        if c.category_name:
            cat_map[c.product].add(c.category_name)

    # Fetch product images
    product_images = frappe.db.sql("""
        SELECT
            parent,
            name,
            cdn_image,
            image_url,
            attach_image,
            primary_image,
            secondary_image,
            modified
        FROM `tabProduct Images`
        WHERE parent IN %(products)s
        ORDER BY modified DESC
    """, {"products": product_names}, as_dict=1)

    # Organize images by product
    image_map = defaultdict(list)
    for img in product_images:
        image_map[img.parent].append(img)

    result = []
    for prod in products:
        images = image_map.get(prod.name, [])

        # Helper function to get image URL
        def get_image_url(img):
            if img.cdn_image and img.image_url:
                return img.image_url
            elif img.attach_image:
                return frappe.utils.get_url(img.attach_image)
            return None

        # Find primary image (product_image_1)
        primary_images = [img for img in images if img.primary_image]
        if primary_images:
            product_image_1 = get_image_url(primary_images[0])
        elif images:
            product_image_1 = get_image_url(images[0])
        else:
            product_image_1 = None

        # Find secondary image (product_image_2)
        secondary_images = [img for img in images if img.secondary_image]
        if secondary_images:
            product_image_2 = get_image_url(secondary_images[0])
        elif len(images) > 1:
            product_image_2 = get_image_url(images[1])
        else:
            product_image_2 = None

        result.append({
            **prod,
            "product_image_1": product_image_1,
            "product_image_2": product_image_2,
            "product_category": list(cat_map.get(prod.name, []))
        })

    return {"messages": result}
