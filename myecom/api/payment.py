# mycom/api/payment.py

import frappe

@frappe.whitelist()
def create_payment(sales_order_id, payment_method, transaction_id, status="Completed"):
    try:
        # Check if a payment with this transaction_id already exists
        if frappe.db.exists("Ecom Payments", {"transaction_id": transaction_id}):
            frappe.log_error(f"Duplicate payment attempt for transaction_id: {transaction_id}", "Create Payment Error")
            # Return a success response to not show an error to the user
            return {"status": "success", "message": "Payment already processed."}

        if not frappe.db.exists("Sales Order", sales_order_id):
            frappe.throw(f"Sales Order {sales_order_id} not found.")

        sales_order = frappe.get_doc("Sales Order", sales_order_id)

        # Create the Ecom Payments document
        payment = frappe.new_doc("Ecom Payments")
        payment.sales_order = sales_order_id
        payment.user = sales_order.user
        payment.amount = sales_order.total_amount
        payment.payment_method = payment_method
        payment.transaction_id = transaction_id
        payment.status = status
        payment.insert(ignore_permissions=True)
        frappe.db.commit()

        # Update the Sales Order
        sales_order.payment_id = payment.name
        sales_order.payment_status = status
        sales_order.save(ignore_permissions=True)
        frappe.db.commit()

        return {"status": "success", "message": "Payment created successfully", "payment_id": payment.name}

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), "Create Payment Error")
        frappe.db.rollback()
        return {"status": "error", "message": str(e)}
