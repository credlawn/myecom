import frappe
from frappe import _
from typing import Optional

def _get_request_value(name: str, default=None):
    if frappe.request and getattr(frappe.request, "json", None):
        return frappe.request.json.get(name, default)
    return frappe.form_dict.get(name, default)

def _get_auth_user():
    user = getattr(frappe.session, 'user', None) if frappe.session else None
    return user

def _get_or_create_wishlist(user: Optional[str] = None, visitor_id: Optional[str] = None):
    try:
        if not user:
            user = _get_auth_user()
        
        if not visitor_id and not user:
            if frappe.request and hasattr(frappe.request, 'headers'):
                visitor_id = frappe.request.headers.get("X-Visitor-Id")
        
        filters = {}
        if user and user not in ["Guest", "guest", "None", "Anonymous"]:
            filters["user"] = user
        elif visitor_id:
            filters["visitor_id"] = visitor_id
        else:
            return None

        existing = frappe.db.exists("Wishlist", filters)
        if existing:
            return frappe.get_doc("Wishlist", existing)

        wishlist = frappe.new_doc("Wishlist")
        if user and user not in ["Guest", "guest", "None", "Anonymous"]:
            wishlist.user = user
        if visitor_id:
            wishlist.visitor_id = visitor_id
        wishlist.insert(ignore_permissions=True)
        frappe.db.commit()
        return wishlist
    
    except Exception as e:
        frappe.log_error(f"Error in _get_or_create_wishlist: {str(e)}")
        return None

def _get_wishlist(user: Optional[str] = None, visitor_id: Optional[str] = None):
    """Get existing wishlist for user or visitor"""
    try:
        # Get current user from session
        if not user:
            user = _get_auth_user()
        
        # Get visitor_id from headers if not provided
        if not visitor_id and not user:
            if frappe.request and hasattr(frappe.request, 'headers'):
                visitor_id = frappe.request.headers.get("X-Visitor-Id")
        
        filters = {}
        if user and user not in ["Guest", "guest", "None", "Anonymous"]:
            filters["user"] = user
        elif visitor_id:
            filters["visitor_id"] = visitor_id
        else:
            return None

        existing = frappe.db.exists("Wishlist", filters)
        return frappe.get_doc("Wishlist", existing) if existing else None
    
    except Exception as e:
        frappe.log_error(f"Error in _get_wishlist: {str(e)}")
        return None

@frappe.whitelist(allow_guest=True)
def add_to_wishlist(product_id: Optional[str] = None):
    try:
        if not product_id:
            product_id = _get_request_value("product_id")
        
        if not product_id:
            return {"success": False, "message": _("Product ID required")}

        wishlist = _get_or_create_wishlist()
        if not wishlist:
            return {"success": False, "message": _("Failed to create wishlist")}

        # Check if product already in wishlist
        existing_products = [str(getattr(item, 'product', '')) for item in wishlist.items]
        if str(product_id) in existing_products:
            return {"success": False, "message": _("Already in wishlist")}

        # Fetch product details
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

        wishlist.append("items", {
            "product": product_id,
            "product_name": product_name,
            "product_image": product_image or None,
            "second_image": second_image or None,
            "price": price,
            "slug": slug
        })

        wishlist.save(ignore_permissions=True)
        frappe.db.commit()

        return {"success": True, "message": _("Added to wishlist"), "count": len(getattr(wishlist, 'items', []))}

    except Exception as e:
        frappe.log_error(f"Error in add_to_wishlist: {str(e)}")
        return {"success": False, "message": _("An error occurred while adding to wishlist")}

@frappe.whitelist(allow_guest=True)
def remove_from_wishlist(product_id: Optional[str] = None):
    try:
        if not product_id:
            product_id = _get_request_value("product_id")

        if not product_id:
            return {"success": False, "message": _("Product ID required")}

        wishlist = _get_wishlist()
        if not wishlist:
            return {"success": False, "message": _("Wishlist not found")}

        removed = False
        for item in list(getattr(wishlist, 'items', [])):
            if str(getattr(item, 'product', '')) == str(product_id):
                wishlist.remove(item)
                removed = True
                break

        wishlist.save(ignore_permissions=True)
        frappe.db.commit()

        if removed:
            return {"success": True, "message": _("Removed from wishlist"), "count": len(getattr(wishlist, 'items', []))}
        return {"success": False, "message": _("Product not found in wishlist")}
    
    except Exception as e:
        frappe.log_error(f"Error in remove_from_wishlist: {str(e)}")
        return {"success": False, "message": _("An error occurred while removing from wishlist")}

@frappe.whitelist(allow_guest=True)
def get_wishlist_items():
    try:
        wishlist = _get_wishlist()
        if not wishlist:
            return {"success": True, "items": [], "total": 0}

        items = []
        for item in getattr(wishlist, 'items', []):
            items.append({
                "product": getattr(item, "product", ""),
                "product_name": getattr(item, "product_name", ""),
                "product_image": getattr(item, "product_image", None),
                "second_image": getattr(item, "second_image", None),
                "price": getattr(item, "price", 0),
                "added_on": getattr(item, "creation", None),
                "slug": getattr(item, "slug", ""),
            })

        return {"success": True, "items": items, "total": len(items)}
    
    except Exception as e:
        frappe.log_error(f"Error in get_wishlist_items: {str(e)}")
        return {"success": True, "items": [], "total": 0}

@frappe.whitelist(allow_guest=True)
def is_in_wishlist(product_id: Optional[str] = None):
    try:
        if not product_id:
            product_id = _get_request_value("product_id")

        if not product_id:
            return {"success": False, "message": _("Product ID required")}

        wishlist = _get_wishlist()
        if not wishlist:
            return {"success": True, "in_wishlist": False}

        product_ids = [str(getattr(item, 'product', '')) for item in getattr(wishlist, 'items', [])]
        return {"success": True, "in_wishlist": str(product_id) in product_ids}
    
    except Exception as e:
        frappe.log_error(f"Error in is_in_wishlist: {str(e)}")
        return {"success": False, "message": _("An error occurred while checking wishlist")}

@frappe.whitelist(allow_guest=True)
def clear_wishlist():
    try:
        wishlist = _get_wishlist()
        if not wishlist:
            return {"success": True, "message": _("Wishlist already empty"), "count": 0}

        setattr(wishlist, 'items', [])
        wishlist.save(ignore_permissions=True)
        frappe.db.commit()

        return {"success": True, "message": _("Wishlist cleared"), "count": 0}
    
    except Exception as e:
        frappe.log_error(f"Error in clear_wishlist: {str(e)}")
        return {"success": False, "message": _("An error occurred while clearing wishlist")}