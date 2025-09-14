import frappe
from frappe.utils import now, nowdate, nowtime, time_diff_in_seconds, get_datetime
from frappe import _

@frappe.whitelist(allow_guest=True)
def get_current_user():
    user = getattr(frappe.session, "user", None) if frappe.session else None
    if user and user not in ["Guest", "guest", "None", "Anonymous"]:
        return {"status": "success", "user": user}
    return {"status": "error", "user": None}

@frappe.whitelist(allow_guest=True)
def create_or_update_visitor():
    slug = frappe.form_dict.get("slug")
    user = frappe.form_dict.get("user")
    visitor_id = frappe.form_dict.get("visitor_id")

    frappe.log_error(f"user: {user}, visitor_id: {visitor_id}, slug: {slug}", "Visitor Info")

    if not slug or (not user and not visitor_id):
        frappe.throw(_("Missing slug or identifier (user/visitor_id)"), frappe.ValidationError)

    visitor_doc = None
    user_doc = None

    try:
        if visitor_id:
            visitor_doc = frappe.get_doc("Visitors", {"visitor_id": visitor_id})
    except frappe.DoesNotExistError:
        visitor_doc = None
    except frappe.MultipleDocsFoundError:
        doc_list = frappe.get_all("Visitors", filters={"visitor_id": visitor_id}, limit=1)
        if doc_list:
            visitor_doc = frappe.get_doc("Visitors", doc_list[0].name)

    try:
        if user:
            user_doc = frappe.get_doc("Visitors", {"user": user})
    except frappe.DoesNotExistError:
        user_doc = None
    except frappe.MultipleDocsFoundError:
        doc_list = frappe.get_all("Visitors", filters={"user": user}, limit=1)
        if doc_list:
            user_doc = frappe.get_doc("Visitors", doc_list[0].name)

    current_time = now()
    ip_address = frappe.local.request_ip or getattr(frappe.request, "remote_addr", None)

    doc = user_doc or visitor_doc

    if not doc:
        doc = frappe.new_doc("Visitors")
        if user:
            doc.user = user
        else:
            doc.visitor_id = visitor_id

        doc.visit_date_time = current_time
        doc.last_seen = current_time
        doc.visit_count = 1
        doc.total_session_time = 0
        doc.visit_ip_address = ip_address
        doc.current_session_start = current_time
        doc.append("visit_records", {
            "visitor_ip": ip_address,
            "visit_date_time": current_time,
            "visit_date": nowdate(),
            "visit_time": nowtime(),
            "session_time": 0,
            "session_visit_count": 1,
            "slug": slug
        })
        doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "New visitor record created."}

    time_diff = time_diff_in_seconds(current_time, get_datetime(doc.last_seen))
    if time_diff > 1800:
        doc.visit_count += 1
        doc.current_session_start = current_time
    doc.last_seen = current_time

    existing_record = None
    for record in doc.visit_records:
        if record.slug == slug and get_datetime(record.visit_date_time) >= get_datetime(doc.current_session_start):
            existing_record = record
            break

    if not existing_record:
        doc.append("visit_records", {
            "visitor_ip": ip_address,
            "visit_date_time": current_time,
            "visit_date": nowdate(),
            "visit_time": nowtime(),
            "session_time": 0,
            "session_visit_count": 1,
            "slug": slug
        })
    else:
        existing_record.session_visit_count += 1
        existing_record.visit_time = nowtime()
        existing_record.visit_date_time = current_time

    doc.save(ignore_permissions=True)
    frappe.db.commit()
    return {"status": "success", "message": "Visitor record updated."}

@frappe.whitelist(allow_guest=True)
def update_session_time():
    slug = frappe.form_dict.get("slug")
    user = frappe.form_dict.get("user")
    visitor_id = frappe.form_dict.get("visitor_id")

    frappe.log_error(f"Session Update - user: {user}, visitor_id: {visitor_id}, slug: {slug}", "Session Info")

    if not slug or (not user and not visitor_id):
        frappe.throw(_("Missing slug or identifier (user/visitor_id)"), frappe.ValidationError)

    try:
        doc = None
        if user:
            doc = frappe.get_doc("Visitors", {"user": user})
        elif visitor_id:
            doc = frappe.get_doc("Visitors", {"visitor_id": visitor_id})

        current_time = now()

        if doc.visit_records:
            matching_records = [
                record for record in doc.visit_records
                if record.slug == slug and get_datetime(record.visit_date_time) >= get_datetime(doc.current_session_start)
            ]
            if matching_records:
                latest_record = max(matching_records, key=lambda x: get_datetime(x.visit_date_time))
                session_duration = time_diff_in_seconds(current_time, latest_record.visit_date_time)
                latest_record.session_time += session_duration
                doc.total_session_time += session_duration
                doc.last_seen = current_time
                latest_record.visit_time = nowtime()
                latest_record.visit_date_time = current_time

        doc.reload()
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "Session time updated successfully."}

    except Exception as e:
        frappe.log_error(title="Session Time Update Error", message=str(e))
        return {"status": "error", "message": f"An error occurred: {str(e)}"}