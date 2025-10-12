import frappe
from frappe.utils import get_url
from .camel_case import dict_keys_to_camel
from collections import defaultdict

# --- Image Helper Functions (from product_list.py) ---

def _get_product_images(product_names):
    """Fetches all images for a list of products and groups them by product."""
    product_images = frappe.db.sql("""
        SELECT parent, name, cdn_image, image_url, attach_image, primary_image
        FROM `tabProduct Images`
        WHERE parent IN %(products)s
        ORDER BY modified DESC
    """, {"products": product_names}, as_dict=1)

    image_map = defaultdict(list)
    for img in product_images:
        image_map[img["parent"]].append(img)
    return image_map

def _get_primary_image(images, base_url):
    """Gets the primary image URL from a list of image objects."""
    def get_image_url(img):
        if img.get("cdn_image") and img.get("image_url"):
            return img.get("image_url")
        elif img.get("attach_image"):
            return get_url(img["attach_image"])
        return None

    placeholder = f"{base_url}/files/placeholder.svg"
    
    primary_images = [img for img in images if img.get("primary_image")]
    
    # If a primary image is set, use it.
    if primary_images:
        return get_image_url(primary_images[0]) or placeholder
    
    # Otherwise, fall back to the first image available.
    if images:
        return get_image_url(images[0]) or placeholder
        
    # If no images exist, return the placeholder.
    return placeholder

# --- Main Search API ---

@frappe.whitelist(allow_guest=True)
def search_products(query, limit=10):
    """
    Performs a prioritized live search for products across multiple relevant fields.
    """
    if not query:
        return []

    search_term = "%" + query + "%"

    # Step 1: Get matching products from DB (without image subquery)
    products = frappe.db.sql("""
        SELECT
            p.name, p.product_name, p.product_slug, p.price, p.discounted_price,
            p.product_rating, p.rating_count,
            CASE
                WHEN p.product_name LIKE %(search_term)s THEN 3
                WHEN t.tag_name LIKE %(search_term)s THEN 2
                WHEN c.category_name LIKE %(search_term)s THEN 2
                ELSE 1
            END as relevance_score
        FROM
            `tabProduct` as p
        LEFT JOIN `tabCategory Table` as ct ON ct.parent = p.name
        LEFT JOIN `tabCategory` as c ON c.name = ct.category
        LEFT JOIN `tabTag Child` as tt ON tt.parent = p.name
        LEFT JOIN `tabTags` as t ON t.name = tt.child_tag_name
        WHERE
            p.unlisted != 1 AND (
                p.product_name LIKE %(search_term)s OR
                p.short_description LIKE %(search_term)s OR
                p.description LIKE %(search_term)s OR
                p.brand_name LIKE %(search_term)s OR
                c.category_name LIKE %(search_term)s OR
                t.tag_name LIKE %(search_term)s
            )
        GROUP BY p.name, p.product_name, p.product_slug, p.price, p.discounted_price, p.product_rating, p.rating_count
        ORDER BY relevance_score DESC, p.modified DESC
        LIMIT %(limit)s
    """, {'search_term': search_term, 'limit': int(limit)}, as_dict=True)

    if not products:
        return []

    # Step 2: Efficiently fetch all images for the found products
    product_names = [p["name"] for p in products]
    image_map = _get_product_images(product_names)

    # Step 3: Format results, attach correct image, and convert to camelCase
    base_url = get_url()
    formatted_products = []
    for p in products:
        product_images = image_map.get(p.name, [])
        p['image'] = _get_primary_image(product_images, base_url)
        
        formatted_products.append(dict_keys_to_camel(p))

    return formatted_products
