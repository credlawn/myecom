
import frappe

@frappe.whitelist()
def get_ecom_customers(user_email):
    if user_email == "Guest":
        frappe.log_error("[DEBUG] User is Guest, cannot fetch Ecom Customer", "Checkout API Debug")
        return []
    
    
    customers = frappe.get_all(
        "Ecom Customer",
        filters={
            "user": user_email,
            "inactive": ["!=", 1]
        },
        fields=["name", "full_name", "mobile_no", "address", "city", "state", "pin_code"]
    )
    return customers

@frappe.whitelist()
def create_ecom_customer(user_email, full_name, mobile_no, address, city, state, pin_code):
    customer_doc = frappe.new_doc("Ecom Customer")
    customer_doc.user = user_email
    customer_doc.full_name = full_name
    customer_doc.mobile_no = mobile_no
    customer_doc.address = address
    customer_doc.city = city
    customer_doc.state = state
    customer_doc.pin_code = pin_code
    customer_doc.insert(ignore_permissions=True)
    frappe.db.commit()
    return customer_doc.as_dict()

@frappe.whitelist()
def update_ecom_customer(ecom_customer_name, full_name=None, mobile_no=None, address=None, city=None, state=None, pin_code=None):
    customer_doc = frappe.get_doc("Ecom Customer", ecom_customer_name)
    
    # Basic permission check
    if customer_doc.user != frappe.session.user and not frappe.has_permission("Ecom Customer", "write", customer_doc):
        frappe.throw("You are not authorized to update this customer.")

    if full_name is not None:
        customer_doc.full_name = full_name
    if mobile_no is not None:
        customer_doc.mobile_no = mobile_no
    if address is not None:
        customer_doc.address = address
    if city is not None:
        customer_doc.city = city
    if state is not None:
        customer_doc.state = state
    if pin_code is not None:
        customer_doc.pin_code = pin_code
        
    if customer_doc.is_dirty():
        customer_doc.save(ignore_permissions=True)
        frappe.db.commit()
        
    return customer_doc.as_dict()


@frappe.whitelist()
def create_sales_order(cart_data, ecom_customer_name, user_email):
    try:
        if not frappe.db.exists("Ecom Customer", ecom_customer_name):
            frappe.throw(f"Ecom Customer {ecom_customer_name} not found.")
        
        new_order = frappe.new_doc("Sales Order")
        new_order.customer = ecom_customer_name
        new_order.user = user_email # As per user's instruction
        new_order.status = "Pending"

        for item in cart_data:
            new_order.append("items", {
                "item": item.get("product"),
                "item_name": item.get("productName"),
                "quantity": item.get("qty"),
                "rate": item.get("price"),
            })

        new_order.insert(ignore_permissions=True)
        frappe.db.commit()

        return {"status": "success", "message": "Sales Order created successfully", "sales_order_id": new_order.name}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Create Sales Order Error")
        frappe.db.rollback()
        return {"status": "error", "message": str(e)}