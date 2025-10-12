import frappe
from myecom.api.camel_case import dict_keys_to_camel

@frappe.whitelist(allow_guest=True)
def get_banner_message():
    messages = frappe.get_all(
        "Banner Message",
        filters={"enable": 1},
        fields=["banner_message"],
        order_by="modified desc",
        limit=10
    )

    messages_camel = [dict_keys_to_camel(msg) for msg in messages]
    return messages_camel
