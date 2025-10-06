
import frappe
from frappe import _
import json
from collections import defaultdict
from .camel_case import dict_keys_to_camel
from frappe.utils import get_url


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

def get_or_migrate_cart(user=None, visitor_id=None):
    
    if not user and not visitor_id:
        return None

    user_cart = None
    if user:
        user_cart_name = frappe.db.exists("Shopping Cart", {"user": user})
        if user_cart_name:
            user_cart = frappe.get_doc("Shopping Cart", user_cart_name)

    guest_cart = None
    if visitor_id:
        guest_cart_name = frappe.db.exists("Shopping Cart", {"visitor_id": visitor_id})
        if guest_cart_name:
            guest_cart = frappe.get_doc("Shopping Cart", guest_cart_name)

    if user:
        if user_cart:
            # User cart exists. Merge guest cart into it if necessary.
            if guest_cart and guest_cart.name != user_cart.name:
                for guest_item in guest_cart.items:
                    found = False
                    for user_item in user_cart.items:
                        if user_item.product == guest_item.product:
                            # Item exists, so update quantity
                            user_item.qty += guest_item.qty
                            found = True
                            break
                    if not found:
                        # Item does not exist, add it to the user's cart
                        user_cart.append("items", guest_item.as_dict())
                
                user_cart.save(ignore_permissions=True)
                frappe.delete_doc("Shopping Cart", guest_cart.name, ignore_permissions=True)
                frappe.db.commit()
            return user_cart
        elif guest_cart:
            # No user cart, but guest cart exists -> claim it.
            guest_cart.user = user
            guest_cart.visitor_id = None
            guest_cart.save(ignore_permissions=True)
            frappe.db.commit()
            return guest_cart
        else:
            # No carts exist for this user/guest -> create a new user cart.
            new_cart = frappe.new_doc("Shopping Cart")
            new_cart.user = user
            new_cart.insert(ignore_permissions=True)
            frappe.db.commit()
            return new_cart
    elif visitor_id:
        # Guest-only logic
        if guest_cart:
            return guest_cart
        else:
            # New guest, create a new guest cart.
            new_cart = frappe.new_doc("Shopping Cart")
            new_cart.visitor_id = visitor_id
            new_cart.insert(ignore_permissions=True)
            frappe.db.commit()
            return new_cart
    
    return None

# --- Utility Functions ---
def camel_response(data):
    """Converts response dictionary keys to camelCase."""
    if isinstance(data, dict):
        return dict_keys_to_camel(data)
    elif isinstance(data, list):
        return [dict_keys_to_camel(item) if isinstance(item, dict) else item for item in data]
    return data

def get_full_image_url(path):
    """Returns the full URL for an image path."""
    if not path or path == "/images/placeholder.jpg":
        return get_url("/files/placeholder.svg")
    return get_url(path)

def get_cart_items_list(cart_doc):
    """Formats the items from a cart document into a list of dictionaries."""
    if not cart_doc:
        return []
    
    items_list = []
    for item in cart_doc.items:
        try:
            product_doc = frappe.get_doc("Product", item.product)
            
            if product_doc.unlisted == 1:
                raise frappe.DoesNotExistError # Treat unlisted as non-existent for cart display

            current_price = product_doc.price
            price_at_add = item.price_at_add

            price_changed = False
            # Ensure price_at_add is not None before comparing
            if price_at_add is not None and float(current_price) != float(price_at_add):
                price_changed = True

            items_list.append({
                "product": item.product,
                "product_name": item.product_name,
                "product_image": get_full_image_url(item.product_image),
                "second_image": get_full_image_url(item.second_image),
                "price": current_price,  # Always show the current price to the user
                "qty": item.qty,
                "slug": item.slug,
                "price_changed": price_changed,
                "old_price": price_at_add if price_changed else None,
                "product_rating": product_doc.product_rating,
                "rating_count": product_doc.rating_count,
                "review_count": product_doc.review_count,
                "units_sold": product_doc.units_sold,
                "min_purchase_qty": product_doc.min_purchase_qty,
                "discounted_price": product_doc.discounted_price,
                "discount_percent": product_doc.discount_percent,
                "discount_amount": product_doc.discount_amount,
                "stock": product_doc.stock,
                "nd_text": product_doc.nd_text,
                "short_description": product_doc.short_description,
            })
        except frappe.DoesNotExistError:
            # Handle cases where the product might have been deleted
            # You could add a specific flag for this
            items_list.append({
                "product": item.product,
                "product_name": "Product Not Found",
                "product_image": get_full_image_url(None),
                "second_image": get_full_image_url(None),
                "price": 0,
                "qty": item.qty,
                "slug": "",
                "price_changed": False,
                "old_price": None,
                "deleted": True # Add a flag for deleted products
            })

    return items_list

# --- API Endpoints ---

