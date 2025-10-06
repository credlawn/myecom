import frappe

def safe_delete(doctype, filters):
    table_name = f"tab{doctype}"
    exists = frappe.db.sql(
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_name=%s",
        (table_name,),
    )[0][0]

    if not exists:
        return

    try:
        frappe.db.delete(doctype, filters)
    except Exception as e:
        frappe.log_error(f"Error deleting {doctype} records: {str(e)}", "Product Delete Error")


def delete_related_records(doc, method):
    product_name = doc.name
    safe_delete("Shopping Cart Item", {"product": product_name})
    safe_delete("Wishlist Item", {"product": product_name})



