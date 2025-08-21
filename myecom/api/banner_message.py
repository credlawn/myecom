import frappe

@frappe.whitelist(allow_guest=True)
def get_banner_message():
    messages = frappe.get_all(
        "Banner Message",
        filters={"enable": 1},
        fields=["banner_message"],
        order_by="modified desc",
        limit=10
    )
    return {"messages": messages}
