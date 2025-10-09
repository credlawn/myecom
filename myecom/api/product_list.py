import frappe
import json
from collections import defaultdict
from .camel_case import dict_keys_to_camel
from frappe.utils import get_url, fmt_money

@frappe.whitelist(allow_guest=True)
def get_product_list():
    try:
        # Start with a list of filters, not a dict
        filters = [["Product", "unlisted", "!=", 1]]
        data = {}

        if frappe.request and frappe.request.data:
            try:
                data = json.loads(frappe.request.data)
            except (json.JSONDecodeError, TypeError) as e:
                frappe.log_error(f"Failed to parse request body: {e}", "Get Product List API Error")
                pass

        # Category filtering
        if data.get('category'):
            category_names = data.get('category').split(',')
            
            # Get the actual 'name' (ID) of the categories based on the 'category_name'
            category_ids = frappe.get_all(
                "Category",
                filters={'category_name': ['in', category_names]},
                pluck='name',
                distinct=True
            )

            if not category_ids:
                 return dict_keys_to_camel({"products": [], "total_products": 0})

            # Find products linked to these category IDs
            product_names_in_category = frappe.get_all(
                "Category Table",
                filters={'category': ['in', category_ids]},
                pluck='parent',
                distinct=True
            )

            if not product_names_in_category:
                return dict_keys_to_camel({"products": [], "total_products": 0})
            
            filters.append(["Product", "name", "in", product_names_in_category])

        if 'featured' in data:
            filters.append(["Product", "featured", "=", data.get('featured')])
        if data.get('brand'):
            filters.append(["Product", "brand_name", "in", data.get('brand').split(',')])
        
        min_price = data.get('minPrice')
        max_price = data.get('maxPrice')
        if min_price is not None:
            filters.append(["Product", "price", ">=", min_price])
        if max_price is not None:
            if float(max_price) > 0:
                 filters.append(["Product", "price", "<=", max_price])

        sort_by_option = data.get('sortBy', 'latest')
        order_by = "modified desc"
        if sort_by_option == 'price_asc':
            order_by = 'price asc'
        elif sort_by_option == 'price_desc':
            order_by = 'price desc'

        page_num = int(data.get('pageNum', 1))
        page_size = int(data.get('pageSize', 10))
        limit_start = (page_num - 1) * page_size

        total_products = frappe.db.count("Product", filters=filters)

        products = frappe.get_all(
            "Product",
            fields=[
                "name", "product_name", "brand_name", "unit", "min_purchase_qty",
                "discount_type", "discount_percent", "discount_amount", "price",
                "discounted_price", "stock", "product_slug", "product_tag",
                "product_rating", "rating_count", "nd_text", "featured", "unlisted",
            ],
            filters=filters,
            order_by=order_by,
            limit_start=limit_start,
            limit_page_length=page_size
        )
        base_url = get_url()
        product_names = [p["name"] for p in products]
        
        if not product_names:
            return dict_keys_to_camel({"products": [], "total_products": 0})

        cat_map = _get_product_categories(product_names)
        image_map = _get_product_images(product_names)

        result = []
        for prod in products:
            prod["price"] = fmt_money(prod.get("price")) if prod.get("price") else None
            prod["discounted_price"] = fmt_money(prod.get("discounted_price")) if prod.get("discounted_price") else None

            images = image_map.get(prod["name"], [])
            product_image_1, product_image_2 = _get_primary_secondary_images(images, base_url)

            product_dict = {
                **prod,
                "productImage1": product_image_1,
                "productImage2": product_image_2,
                "productCategory": list(cat_map.get(prod["name"], []))
            }
            result.append(dict_keys_to_camel(product_dict))

        return dict_keys_to_camel({
            "products": result,
            "total_products": total_products
        })

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Get Product List API Failed")
        frappe.throw("An error occurred while fetching the product list. Please check the error log for details.")

def _get_product_categories(product_names):
    categories = frappe.db.sql("""
        SELECT ct.parent AS product, c.category AS category_name
        FROM `tabCategory Table` ct
        LEFT JOIN `tabCategory` c ON c.name = ct.category
        WHERE ct.parent IN %(products)s
    """, {"products": product_names}, as_dict=1)
    
    cat_map = defaultdict(set)
    for c in categories:
        if c.get("category_name"):
            cat_map[c["product"]].add(c["category_name"])
    return cat_map

def _get_product_images(product_names):
    product_images = frappe.db.sql("""
        SELECT parent, name, cdn_image, image_url, attach_image, primary_image, secondary_image, modified
        FROM `tabProduct Images`
        WHERE parent IN %(products)s
        ORDER BY modified DESC
    """, {"products": product_names}, as_dict=1)

    image_map = defaultdict(list)
    for img in product_images:
        image_map[img["parent"]].append(img)
    return image_map

def _get_primary_secondary_images(images, base_url):
    def get_image_url(img):
        if img.get("cdn_image") and img.get("image_url"):
            return img.get("image_url")
        elif img.get("attach_image"):
            return get_url(img["attach_image"])
        return None

    placeholder = f"{base_url}/files/placeholder.svg"
    
    primary_images = [img for img in images if img.get("primary_image")]
    product_image_1 = get_image_url(primary_images[0]) if primary_images else (get_image_url(images[0]) if images else placeholder)

    secondary_images = [img for img in images if img.get("secondary_image")]
    product_image_2 = get_image_url(secondary_images[0]) if secondary_images else (get_image_url(images[1]) if len(images) > 1 else placeholder)

    return product_image_1 or placeholder, product_image_2 or placeholder
