import frappe
from .camel_case import dict_keys_to_camel

@frappe.whitelist(allow_guest=True)
def get_menu_list():
    parents = frappe.get_all(
        "My Menu",
        filters={"menu_type": "Parent"},
        fields=["menu_name", "parent_id", "slug", "menu_type"],
        order_by="parent_id asc"
    )

    menu_list = []
    for parent in parents:
        children = frappe.get_all(
            "My Menu",
            filters={"menu_type": "Child", "parent_name": parent["menu_name"]},
            fields=["menu_name", "child_id", "slug", "menu_type"],
            order_by="child_id asc"
        )

        
        children_camel = []
        for child in children:
            child["parent_id"] = parent["parent_id"]
            children_camel.append(dict_keys_to_camel(child))

        menu_list.append({
            "parent": dict_keys_to_camel(parent),
            "children": children_camel
        })

    return menu_list
