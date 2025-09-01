from myecom.myecom.doctype.site_settings.site_settings import SiteSettings
import frappe

@frappe.whitelist(allow_guest=True)
def get_site_settings():
    site_settings = frappe.get_single("Site Settings")
    return {
        "show_top_banner": site_settings.show_top_banner or 0,
        "show_mobile_logo": site_settings.show_mobile_logo or 0,
        "banner_url": site_settings.banner_url or "",
        "logo_url": site_settings.logo_url or "/files/logo.svg",
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
        "banner_animation": site_settings.banner_animation or "zoom",
        "bg_color": site_settings.bg_color or "ffffff",
        "bg_shadow_color": site_settings.bg_shadow_color or "ffffff",
        "mob_font_color": site_settings.mob_font_color or "ffffff",
        "lap_font_color": site_settings.lap_font_color or "ffffff",
        "mob_ft_weight": site_settings.mob_ft_weight or 500,
        "lap_ft_weight": site_settings.lap_ft_weight or 500,
        "mob_ft_size": site_settings.mob_ft_size or 14,
        "lap_ft_size": site_settings.lap_ft_size or 14,
        "mob_height": site_settings.mob_height or "h-8",
        "lap_height": site_settings.lap_height or "h-19",



    }
