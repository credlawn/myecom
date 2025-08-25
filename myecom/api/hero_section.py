import frappe
from frappe.utils import fmt_money

@frappe.whitelist(allow_guest=True)
def get_hero_details():
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
            "hero_url"
        ],
        order_by="modified desc",
        limit=10
    )

    for msg in messages:
        if msg.get("price"):
            # frappe ke default currency ke hisaab se format karega
            msg["price"] = fmt_money(msg["price"])
        else:
            msg["price"] = None

    return {"messages": messages}
