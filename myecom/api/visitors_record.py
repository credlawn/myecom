import frappe
from frappe.utils import now, nowdate, nowtime, time_diff_in_seconds, get_datetime
from frappe import _

@frappe.whitelist(allow_guest=True)
def create_or_update_visitor():
    slug = frappe.form_dict.get("slug")
    user = frappe.form_dict.get("user")
    visitor_id = frappe.form_dict.get("visitor_id")

    if not slug or (not user and not visitor_id):
        frappe.throw(_("Missing slug or identifier (user/visitor_id)"), frappe.ValidationError)

    visitor_doc = None
    user_doc = None

    if visitor_id:
        try:
            visitor_doc = frappe.get_doc("Visitors", {"visitor_id": visitor_id})
        except frappe.DoesNotExistError:
            pass
        except frappe.MultipleDocsFoundError:
            doc_list = frappe.get_all("Visitors", filters={"visitor_id": visitor_id}, limit=1)
            if doc_list:
                visitor_doc = frappe.get_doc("Visitors", doc_list[0].name)

    if user:
        try:
            user_doc = frappe.get_doc("Visitors", {"user": user})
        except frappe.DoesNotExistError:
            pass
        except frappe.MultipleDocsFoundError:
            doc_list = frappe.get_all("Visitors", filters={"user": user}, limit=1)
            if doc_list:
                user_doc = frappe.get_doc("Visitors", doc_list[0].name)

    current_time = now()
    ip_address = frappe.local.request_ip or getattr(frappe.request, "remote_addr", None)

    doc = None
    message = ""

    if user:
        if user_doc:
            doc = user_doc
            message = "Existing user record updated."
            if visitor_doc and visitor_doc.name != user_doc.name:
                for record in visitor_doc.visit_records:
                    existing = None
                    for ur in doc.visit_records:
                        if ur.slug == record.slug and get_datetime(ur.visit_date_time) >= get_datetime(doc.current_session_start):
                            existing = ur
                            break
                    if existing:
                        existing.session_visit_count += record.session_visit_count
                        existing.session_time += record.session_time
                        if get_datetime(record.visit_date_time) > get_datetime(existing.visit_date_time):
                            existing.visit_date_time = record.visit_date_time
                            existing.visit_time = record.visit_time
                    else:
                        doc.append("visit_records", {
                            "visitor_ip": record.visitor_ip,
                            "visit_date_time": record.visit_date_time,
                            "visit_date": record.visit_date,
                            "visit_time": record.visit_time,
                            "session_time": record.session_time,
                            "session_visit_count": record.session_visit_count,
                            "slug": record.slug
                        })
                if visitor_doc.visit_count:
                    doc.visit_count = (doc.visit_count or 0) + visitor_doc.visit_count
                if visitor_doc.total_session_time:
                    doc.total_session_time = (doc.total_session_time or 0) + visitor_doc.total_session_time
                if visitor_doc.last_seen and (not doc.last_seen or get_datetime(visitor_doc.last_seen) > get_datetime(doc.last_seen)):
                    doc.last_seen = visitor_doc.last_seen
                frappe.delete_doc("Visitors", visitor_doc.name, ignore_permissions=True)
                message = "Visitor record merged into user record and updated."
        elif visitor_doc:
            doc = visitor_doc
            doc.user = user
            doc.visitor_id = None
            message = "Visitor record converted to user record and updated."
        else:
            doc = frappe.new_doc("Visitors")
            doc.user = user
            message = "New user record created."
    elif visitor_id:
        if visitor_doc:
            doc = visitor_doc
            message = "Existing visitor record updated."
        else:
            doc = frappe.new_doc("Visitors")
            doc.visitor_id = visitor_id
            message = "New visitor record created."
    else:
        frappe.throw(_("Invalid state: Neither user nor visitor_id provided after initial check."), frappe.ValidationError)

    if not doc.visit_date_time:
        doc.visit_date_time = current_time
        doc.visit_count = 1
        doc.total_session_time = 0
        doc.current_session_start = current_time
    else:
        time_diff = time_diff_in_seconds(current_time, get_datetime(doc.last_seen))
        if time_diff > 1800:
            doc.visit_count += 1
            doc.current_session_start = current_time
    
    doc.last_seen = current_time
    doc.visit_ip_address = ip_address

    existing_record_for_slug = None
    if doc.visit_records:
        for record in doc.visit_records:
            if record.slug == slug and get_datetime(record.visit_date_time) >= get_datetime(doc.current_session_start):
                existing_record_for_slug = record
                break

    if not existing_record_for_slug:
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
        existing_record_for_slug.session_visit_count += 1
        existing_record_for_slug.visit_time = nowtime()
        existing_record_for_slug.visit_date_time = current_time

    doc.save(ignore_permissions=True)
    frappe.db.commit()
    return {"status": "success", "message": message}

@frappe.whitelist(allow_guest=True)
def update_session_time():
    slug = frappe.form_dict.get("slug")
    user = frappe.form_dict.get("user")
    visitor_id = frappe.form_dict.get("visitor_id")
    time_spent = frappe.form_dict.get("time_spent")

    if not slug or (not user and not visitor_id):
        frappe.throw(_("Missing slug or identifier (user/visitor_id)"), frappe.ValidationError)

    try:
        doc = None
        if user:
            doc = frappe.get_doc("Visitors", {"user": user})
        elif visitor_id:
            doc = frappe.get_doc("Visitors", {"visitor_id": visitor_id})
        
        if not doc:
            frappe.throw(_("Visitor record not found for update."), frappe.DoesNotExistError)

        current_time = now()

        if doc.visit_records:
            matching_records = [
                record for record in doc.visit_records
                if record.slug == slug and get_datetime(record.visit_date_time) >= get_datetime(doc.current_session_start)
            ]
            if matching_records:
                latest_record = max(matching_records, key=lambda x: get_datetime(x.visit_date_time))
                
                if time_spent is not None:
                    session_duration = float(time_spent)
                else:
                    session_duration = time_diff_in_seconds(current_time, latest_record.visit_date_time)
                
                latest_record.session_time += session_duration
                doc.total_session_time += session_duration
                doc.last_seen = current_time
                latest_record.visit_time = nowtime()
                latest_record.visit_date_time = current_time

        doc.save(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "Session time updated successfully."}

    except Exception as e:
        frappe.log_error(title="Session Time Update Error", message=str(e))
        return {"status": "error", "message": f"An error occurred: {str(e)}"}
