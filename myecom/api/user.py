import frappe
from frappe import _
try:
    from frappe.sessions import get_session_by_sid
except ImportError:
    get_session_by_sid = None


@frappe.whitelist(allow_guest=True)
def user_details():
    try:
        sid = frappe.form_dict.get("sid")

        if sid and get_session_by_sid:
            session = get_session_by_sid(sid)
            if session:
                frappe.local.session = session
                frappe.set_user(session.user)
            else:
                return {
                    "loggedIn": False,
                    "details": None,
                    "error": "Invalid or expired session"
                }

        user_id = frappe.session.user

        if not user_id or user_id == "Guest":
            return {
                "loggedIn": False,
                "details": None,
                "error": "User not logged in"
            }

        full_name = frappe.utils.get_fullname(user_id)

        mobile_no = None
        try:
            mobile_no = frappe.db.get_value("User", user_id, "mobile_no")
        except Exception:
            pass  # agar field missing hai toh None hi return hoga

        return {
            "loggedIn": True,
            "details": {
                "email": user_id,
                "full_name": full_name,
                "mobile": mobile_no
            }
        }

    except Exception:
        frappe.log_error(frappe.get_traceback(), "user_details API Error")
        return {
            "loggedIn": False,
            "details": None,
            "error": "Internal server error"
        }
