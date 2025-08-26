import frappe

@frappe.whitelist(allow_guest=True)
def get_category_list():
    messages = frappe.get_all(
        "Category",
        filters={"enable": 1},
        fields=["category", "parent_category", "sequence", "banner"],
        order_by="sequence",
        limit=20
    )
    return {"messages": messages}
