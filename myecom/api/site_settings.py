import frappe

@frappe.whitelist(allow_guest=True)
def get_site_settings():
    site_settings = frappe.get_single("Site Settings")
    return {
        "show_top_banner": site_settings.show_top_banner or 0,
        "show_mobile_logo": site_settings.show_mobile_logo or 0,
    }
