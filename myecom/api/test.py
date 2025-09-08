import frappe
from frappe import _

@frappe.whitelist(allow_guest=False)
def get_test_data():
    try:
        tests = frappe.get_all("Test", fields=["name", "test_name", "user"])
        return {"success": True, "data": tests}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "get_test_data")
        return {"success": False, "message": str(e)}

@frappe.whitelist(allow_guest=False)
def create_test(test_name=None):
    try:
        if not test_name:
            return {"success": False, "message": _("Test name is required")}

        doc = frappe.get_doc({
            "doctype": "Test",
            "test_name": test_name,
            "user": frappe.session.user
        })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return {"success": True, "data": {"name": doc.name}}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "create_test")
        return {"success": False, "message": str(e)}
