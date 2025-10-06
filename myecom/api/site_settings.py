import frappe

@frappe.whitelist(allow_guest=True)
def get_site_settings():
    site_settings = frappe.get_single("Site Settings")
    base_url = frappe.utils.get_url()

    return {
        "showMobileLogo": site_settings.show_mobile_logo or 0,
        "visitorTracking": site_settings.enable_visitor_tracking or 0,
        "currency": site_settings.currency or "₹ ",
        "logoUrl": (f"{base_url}{site_settings.logo_url}" if site_settings.logo_url else f"{base_url}/files/logo.svg"),

        "cardSize": site_settings.card_size or 72,
        "imageSize": site_settings.image_size or 56,

        "mobileCardSize": site_settings.mobile_card_size or 72,
        "mobileImageSize": site_settings.mobile_image_size or 56,

        "tabCardSize": site_settings.tab_card_size or 72,
        "tabImageSize": site_settings.tab_image_size or 56,

        "cardBg": site_settings.card_bg or "white",
        "imageBg": site_settings.image_bg or "transparent",
        "textColor": site_settings.text_color or "black",

        "showTopBanner": site_settings.show_top_banner or 0,
        "bannerUrl": site_settings.banner_url or "",
        "bannerAnimation": site_settings.banner_animation or "zoom",

        "bgColor": site_settings.bg_color or "ffffff",
        "bgShadowColor": site_settings.bg_shadow_color or "ffffff",

        "mobFontColor": site_settings.mob_font_color or "ffffff",
        "lapFontColor": site_settings.lap_font_color or "ffffff",

        "mobFtWeight": site_settings.mob_ft_weight or 500,
        "lapFtWeight": site_settings.lap_ft_weight or 500,

        "mobFtSize": site_settings.mob_ft_size or 14,
        "lapFtSize": site_settings.lap_ft_size or 14,

        "mobHeight": site_settings.mob_height or "h-8",
        "lapHeight": site_settings.lap_height or "h-19",

        "autoSlideHero": site_settings.auto_slide_hero or 0,
        "primaryColor": site_settings.primary_color or "red-500",
        "secondaryColor": site_settings.secondary_color or "red-500",
        "thirdColor": site_settings.third_color or "red-500",

        "button1Color": site_settings.button_1_color or "red-500",
        "button2Color": site_settings.button_2_color or "red-500",
        "button3Color": site_settings.button_3_color or "red-500",

        "button1TextColor": site_settings.bt_1_color or "red-500",
        "button2TextColor": site_settings.bt_2_color or "red-500",
        "button3TextColor": site_settings.bt_3_color or "red-500",

        "starColor1": site_settings.star_color_1 or "ffffff",
        "starColor2": site_settings.star_color_2 or "ffffff",
    }