@frappe.whitelist(allow_guest=True)
def add_to_cart():
    """Adds a product to the cart or updates its quantity."""
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)
        
        payload_data = data[0] if isinstance(data, list) and data else data
        product_id = payload_data.get('productId')
        qty = int(payload_data.get('qty', 1))

        if not product_id or qty <= 0:
            frappe.throw(_("Valid Product ID and quantity are required."))

        cart = get_or_migrate_cart(user=user, visitor_id=guest_uid)
        if not cart:
            frappe.throw(_("Could not retrieve or create a cart."))

        existing_item = next((item for item in cart.items if item.product == product_id), None)

        if existing_item:
            existing_item.qty += qty
        else:
            product_doc = frappe.get_doc("Product", product_id)

            # Logic to get primary and secondary images from the child table
            product_image = None
            second_image = None
            for img_row in product_doc.get("product_img", []):
                if img_row.primary_image:
                    product_image = img_row.image_url if img_row.cdn_image else get_url(img_row.attach_image)
                if img_row.secondary_image:
                    second_image = img_row.image_url if img_row.cdn_image else get_url(img_row.attach_image)

            cart.append("items", {
                "product": product_doc.name,
                "product_name": product_doc.product_name,
                "product_image": product_image,
                "second_image": second_image,
                "price": product_doc.price,
                "price_at_add": product_doc.price,
                "qty": qty,
                "slug": product_doc.product_slug
            })
        
        cart.save(ignore_permissions=True)
        frappe.db.commit()

        # Return the updated list of all items in the cart
        updated_cart = frappe.get_doc("Shopping Cart", cart.name)
        return camel_response(get_cart_items_list(updated_cart))

    except Exception as e:
        frappe.log_error(title=_("Add to Cart Error"), message=frappe.get_traceback())
        frappe.throw(str(e))


@frappe.whitelist(allow_guest=True)
def remove_from_cart():
    """Removes an entire item line from the cart."""
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        payload_data = data[0] if isinstance(data, list) and data else data
        product_id = payload_data.get('productId')

        if not product_id:
            frappe.throw(_("Product ID is required."))

        cart = get_or_migrate_cart(user=user, visitor_id=guest_uid)
        if not cart:
            return camel_response([]) # Return empty list if no cart

        original_items_count = len(cart.items)
        cart.items = [item for item in cart.items if item.product != product_id]
        
        if len(cart.items) < original_items_count:
            cart.save(ignore_permissions=True)
            frappe.db.commit()

        updated_cart = frappe.get_doc("Shopping Cart", cart.name)
        return camel_response(get_cart_items_list(updated_cart))

    except Exception as e:
        frappe.log_error(title=_("Remove From Cart Error"), message=frappe.get_traceback())
        frappe.throw(str(e))


@frappe.whitelist(allow_guest=True)
def update_cart_quantity():
    """Updates the quantity of a specific item in the cart."""
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        payload_data = data[0] if isinstance(data, list) and data else data
        product_id = payload_data.get('productId')
        qty = int(payload_data.get('qty'))

        if not product_id or qty < 0:
            frappe.throw(_("Valid Product ID and non-negative quantity are required."))

        cart = get_or_migrate_cart(user=user, visitor_id=guest_uid)
        if not cart:
            frappe.throw(_("Could not retrieve a cart."))

        item_to_update = next((item for item in cart.items if item.product == product_id), None)

        if not item_to_update:
            frappe.throw(_("Product not found in cart."))

        if qty == 0:
            # Remove item if quantity is zero
            cart.items = [item for item in cart.items if item.product != product_id]
        else:
            item_to_update.qty = qty
            
        cart.save(ignore_permissions=True)
        frappe.db.commit()
        
        updated_cart = frappe.get_doc("Shopping Cart", cart.name)
        return camel_response(get_cart_items_list(updated_cart))

    except Exception as e:
        frappe.log_error(title=_("Update Cart Quantity Error"), message=frappe.get_traceback())
        frappe.throw(str(e))


@frappe.whitelist(allow_guest=True)
def get_cart_items():
    """Retrieves all items currently in the user's or guest's cart."""
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        cart = get_or_migrate_cart(user=user, visitor_id=guest_uid)
        if not cart:
            return camel_response([])

        return camel_response(get_cart_items_list(cart))

    except Exception as e:
        frappe.log_error(title=_("Get Cart Items Error"), message=frappe.get_traceback())
        frappe.throw(str(e))


@frappe.whitelist(allow_guest=True)
def clear_cart():
    """Clears all items from the user's or guest's cart."""
    try:
        data = json.loads(frappe.request.data)
        user, guest_uid = parse_identifiers(data)

        cart = get_or_migrate_cart(user=user, visitor_id=guest_uid)
        if not cart:
            return camel_response([]) # Return empty list if no cart

        cart.items = [] # Clear the items
        cart.save(ignore_permissions=True)
        frappe.db.commit()
        
        return camel_response([]) # Return empty list after clearing

    except Exception as e:
        frappe.log_error(title=_("Clear Cart Error"), message=frappe.get_traceback())
        frappe.throw(str(e))
