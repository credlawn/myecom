import frappe
from frappe import _
from typing import Optional

def _extract_auth_user(user: Optional[str] = None) -> Optional[str]:
    if user:
        return user
    authorization = frappe.get_request_header("Authorization")
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1]
        try:
            from frappe.utils.jwt import decode
            payload = decode(token)
            user = payload.get("user")
            if user:
                try:
                    frappe.set_user(user)
                except Exception:
                    pass
                return user
        except Exception:
            return None
    return None

def _get_request_value(name: str, default=None):
    if frappe.request and getattr(frappe.request, "json", None):
        return frappe.request.json.get(name, default)
    return frappe.form_dict.get(name, default)

def _get_or_create_shopping_cart(user: Optional[str] = None, visitor_id: Optional[str] = None):
    filters = {}
    if user:
        filters["user"] = user
    elif visitor_id:
        filters["visitor_id"] = visitor_id
    else:
        return None

    existing = frappe.db.exists("Shopping Cart", filters)
    if existing:
        return frappe.get_doc("Shopping Cart", existing)

    shopping_cart = frappe.new_doc("Shopping Cart")
    if user:
        shopping_cart.user = user
    if visitor_id:
        shopping_cart.visitor_id = visitor_id
    shopping_cart.insert(ignore_permissions=True)
    frappe.db.commit()
    return shopping_cart

def _get_shopping_cart(user: Optional[str] = None, visitor_id: Optional[str] = None):
    filters = {}
    if user:
        filters["user"] = user
    elif visitor_id:
        filters["visitor_id"] = visitor_id
    else:
        return None

    existing = frappe.db.exists("Shopping Cart", filters)
    return frappe.get_doc("Shopping Cart", existing) if existing else None

@frappe.whitelist(allow_guest=True)
def add_to_cart(product_id: Optional[str] = None, qty: int = 1, user: Optional[str] = None, visitor_id: Optional[str] = None, **kwargs):
    if not product_id:
        product_id = _get_request_value("product_id")
    if not qty:
        qty = _get_request_value("qty", 1)

    if not visitor_id:
        visitor_id = frappe.get_request_header("X-Visitor-Id")

    user = _extract_auth_user(user)

    if not product_id:
        return {"success": False, "message": _("Product ID required")}

    shopping_cart = _get_or_create_shopping_cart(user, visitor_id)
    if not shopping_cart:
        return {"success": False, "message": _("Failed to create shopping cart")}

    existing_item = None
    for item in shopping_cart.items:
        if str(item.product) == str(product_id):
            existing_item = item
            break

    if existing_item:
        existing_item.qty = (existing_item.qty or 0) + int(qty)
    else:
        # try to fetch product details if Product Doc exists
        product_name = ""
        product_image = ""
        price = 0
        slug = ""
        try:
            p = frappe.get_doc("Product", product_id)
            product_name = getattr(p, "product_name", "") or getattr(p, "name", "")
            product_image = getattr(p, "product_image_1", "") or getattr(p, "image", "") or ""
            price = getattr(p, "price", 0) or 0
            slug = getattr(p, "product_slug", "") or ""
        except Exception:
            product_name = str(product_id)

        shopping_cart.append("items", {
            "product": product_id,
            "product_name": product_name,
            "product_image": product_image or None,
            "price": price,
            "qty": int(qty),
            "slug": slug
        })

    shopping_cart.save(ignore_permissions=True)
    frappe.db.commit()

    return {"success": True, "message": _("Added to shopping cart"), "count": len(shopping_cart.items)}

@frappe.whitelist(allow_guest=True)
def remove_from_cart(product_id: Optional[str] = None, user: Optional[str] = None, visitor_id: Optional[str] = None, **kwargs):
    if not product_id:
        product_id = _get_request_value("product_id")

    if not visitor_id:
        visitor_id = frappe.get_request_header("X-Visitor-Id")

    user = _extract_auth_user(user)

    if not product_id:
        return {"success": False, "message": _("Product ID required")}

    shopping_cart = _get_shopping_cart(user, visitor_id)
    if not shopping_cart:
        return {"success": False, "message": _("Shopping Cart not found")}

    removed = False
    for item in list(shopping_cart.items):
        if str(item.product) == str(product_id):
            shopping_cart.remove(item)
            removed = True
            break

    shopping_cart.save(ignore_permissions=True)
    frappe.db.commit()

    if removed:
        return {"success": True, "message": _("Removed from shopping cart"), "count": len(shopping_cart.items)}
    return {"success": False, "message": _("Product not found in shopping cart")}

@frappe.whitelist(allow_guest=True)
def get_cart_items(user: Optional[str] = None, visitor_id: Optional[str] = None):
    if not visitor_id:
        visitor_id = frappe.get_request_header("X-Visitor-Id")

    user = _extract_auth_user(user)

    shopping_cart = _get_shopping_cart(user, visitor_id)
    if not shopping_cart:
        return {"success": True, "items": [], "total": 0}

    items = []
    for item in shopping_cart.items:
        items.append({
            "product": item.product,
            "product_name": item.product_name,
            "product_image": getattr(item, "product_image", None),
            "price": getattr(item, "price", 0),
            "qty": getattr(item, "qty", 0),
            "slug": getattr(item, "slug", ""),
            "added_on": getattr(item, "creation", None),
        })

    return {"success": True, "items": items, "total": len(items)}

@frappe.whitelist(allow_guest=True)
def update_quantity(product_id: Optional[str] = None, qty: Optional[int] = None, user: Optional[str] = None, visitor_id: Optional[str] = None, **kwargs):
    if not product_id:
        product_id = _get_request_value("product_id")
    if qty is None:
        qty = _get_request_value("qty")

    if not visitor_id:
        visitor_id = frappe.get_request_header("X-Visitor-Id")

    user = _extract_auth_user(user)

    if not product_id:
        return {"success": False, "message": _("Product ID required")}
    try:
        qty = int(qty)
    except Exception:
        return {"success": False, "message": _("Quantity must be a number")}

    if qty < 0:
        return {"success": False, "message": _("Quantity must be a non-negative number")}

    shopping_cart = _get_shopping_cart(user, visitor_id)
    if not shopping_cart:
        return {"success": False, "message": _("Shopping Cart not found")}

    existing_item = None
    for item in shopping_cart.items:
        if str(item.product) == str(product_id):
            existing_item = item
            break

    if existing_item:
        if qty == 0:
            shopping_cart.remove(existing_item)
        else:
            existing_item.qty = qty

        shopping_cart.save(ignore_permissions=True)
        frappe.db.commit()
        return {"success": True, "message": _("Shopping Cart updated"), "count": len(shopping_cart.items)}

    return {"success": False, "message": _("Product not found in shopping cart")}

@frappe.whitelist(allow_guest=True)
def clear_cart(user: Optional[str] = None, visitor_id: Optional[str] = None):
    if not visitor_id:
        visitor_id = frappe.get_request_header("X-Visitor-Id")

    user = _extract_auth_user(user)

    shopping_cart = _get_shopping_cart(user, visitor_id)
    if not shopping_cart:
        return {"success": False, "message": _("Shopping Cart not found")}

    shopping_cart.items = []
    shopping_cart.save(ignore_permissions=True)
    frappe.db.commit()

    return {"success": True, "message": _("Shopping Cart cleared"), "count": 0}
