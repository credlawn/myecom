import frappe

@frappe.whitelist(allow_guest=True)
def get_navbar_list():
    messages = frappe.get_all(
        "Ecom Nav",
        filters={"hide_navbar": 0},
        fields=["banner_message"],
        order_by="modified desc",
        limit=10
    )
    return {"messages": messages}
