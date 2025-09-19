import frappe
from functools import wraps

def block_frappe_cookies(func):
    """
    A decorator to prevent Frappe from sending its default `Set-Cookie` headers.
    This is used for API endpoints called directly from the browser to avoid
    conflicting with our secure, httpOnly session cookie management.
    """
    @wraps(func)
    def wrapper(*args, **kwargs):
        
        response = func(*args, **kwargs)
        
        
        if hasattr(frappe.local, 'response') and 'Set-Cookie' in frappe.local.response.headers:
            del frappe.local.response.headers['Set-Cookie']
            
        return response
    return wrapper
