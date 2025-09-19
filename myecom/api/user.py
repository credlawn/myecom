import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def user_details():
    try:
        sid = frappe.form_dict.get("sid")
        frappe.log_error(f"Incoming SID: {sid}", "user_details Debug")  # debug log

        if sid:
            session = frappe.session_store.get_session_by_sid(sid)
            if session:
                frappe.local.session = session
                frappe.set_user(session.user)
            else:
                frappe.log_error(f"Invalid or expired session for SID: {sid}", "user_details Debug")
                return {
                    "loggedIn": False,
                    "details": None,
                    "error": "Invalid or expired session"
                }

        user_id = frappe.session.user
        frappe.log_error(f"Current user: {user_id}", "user_details Debug")  # debug log

        if not user_id or user_id == "Guest":
            return {
                "loggedIn": False,
                "details": None,
                "error": "User not logged in"
            }

        full_name = frappe.utils.get_fullname(user_id)

        try:
            mobile_no = frappe.db.get_value("User", user_id, "mobile_no")
        except Exception as ex:
            frappe.log_error(f"Error fetching mobile_no: {ex}", "user_details Debug")
            mobile_no = None

        return {
            "loggedIn": True,
            "details": {
                "email": user_id,
                "full_name": full_name,
                "mobile": mobile_no
            }
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "user_details API Error")
        return {
            "loggedIn": False,
            "details": None,
            "error": "Internal server error"
        }
