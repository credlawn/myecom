import frappe

@frappe.whitelist(allow_guest=True)
def get_site_settings():
    site_settings = frappe.get_single("Site Settings")

    base_url = frappe.utils.get_url()  # domain + scheme (http/https)

    return {
        "show_mobile_logo": site_settings.show_mobile_logo or 0,
        "visitor_tracking": site_settings.enable_visitor_tracking or 0,
        
        # full url bana do
        "logo_url": (
            f"{base_url}{site_settings.logo_url}"
            if site_settings.logo_url else f"{base_url}/files/logo.svg"
        ),
        "auto_slide_hero": site_settings.auto_slide_hero or 0,
        "card_size": site_settings.card_size or 72,
        "image_size": site_settings.image_size or 56,
        "mobile_card_size": site_settings.mobile_card_size or 72,
        "mobile_image_size": site_settings.mobile_image_size or 56,
        "tab_card_size": site_settings.tab_card_size or 72,
        "tab_image_size": site_settings.tab_image_size or 56,
        "card_bg": site_settings.card_bg or "white",
        "image_bg": site_settings.image_bg or "transparent",
        "text_color": site_settings.text_color or "black",
        "currency": site_settings.currency or "₹ ",
        "primary_color": site_settings.primary_color or "red-500",
        "secondary_color": site_settings.secondary_color or "red-500",
        "third_color": site_settings.third_color or "red-500",
        "button_1_color": site_settings.button_1_color or "red-500",
        "button_2_color": site_settings.button_2_color or "red-500",
        "button_3_color": site_settings.button_3_color or "red-500",
        "bt_1_color": site_settings.bt_1_color or "red-500",
        "bt_2_color": site_settings.bt_2_color or "red-500",
        "bt_3_color": site_settings.bt_3_color or "red-500",
        "star_color_1": site_settings.star_color_1 or "ffffff",
        "star_color_2": site_settings.star_color_2 or "ffffff",
    }
