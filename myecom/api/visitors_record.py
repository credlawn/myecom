import frappe
from frappe import _
from frappe.utils import now, nowdate, nowtime, time_diff_in_seconds

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

    current_time = now()
    ip_address = frappe.local.request_ip or getattr(frappe.request, 'remote_addr', None)

    if not doc:
        new_doc = frappe.new_doc('Visitors')
        new_doc.visitor_id = visitor_id
        new_doc.visit_date_time = current_time
        new_doc.last_seen = current_time
        new_doc.visit_count = 1
        new_doc.total_session_time = 0
        new_doc.visit_ip_address = ip_address
        new_doc.current_session_start = current_time
        new_doc.append('visit_records', {
            'visitor_ip': ip_address,
            'visit_date_time': current_time,
            'visit_date': nowdate(),
            'visit_time': nowtime(),
            'session_time': 0,
            'session_visit_count': 1,
            'slug': slug
        })
        new_doc.insert(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "New visitor record created."}
    else:
        time_diff = time_diff_in_seconds(current_time, doc.last_seen)
        
        if time_diff > 1800:
            doc.visit_count += 1
            doc.current_session_start = current_time

        doc.last_seen = current_time
        
        existing_record = None
        for record in doc.visit_records:
            if record.slug == slug and record.visit_date_time >= doc.current_session_start:
                existing_record = record
                break

        if not existing_record:
            doc.append('visit_records', {
                'visitor_ip': ip_address,
                'visit_date_time': current_time,
                'visit_date': nowdate(),
                'visit_time': nowtime(),
                'session_time': 0,
                'session_visit_count': 1,
                'slug': slug
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
    visitor_id = frappe.form_dict.get("visitor_id")
    slug = frappe.form_dict.get("slug")

    if not visitor_id or not slug:
        frappe.throw(_("Missing visitor_id or slug"), frappe.ValidationError)

    try:
        doc = frappe.get_doc('Visitors', {'visitor_id': visitor_id})
        current_time = now()
        
        if doc.visit_records:
            # Find the most recent record for this slug in the current session
            matching_records = [
                record for record in doc.visit_records 
                if record.slug == slug and record.visit_date_time >= doc.current_session_start
            ]
            
            if matching_records:
                latest_record = max(matching_records, key=lambda x: x.visit_date_time)
                session_duration = time_diff_in_seconds(current_time, latest_record.visit_date_time)
                
                # Update session time
                latest_record.session_time += session_duration
                doc.total_session_time += session_duration
                
                # Update last seen
                doc.last_seen = current_time
                latest_record.visit_time = nowtime()
                latest_record.visit_date_time = current_time
            
        doc.save(ignore_permissions=True)
        frappe.db.commit()
        return {"status": "success", "message": "Session time updated successfully."}
    except Exception as e:
        frappe.log_error(title='Session Time Update Error', message=str(e))
        return {"status": "error", "message": f"An error occurred: {str(e)}"}