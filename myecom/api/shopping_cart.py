import frappe
from frappe import _
from typing import Optional

def _get_request_value(name: str, default=None):
    if frappe.request and getattr(frappe.request, "json", None):
        return frappe.request.json.get(name, default)
    return frappe.form_dict.get(name, default)

@frappe.whitelist(allow_guest=True)
def _get_or_create_shopping_cart():
    try:
        user = getattr(frappe.session, 'user', None) if frappe.session else None
        
        if user and user not in ["Guest", "guest", "None", "Anonymous"]:
            existing = frappe.db.exists("Shopping Cart", {"user": user})
            if existing:
                return frappe.get_doc("Shopping Cart", existing)
            
            shopping_cart = frappe.new_doc("Shopping Cart")
            shopping_cart.user = user
            shopping_cart.insert(ignore_permissions=True)
            frappe.db.commit()
            return shopping_cart
        
        else:
            visitor_id = None
            if frappe.request and hasattr(frappe.request, 'headers'):
                visitor_id = frappe.request.headers.get("X-Visitor-Id")
            
            if visitor_id:
                existing = frappe.db.exists("Shopping Cart", {"visitor_id": visitor_id})
                if existing:
                    return frappe.get_doc("Shopping Cart", existing)
                
                shopping_cart = frappe.new_doc("Shopping Cart")
                shopping_cart.visitor_id = visitor_id
                shopping_cart.insert(ignore_permissions=True)
                frappe.db.commit()
                return shopping_cart
        
        return None
    except Exception as e:
        frappe.log_error(f"Error in _get_or_create_shopping_cart: {str(e)}")
        return None

def _get_shopping_cart():
    try:
        user = getattr(frappe.session, 'user', None) if frappe.session else None
        
        if user and user not in ["Guest", "guest", "None", "Anonymous"]:
            existing = frappe.db.exists("Shopping Cart", {"user": user})
            if existing:
                return frappe.get_doc("Shopping Cart", existing)
        
        else:
            visitor_id = None
            if frappe.request and hasattr(frappe.request, 'headers'):
                visitor_id = frappe.request.headers.get("X-Visitor-Id")
            
            if visitor_id:
                existing = frappe.db.exists("Shopping Cart", {"visitor_id": visitor_id})
                if existing:
                    return frappe.get_doc("Shopping Cart", existing)
        
        return None
    except Exception as e:
        frappe.log_error(f"Error in _get_shopping_cart: {str(e)}")
        return None

@frappe.whitelist(allow_guest=True)
def add_to_cart(product_id: Optional[str] = None, qty: int = 1):
    try:
        if not product_id:
            product_id = _get_request_value("product_id")
        if not qty:
            qty = _get_request_value("qty", 1)

        if not product_id:
            return {"success": False, "message": _("Product ID required")}

        shopping_cart = _get_or_create_shopping_cart()
        if not shopping_cart:
            return {"success": False, "message": _("Failed to create shopping cart")}

        existing_item = None
        for item in shopping_cart.items:
            if str(getattr(item, 'product', '')) == str(product_id):
                existing_item = item
                break

        if existing_item:
            existing_item.qty = (getattr(existing_item, 'qty', 0) or 0) + int(qty)
        else:
            product_name = ""
            product_image = ""
            second_image = ""
            price = 0
            slug = ""

            try:
                p = frappe.get_doc("Product", product_id)
                product_name = getattr(p, "product_name", "") or getattr(p, "name", "")
                price = getattr(p, "price", 0) or 0
                slug = getattr(p, "product_slug", "") or ""
                images = getattr(p, "product_img", [])
                if images:
                    primary_img = next((img for img in images if getattr(img, "primary_image", 0)), None)
                    secondary_img = next((img for img in images if getattr(img, "secondary_image", 0)), None)
                    if primary_img:
                        product_image = getattr(primary_img, "image_url", "") or getattr(primary_img, "attach_image", "")
                    if secondary_img:
                        second_image = getattr(secondary_img, "image_url", "") or getattr(secondary_img, "attach_image", "")
            except Exception:
                product_name = str(product_id)

            shopping_cart.append("items", {
                "product": product_id,
                "product_name": product_name,
                "product_image": product_image or None,
                "second_image": second_image or None,
                "price": price,
                "qty": int(qty),
                "slug": slug
            })

        shopping_cart.save(ignore_permissions=True)
        frappe.db.commit()

        return {"success": True, "message": _("Added to shopping cart"), "count": len(getattr(shopping_cart, 'items', []))}

    except Exception as e:
        frappe.log_error(f"Error in add_to_cart: {str(e)}")
        return {"success": False, "message": _("An error occurred while adding to cart")}

