import frappe
from frappe.auth import LoginManager
import json

@frappe.whitelist(allow_guest=True)
def ecom_login(usr: str = None, pwd: str = None, visitor_id: str = None):
    try:
        # If usr and pwd are not passed as arguments, try to get them from form_dict
        if not usr:
            usr = frappe.form_dict.get("usr")
        if not pwd:
            pwd = frappe.form_dict.get("pwd")

        if not usr or not pwd:
            frappe.local.response["http_status_code"] = 400
            return {"status": "error", "message": "usr and pwd required"}

        lm = LoginManager()
        lm.authenticate(user=usr, pwd=pwd)
        lm.post_login()
        user = frappe.session.user

        if not visitor_id:
            try:
                visitor_id = frappe.local.request.cookies.get("visitor_id")
            except Exception:
                visitor_id = None

        if visitor_id:

            for doctype in ["Shopping Cart", "Wishlist", "Visitors"]:
                try:
                    visitor_docs = frappe.get_all(doctype, filters={"visitor_id": visitor_id}, fields=["name"])
                except Exception as e:
                    frappe.log_error(message=f"error fetching {doctype} for visitor {visitor_id}: {e}", title="ecommerce_login")
                    visitor_docs = []

                for v in visitor_docs:
                    try:
                        vdoc = frappe.get_doc(doctype, v.name)
                    except Exception as e:
                        frappe.log_error(message=f"could not load {doctype} {v.name}: {e}", title="ecommerce_login")
                        continue

                    user_docs = frappe.get_all(doctype, filters={"user": user}, fields=["name"], limit=1)
                    if user_docs:
                        try:
                            ud = frappe.get_doc(doctype, user_docs[0].name)
                        except Exception as e:
                            frappe.log_error(message=f"could not load user {doctype} doc for {user}: {e}", title="ecommerce_login")
                            continue

                        if doctype == "Visitors":
                            ud.visit_count = (ud.visit_count or 0) + (vdoc.visit_count or 0)
                            ud.total_session_time = (ud.total_session_time or 0) + (vdoc.total_session_time or 0)
                            for v_record in getattr(vdoc, "visit_records", []):
                                ud.append("visit_records", v_record.as_dict())
                        else:
                            for vitem in getattr(vdoc, "items", []):
                                if doctype == "Shopping Cart":
                                    match = next((uitem for uitem in getattr(ud, "items", []) if (uitem.product == vitem.product)), None)
                                    if match:
                                        try:
                                            existing_qty = int(match.qty or 0)
                                        except Exception:
                                            existing_qty = 0
                                        try:
                                            vqty = int(vitem.qty or 0)
                                        except Exception:
                                            vqty = 0
                                        match.qty = existing_qty + vqty
                                    else:
                                        ud.append("items", {
                                            "product": vitem.product,
                                            "product_name": getattr(vitem, "product_name", None),
                                            "product_image": getattr(vitem, "product_image", None),
                                            "price": getattr(vitem, "price", None),
                                            "qty": getattr(vitem, "qty", None),
                                            "slug": getattr(vitem, "slug", None),
                                            "second_image": getattr(vitem, "second_image", None)
                                        })
                                else: # Wishlist
                                    match = next((uitem for uitem in getattr(ud, "items", []) if (uitem.product == vitem.product)), None)
                                    if not match:
                                        ud.append("items", {
                                            "product": vitem.product,
                                            "product_name": getattr(vitem, "product_name", None),
                                            "product_image": getattr(vitem, "product_image", None),
                                            "price": getattr(vitem, "price", None),
                                            "second_image": getattr(vitem, "second_image", None),
                                            "added_on": getattr(vitem, "added_on", None),
                                            "slug": getattr(vitem, "slug", None)
                                        })
                        try:
                            ud.save(ignore_permissions=True)
                        except Exception as e:
                            frappe.log_error(message=f"error saving user {doctype} doc {ud.name}: {e}", title="ecommerce_login")
                        try:
                            frappe.delete_doc(doctype, vdoc.name, ignore_permissions=True)
                        except Exception as e:
                            frappe.log_error(message=f"error deleting visitor {doctype} doc {vdoc.name}: {e}", title="ecommerce_login")
                    else:
                        try:
                            vdoc.user = user
                            vdoc.visitor_id = None
                            vdoc.save(ignore_permissions=True)
                        except Exception as e:
                            frappe.log_error(message=f"error assigning visitor {doctype} {vdoc.name} to user {user}: {e}", title="ecommerce_login")

        try:
            frappe.db.commit()
        except Exception as e:
            frappe.log_error(message=f"db commit error: {e}", title="ecommerce_login")

        try:
            frappe.local.response.cookies["visitor_id"] = {
                "value": "",
                "expires": "Thu, 01 Jan 1970 00:00:00 GMT",
                "path": "/"
            }
        except Exception as e:
            frappe.log_error(message=f"could not clear visitor_id cookie: {e}", title="ecommerce_login")

        sid = getattr(frappe.session, "sid", None)
        full_name = frappe.get_value("User", user, "full_name")
        email = frappe.get_value("User", user, "email")

        return {"status": "success", "sid": sid, "user": user, "full_name": full_name, "email": email}
    except Exception as e:
        frappe.log_error(message=f"ecommerce_login error: {e}", title="ecommerce_login")
        frappe.clear_messages()
        frappe.local.response["http_status_code"] = 401
        return {"status": "error", "message": str(e)}