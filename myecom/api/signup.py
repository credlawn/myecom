import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def create_user_request(id, full_name, email, mobile, password):
    try:

        if not id or not full_name or not email or not password:
            return {
                "success": False,
                "error": _("Missing required fields")
            }

        if frappe.db.exists("User Request", {"email": email}):
            return {
                "success": False,
                "error": _("Email already exists")
            }

        if frappe.db.exists("User Request", {"mobile": mobile}):
            return {
                "success": False,
                "error": _("Mobile already exists")
            }

        if frappe.db.exists("User", {"email": email}):
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

        return {
            "success": True,
            "message": _("User request created successfully"),
            "request_id": id
        }

    except frappe.DuplicateEntryError as de:
        frappe.db.rollback()
        return {
            "success": False,
            "error": _("Duplicate entry found")
        }
    except Exception as e:
        frappe.db.rollback()
        return {
            "success": False,
            "error": _("Internal Server Error")
        }


@frappe.whitelist(allow_guest=True)
def check_pending_request(id):
    try:
        
        user_request = frappe.db.get_value(
            "User Request", 
            {"id": id, "status": "Pending"}, 
            as_dict=True
        )
        if user_request:
            
            return {
                "has_pending": True,
                "request": user_request
            }
        else:
            
            return {
                "has_pending": False
            }
    except Exception as e:
        frappe.log_error(f"Exception in check_pending_request: {str(e)}", "Check Pending Request Error")
        return {
            "has_pending": False,
            "error": str(e)
        }
