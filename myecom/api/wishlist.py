import frappe
import json
from collections import defaultdict
from .camel_case import dict_keys_to_camel
from frappe.utils import get_url

# --- NEW: Robust Payload Parsing Helper ---
def parse_identifiers(data):
    if isinstance(data, list) and data:
        data = data[0]
    
    identifiers = data.get('identifiers')
    if isinstance(identifiers, dict):
        user = identifiers.get('user')
        guest_uid = identifiers.get('guestUid')
    else:
        user = data.get('user')
        guest_uid = data.get('guestUid')

    if user == "$undefined":
        user = None
        
    return user, guest_uid

# --- Main Wishlist Helper Function ---
def get_or_migrate_wishlist(user=None, visitor_id=None):
    if not user and not visitor_id:
        return None

    user_wishlist = None
    if user:
        user_wishlist_name = frappe.db.exists("Wishlist", {"user": user})
        if user_wishlist_name:
            user_wishlist = frappe.get_doc("Wishlist", user_wishlist_name)

    guest_wishlist = None
    if visitor_id:
        guest_wishlist_name = frappe.db.exists("Wishlist", {"visitor_id": visitor_id})
        if guest_wishlist_name:
            guest_wishlist = frappe.get_doc("Wishlist", guest_wishlist_name)

    if user:
        if user_wishlist:
            if guest_wishlist and guest_wishlist.name != user_wishlist.name:
                for item in guest_wishlist.items:
                    if not any(user_item.product == item.product for user_item in user_wishlist.items):
                        user_wishlist.append("items", item.as_dict())
                user_wishlist.save(ignore_permissions=True)
                frappe.delete_doc("Wishlist", guest_wishlist.name, ignore_permissions=True)
                frappe.db.commit()
            return user_wishlist
        elif guest_wishlist:
            guest_wishlist.user = user
            guest_wishlist.visitor_id = None
            guest_wishlist.save(ignore_permissions=True)
            frappe.db.commit()
            return guest_wishlist
        else:
            new_wishlist = frappe.new_doc("Wishlist")
            new_wishlist.user = user
            new_wishlist.insert(ignore_permissions=True)
            frappe.db.commit()
            return new_wishlist
    elif visitor_id:
        if guest_wishlist:
            return guest_wishlist
        else:
            new_wishlist = frappe.new_doc("Wishlist")
            new_wishlist.visitor_id = visitor_id
            new_wishlist.insert(ignore_permissions=True)
            frappe.db.commit()
            return new_wishlist
    
    return None

# --- Utility Functions ---
def camel_response(data):
    if isinstance(data, dict):
        return dict_keys_to_camel(data)
    elif isinstance(data, list):
        return [dict_keys_to_camel(item) if isinstance(item, dict) else item for item in data]
    return data

def get_full_image_url(path):
    if not path:
        return get_url("/files/placeholder.svg")
    return get_url(path)

# --- API Endpoints (Now using robust parsing) ---

@frappe.whitelist(allow_guest=True)
def add_to_wishlist():
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)
        
        # Extract product_id from the correct level
        payload_data = data[0] if isinstance(data, list) and data else data
        product_id = payload_data.get('productId')

        if not product_id:
            return camel_response([])

        wishlist = get_or_migrate_wishlist(user=user, visitor_id=guest_uid)
        if not wishlist:
            return camel_response([])

        existing = [item.product for item in wishlist.items]
        if product_id not in existing:
            product = frappe.get_doc("Product", product_id)
            product_image, second_image = "", ""
            for img in getattr(product, "product_img", []):
                if getattr(img, "primary_image", 0):
                    product_image = img.image_url if img.cdn_image else img.attach_image
                    break
            for img in getattr(product, "product_img", []):
                if getattr(img, "secondary_image", 0):
                    second_image = img.image_url if img.cdn_image else img.attach_image
                    break
            wishlist.append("items", {
                "product": product.name,
                "product_name": product.product_name,
                "product_image": product_image or None,
                "second_image": second_image or None,
                "price": product.price,
                "slug": product.product_slug
            })
            wishlist.save(ignore_permissions=True)
            frappe.db.commit()

        final_wishlist = frappe.get_doc("Wishlist", wishlist.name)
        items_list = [
            {
                "product": item.product,
                "product_name": item.product_name,
                "product_image": get_full_image_url(item.product_image),
                "second_image": get_full_image_url(item.second_image),
                "price": item.price,
                "added_on": item.added_on,
                "slug": item.slug
            }
            for item in final_wishlist.items
        ]
        return camel_response(items_list)

    except Exception:
        frappe.log_error(title="add_to_wishlist_error", message=frappe.get_traceback())
        return camel_response([])

@frappe.whitelist(allow_guest=True)
def remove_from_wishlist():
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        payload_data = data[0] if isinstance(data, list) and data else data
        product_id = payload_data.get('productId')

        if not product_id:
            return camel_response([])

        wishlist = get_or_migrate_wishlist(user=user, visitor_id=guest_uid)
        if not wishlist:
            return camel_response([])

        original_items = list(wishlist.items)
        wishlist.items = [item for item in original_items if item.product != product_id]
        
        if len(wishlist.items) < len(original_items):
            wishlist.save(ignore_permissions=True)
            frappe.db.commit()

        items_list = [
            {
                "product": item.product,
                "product_name": item.product_name,
                "product_image": get_full_image_url(item.product_image),
                "second_image": get_full_image_url(item.second_image),
                "price": item.price,
                "added_on": item.added_on,
                "slug": item.slug
            }
            for item in wishlist.items
        ]
        return camel_response(items_list)

    except Exception:
        frappe.log_error(title="remove_from_wishlist_error", message=frappe.get_traceback())
        return camel_response([])

@frappe.whitelist(allow_guest=True)
def get_wishlist_items():
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        wishlist = get_or_migrate_wishlist(user=user, visitor_id=guest_uid)
        if not wishlist:
            return camel_response([])

        items = [
            {
                "product": item.product,
                "product_name": item.product_name,
                "product_image": get_full_image_url(item.product_image),
                "second_image": get_full_image_url(item.second_image),
                "price": item.price,
                "added_on": item.added_on,
                "slug": item.slug
            }
            for item in wishlist.items
        ]
        return camel_response(items)

    except Exception:
        frappe.log_error(title="get_wishlist_items_error", message=frappe.get_traceback())
        return camel_response([])

@frappe.whitelist(allow_guest=True)
def is_in_wishlist():
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        payload_data = data[0] if isinstance(data, list) and data else data
        product_id = payload_data.get('productId')

        if not product_id:
            return False

        wishlist = get_or_migrate_wishlist(user=user, visitor_id=guest_uid)
        if not wishlist:
            return False

        product_ids = [item.product for item in wishlist.items]
        return product_id in product_ids

    except Exception:
        frappe.log_error(title="is_in_wishlist_error", message=frappe.get_traceback())
        return False

@frappe.whitelist(allow_guest=True)
def clear_wishlist():
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        wishlist = get_or_migrate_wishlist(user=user, visitor_id=guest_uid)
        if not wishlist:
            return camel_response([])

        wishlist.items = []
        wishlist.save(ignore_permissions=True)
        frappe.db.commit()

        return camel_response([])

    except Exception:
        frappe.log_error(title="clear_wishlist_error", message=frappe.get_traceback())
        return camel_response([])
