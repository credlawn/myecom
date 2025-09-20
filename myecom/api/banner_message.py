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

@frappe.whitelist(allow_guest=True)
def get_banner_settings():
    banner_settings = frappe.get_single("Site Settings")

    return {
        "show_top_banner": banner_settings.show_top_banner or 0,
        "banner_url": banner_settings.banner_url or "",
        "banner_animation": banner_settings.banner_animation or "zoom", 
        "bg_color": banner_settings.bg_color or "ffffff",
        "bg_shadow_color": banner_settings.bg_shadow_color or "ffffff",
        "mob_font_color": banner_settings.mob_font_color or "ffffff",
        "lap_font_color": banner_settings.lap_font_color or "ffffff",
        "mob_ft_weight": banner_settings.mob_ft_weight or 500,
        "lap_ft_weight": banner_settings.lap_ft_weight or 500,
        "mob_ft_size": banner_settings.mob_ft_size or 14,
        "lap_ft_size": banner_settings.lap_ft_size or 14,
        "mob_height": banner_settings.mob_height or "h-8",
        "lap_height": banner_settings.lap_height or "h-19",
    }
