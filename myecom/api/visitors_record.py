import frappe
from frappe import _

@frappe.whitelist(allow_guest=True)
def create_or_update_visitor():
    visitor_id = frappe.form_dict.get("visitor_id")
    slug = frappe.form_dict.get("slug")

    if not visitor_id or not slug:
        frappe.throw(_("Missing visitor_id or slug"), frappe.ValidationError)

    try:
        doc = frappe.get_doc('Visitors', {'visitor_id': visitor_id})
    except frappe.DoesNotExistError:
        doc = None

    if not doc:
        new_doc = frappe.new_doc('Visitors')
        new_doc.visitor_id = visitor_id
        new_doc.visit_date_time = frappe.utils.now()
        new_doc.last_seen = frappe.utils.now()
        new_doc.visit_count = 1
        new_doc.total_session_time = 0
        new_doc.visit_ip_address = frappe.local.request_ip or frappe.request.remote_addr
        new_doc.append('visit_records', {
            'visitor_ip': frappe.local.request_ip or frappe.request.remote_addr,
            'visit_date_time': frappe.utils.now(),
            'visit_date': frappe.utils.nowdate(),
            'visit_time': frappe.utils.nowtime(),
            'session_time': 0,
            'slug': slug
        })
        new_doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "New visitor record created."}
    else:
        doc.last_seen = frappe.utils.now()
        doc.visit_count += 1
        doc.append('visit_records', {
            'visitor_ip': frappe.local.request_ip or frappe.request.remote_addr,
            'visit_date_time': frappe.utils.now(),
            'visit_date': frappe.utils.nowdate(),
            'visit_time': frappe.utils.nowtime(),
            'session_time': 0,
            'slug': slug
        })
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "Visitor record updated."}

@frappe.whitelist(allow_guest=True)
def update_session_time():
    visitor_id = frappe.form_dict.get("visitor_id")
    session_time = frappe.form_dict.get("session_time")

    if not visitor_id or session_time is None:
        frappe.throw(_("Missing visitor_id or session_time"), frappe.ValidationError)

    try:
        doc = frappe.get_doc('Visitors', {'visitor_id': visitor_id})
        doc.total_session_time += int(session_time)
        if doc.visit_records:
            last_record = doc.visit_records[-1]
            last_record.session_time = int(session_time)
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "Session time updated successfully."}
    except Exception as e:
        frappe.log_error(title='Session Time Update Error', message=str(e))
        return {"status": "error", "message": f"An error occurred: {str(e)}"}