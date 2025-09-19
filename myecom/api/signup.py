import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def create_user_request(id, full_name, email, mobile, password):
    try:
        frappe.log_error(f"Creating user request with id: {id}, email: {email}", "Create User Request Debug")  # debug log

        if not id or not full_name or not email or not password:
            frappe.log_error("Missing required fields", "Create User Request Debug")
            return {
                "success": False,
                "error": _("Missing required fields")
            }

        if frappe.db.exists("User Request", {"email": email}):
            frappe.log_error(f"Email already exists in User Request: {email}", "Create User Request Debug")
            return {
                "success": False,
                "error": _("Email already exists")
            }

        if frappe.db.exists("User Request", {"mobile": mobile}):
            frappe.log_error(f"Mobile already exists in User Request: {mobile}", "Create User Request Debug")
            return {
                "success": False,
                "error": _("Mobile already exists")
            }

        if frappe.db.exists("User", {"email": email}):
            frappe.log_error(f"Email already registered in User: {email}", "Create User Request Debug")
            return {
                "success": False,
                "error": _("Email already registered")
            }

        user_request = frappe.get_doc({
            "doctype": "User Request",
            "id": id,
            "full_name": full_name,
            "email": email,
            "mobile": mobile,
            "password": password,
            "status": "Pending",
            "requested_on": frappe.utils.now()
        })

        user_request.insert(ignore_permissions=True)
        frappe.db.commit()

        frappe.log_error(f"User request created successfully: {id}", "Create User Request Debug")  # debug log
        return {
            "success": True,
            "message": _("User request created successfully"),
            "request_id": id
        }

    except frappe.DuplicateEntryError as de:
        frappe.db.rollback()
        frappe.log_error(f"Duplicate entry error: {str(de)}", "User Request Creation Error")
        return {
            "success": False,
            "error": _("Duplicate entry found")
        }
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(frappe.get_traceback(), "User Request Creation Error")
        return {
            "success": False,
            "error": _("Internal Server Error")
        }


@frappe.whitelist(allow_guest=True)
def check_pending_request(id):
    try:
        frappe.log_error(f"Checking pending request for id: {id}", "Check Pending Request Debug")  # debug log
        user_request = frappe.db.get_value(
            "User Request", 
            {"id": id, "status": "Pending"}, 
            as_dict=True
        )
        if user_request:
            frappe.log_error(f"Pending request found: {user_request}", "Check Pending Request Debug")
            return {
                "has_pending": True,
                "request": user_request
            }
        else:
            frappe.log_error("No pending request found", "Check Pending Request Debug")
            return {
                "has_pending": False
            }
    except Exception as e:
        frappe.log_error(f"Exception in check_pending_request: {str(e)}", "Check Pending Request Error")
        return {
            "has_pending": False,
            "error": str(e)
        }