@frappe.whitelist(allow_guest=True)
def remove_from_cart(product_id: Optional[str] = None):
    try:
        if not product_id:
            product_id = _get_request_value("product_id")

        if not product_id:
            return {"success": False, "message": _("Product ID required")}

        shopping_cart = _get_shopping_cart()
        if not shopping_cart:
            return {"success": False, "message": _("Shopping Cart not found")}

        removed = False
        for item in list(getattr(shopping_cart, 'items', [])):
            if str(getattr(item, 'product', '')) == str(product_id):
                shopping_cart.remove(item)
                removed = True
                break

        shopping_cart.save(ignore_permissions=True)
        frappe.db.commit()

        if removed:
            return {"success": True, "message": _("Removed from shopping cart"), "count": len(getattr(shopping_cart, 'items', []))}
        return {"success": False, "message": _("Product not found in shopping cart")}
    
    except Exception as e:
        frappe.log_error(f"Error in remove_from_cart: {str(e)}")
        return {"success": False, "message": _("An error occurred while removing from cart")}

@frappe.whitelist(allow_guest=True)
def get_cart_items():
    try:
        shopping_cart = _get_shopping_cart()
        if not shopping_cart:
            return {"success": True, "items": [], "total": 0}

        items = []
        for item in getattr(shopping_cart, 'items', []):
            items.append({
                "product": getattr(item, "product", ""),
                "product_name": getattr(item, "product_name", ""),
                "product_image": getattr(item, "product_image", None),
                "second_image": getattr(item, "second_image", None),
                "price": getattr(item, "price", 0),
                "qty": getattr(item, "qty", 0),
                "slug": getattr(item, "slug", ""),
                "added_on": getattr(item, "creation", None),
            })

        return {"success": True, "items": items, "total": len(items)}
    
    except Exception as e:
        frappe.log_error(f"Error in get_cart_items: {str(e)}")
        return {"success": True, "items": [], "total": 0}

@frappe.whitelist(allow_guest=True)
def update_quantity(product_id: Optional[str] = None, qty: Optional[int] = None):
    try:
        if not product_id:
            product_id = _get_request_value("product_id")
        if qty is None:
            qty = _get_request_value("qty")

        if not product_id:
            return {"success": False, "message": _("Product ID required")}

        try:
            qty = int(qty)
        except Exception:
            return {"success": False, "message": _("Quantity must be a number")}

        if qty < 0:
            return {"success": False, "message": _("Quantity must be a non-negative number")}

        shopping_cart = _get_shopping_cart()
        if not shopping_cart:
            return {"success": False, "message": _("Shopping Cart not found")}

        existing_item = None
        for item in getattr(shopping_cart, 'items', []):
            if str(getattr(item, 'product', '')) == str(product_id):
                existing_item = item
                break

        if existing_item:
            if qty == 0:
                shopping_cart.remove(existing_item)
            else:
                existing_item.qty = qty

            shopping_cart.save(ignore_permissions=True)
            frappe.db.commit()
            return {"success": True, "message": _("Shopping Cart updated"), "count": len(getattr(shopping_cart, 'items', []))}

        return {"success": False, "message": _("Product not found in shopping cart")}
    
    except Exception as e:
        frappe.log_error(f"Error in update_quantity: {str(e)}")
        return {"success": False, "message": _("An error occurred while updating quantity")}

@frappe.whitelist(allow_guest=True)
def clear_cart():
    try:
        shopping_cart = _get_shopping_cart()
        if not shopping_cart:
            return {"success": False, "message": _("Shopping Cart not found")}

        setattr(shopping_cart, 'items', [])
        shopping_cart.save(ignore_permissions=True)
        frappe.db.commit()

        return {"success": True, "message": _("Shopping Cart cleared"), "count": 0}
    
    except Exception as e:
        frappe.log_error(f"Error in clear_cart: {str(e)}")
        return {"success": False, "message": _("An error occurred while clearing cart")}