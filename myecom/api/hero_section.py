import frappe
from frappe.utils import fmt_money
from .camel_case import dict_keys_to_camel

@frappe.whitelist(allow_guest=True)
def get_hero_details():
    base_url = frappe.utils.get_url()

    messages = frappe.get_all(
        "Hero Section",
        filters={"enable": 1},
        fields=[
            "hero_title",
            "hero_subtitle",
            "price_text",
            "price",
            "hero_image",
            "image_alt",
            "hero_url",
            "button_text",
        ],
        order_by="modified desc",
        limit=10
    )

    for msg in messages:
        if msg.get("price"):
            msg["price"] = fmt_money(msg["price"])
        else:
            msg["price"] = None

        if msg.get("hero_image"):
            msg["hero_image"] = f"{base_url}{msg['hero_image']}"

    messages_camel = [dict_keys_to_camel(msg) for msg in messages]

    return messages_camel
