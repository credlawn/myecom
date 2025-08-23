import frappe

@frappe.whitelist(allow_guest=True)
def get_menu_list():
    # Fetch all parent menus
    parents = frappe.get_all(
        "My Menu",
        filters={"menu_type": "Parent"},
        fields=["menu_name", "parent_id", "slug", "menu_type"],
        order_by="parent_id asc"
    )

    menu_list = []
    for parent in parents:
        # Fetch child menus for this parent
        children = frappe.get_all(
            "My Menu",
            filters={"menu_type": "Child", "parent_name": parent["menu_name"]},
            fields=["menu_name", "child_id", "slug", "menu_type"],
            order_by="child_id asc"
        )
        # Add parent_id to each child
        for child in children:
            child["parent_id"] = parent["parent_id"]

        menu_list.append({
            "parent": parent,
            "children": children
        })

    return {"menu": menu_list}
