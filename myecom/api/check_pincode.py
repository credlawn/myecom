import frappe
from frappe.utils import add_days, nowdate, getdate, formatdate

@frappe.whitelist(allow_guest=True)
def get_delivery_time(pincode: str):
    try:
        if not pincode:
            return {"error": "Pincode is required"}

        pin = frappe.get_doc("Pin Code", pincode)

        if not pin.serviceable:
            return {"error": "Delivery not available at this location"}

        delivery_days = pin.delivery_days or 0
        delivery_date = formatdate(
            add_days(getdate(nowdate()), delivery_days),
            "d MMM, EEEE"   # Example: 6 Sep, Saturday
        )

        return {
            "pincode": pin.pincode,
            "city": pin.city,
            "state": pin.state,
            "country": pin.country,
            "delivery_days": delivery_days,
            "delivery_date": delivery_date,   # 👈 new field
            "cod_available": 1 if pin.cod_available else 0,
            "serviceable": 1 if pin.serviceable else 0,
            "extra_info": pin.extra_info,
            "last_updated_on": pin.last_updated_on,
        }
    except frappe.DoesNotExistError:
        return {"error": "Currently out of stock in this area"}
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Check Pincode Error")
        return {"error": str(e)}
