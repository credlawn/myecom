import frappe

@frappe.whitelist(allow_guest=True)
def add_to_wishlist(product_id=None, user=None, visitor_id=None, **kwargs):
	# Handle both positional args and JSON body
	if not product_id:
		product_id = frappe.request.json.get('product_id') if frappe.request.is_json else frappe.form_dict.get('product_id')
	
	# Get visitor_id from headers if not provided
	if not visitor_id:
		visitor_id = frappe.get_request_header('X-Visitor-Id')
	
	if not product_id:
		return {"success": False, "message": "Product ID required"}
	
	wishlist = get_or_create_wishlist(user, visitor_id)
	if not wishlist:
		return {"success": False, "message": "Failed to create wishlist"}
	
	existing = [item.product for item in wishlist.items]
	if product_id in existing:
		return {"success": False, "message": "Already in wishlist"}
	
	product = frappe.get_doc("Product", product_id)
	wishlist.append("items", {
		"product": product.name,
		"product_name": product.product_name,
		"product_image": product.product_image_1 or None,
		"price": product.price,
		"slug": product.product_slug
	})
	wishlist.save()
	
	return {"success": True, "message": "Added to wishlist", "count": len(wishlist.items)}

@frappe.whitelist(allow_guest=True)
def remove_from_wishlist(product_id=None, user=None, visitor_id=None, **kwargs):
	# Handle both positional args and JSON body
	if not product_id:
		product_id = frappe.request.json.get('product_id') if frappe.request.is_json else frappe.form_dict.get('product_id')
	
	# Get visitor_id from headers if not provided
	if not visitor_id:
		visitor_id = frappe.get_request_header('X-Visitor-Id')
	
	if not product_id:
		return {"success": False, "message": "Product ID required"}
	
	wishlist = get_wishlist(user, visitor_id)
	if not wishlist:
		return {"success": False, "message": "Wishlist not found"}
	
	for item in wishlist.items:
		if item.product == product_id:
			wishlist.remove(item)
			wishlist.save()
			return {"success": True, "message": "Removed from wishlist", "count": len(wishlist.items)}
	
	return {"success": False, "message": "Product not found"}

@frappe.whitelist(allow_guest=True)
def get_wishlist_items(user=None, visitor_id=None):
	# Get visitor_id from headers if not provided
	if not visitor_id:
		visitor_id = frappe.get_request_header('X-Visitor-Id')
	
	wishlist = get_wishlist(user, visitor_id)
	if not wishlist:
		return {"success": True, "items": [], "total": 0}
	
	items = []
	for item in wishlist.items:
		items.append({
			"product": item.product,
			"product_name": item.product_name,
			"product_image": item.product_image,
			"price": item.price,
			"added_on": item.added_on,
			"slug": item.slug
		})
	
	return {"success": True, "items": items, "total": len(items)}

@frappe.whitelist(allow_guest=True)
def is_in_wishlist(product_id=None, user=None, visitor_id=None, **kwargs):
	# Handle both positional args and JSON body
	if not product_id:
		product_id = frappe.request.json.get('product_id') if frappe.request.is_json else frappe.form_dict.get('product_id')
	
	# Get visitor_id from headers if not provided
	if not visitor_id:
		visitor_id = frappe.get_request_header('X-Visitor-Id')
	
	if not product_id:
		return {"success": False, "message": "Product ID required"}
	
	wishlist = get_wishlist(user, visitor_id)
	if not wishlist:
		return {"success": True, "in_wishlist": False}
	
	product_ids = [item.product for item in wishlist.items]
	return {"success": True, "in_wishlist": product_id in product_ids}

@frappe.whitelist(allow_guest=True)
def clear_wishlist(user=None, visitor_id=None):
	# Get visitor_id from headers if not provided
	if not visitor_id:
		visitor_id = frappe.get_request_header('X-Visitor-Id')
	
	wishlist = get_wishlist(user, visitor_id)
	if not wishlist:
		return {"success": True, "message": "Wishlist already empty", "count": 0}
	
	wishlist.items = []
	wishlist.save()
	
	return {"success": True, "message": "Wishlist cleared", "count": 0}

def get_or_create_wishlist(user=None, visitor_id=None):
	# Check for authenticated user from Authorization header
	if not user:
		authorization = frappe.get_request_header('Authorization')
		if authorization and authorization.startswith('Bearer '):
			token = authorization.split(' ')[1]
			try:
				# Decode JWT token to get user
				from frappe.utils.jwt import decode
				payload = decode(token)
				user = payload.get('user')
				if user:
					frappe.set_user(user)
			except:
				pass
	
	filters = {}
	if user:
		filters["user"] = user
	elif visitor_id:
		filters["visitor_id"] = visitor_id
	
	existing = frappe.db.exists("Wishlist", filters)
	if existing:
		return frappe.get_doc("Wishlist", existing)
	
	wishlist = frappe.new_doc("Wishlist")
	if user:
		wishlist.user = user
	if visitor_id:
		wishlist.visitor_id = visitor_id
	wishlist.insert()
	return wishlist

def get_wishlist(user=None, visitor_id=None):
	# Check for authenticated user from Authorization header
	if not user:
		authorization = frappe.get_request_header('Authorization')
		if authorization and authorization.startswith('Bearer '):
			token = authorization.split(' ')[1]
			try:
				# Decode JWT token to get user
				from frappe.utils.jwt import decode
				payload = decode(token)
				user = payload.get('user')
				if user:
					frappe.set_user(user)
			except:
				pass
	
	filters = {}
	if user:
		filters["user"] = user
	elif visitor_id:
		filters["visitor_id"] = visitor_id
	
	existing = frappe.db.exists("Wishlist", filters)
	return frappe.get_doc("Wishlist", existing) if existing else None