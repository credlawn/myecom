import frappe
from frappe.model.document import Document

class Visitors(Document):
    def before_save(self):
        self.formatted_session_duration = self.format_duration(self.total_session_time)
    
    def format_duration(self, seconds):
        """Convert seconds to human-readable format"""
        seconds = int(seconds or 0)
        hours = seconds // 3600
        minutes = (seconds % 3600) // 60
        seconds = seconds % 60
        
        if hours > 0:
            return f"{hours} hour{'s' if hours > 1 else ''} {minutes} minute{'s' if minutes != 1 else ''}"
        elif minutes > 0:
            return f"{minutes} minute{'s' if minutes != 1 else ''}"
        else:
            return f"{seconds} second{'s' if seconds != 1 else ''}"