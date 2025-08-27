import frappe

@frappe.whitelist(allow_guest=True)
def get_site_settings():
    site_settings = frappe.get_single("Site Settings")
    return {
        "show_top_banner": site_settings.show_top_banner or 0,
        "show_mobile_logo": site_settings.show_mobile_logo or 0,
        "banner_url": site_settings.banner_url or "",
        "logo_url": site_settings.logo_url or "",
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
        "currency": site_settings.currency or "₹"

    }
