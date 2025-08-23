import frappe
from frappe.model.document import Document

class MyMenu(Document):

    def autoname(self):
        if not self.menu_name:
            frappe.throw("Menu Name is required")
        self.name = self.menu_name

    def validate(self):
        if self.menu_type == "Parent":
            self.parent_id = self._assign_sequence(
                table="tabMy Menu",
                seq_field="parent_id",
                filters={"menu_type": "Parent"},
                seq=self.sequence
            )
        elif self.menu_type == "Child":
            if not self.parent_name:
                frappe.throw("Parent name required for child menu")
            self.child_id = self._assign_sequence(
                table="tabMy Menu",
                seq_field="child_id",
                filters={"menu_type": "Child", "parent_name": self.parent_name},
                seq=self.sequence
            )
            self.parent_id = frappe.db.get_value("My Menu", self.parent_name, "parent_id")

    def before_delete(self):
        if self.menu_type == "Parent":
            frappe.db.sql("""
                UPDATE `tabMy Menu`
                SET parent_id = parent_id - 1
                WHERE menu_type='Parent' AND parent_id > %s
            """, (self.parent_id,))
        elif self.menu_type == "Child":
            frappe.db.sql("""
                UPDATE `tabMy Menu`
                SET child_id = child_id - 1
                WHERE menu_type='Child' AND parent_name=%s AND child_id > %s
            """, (self.parent_name, self.child_id))

    def _assign_sequence(self, table, seq_field, filters, seq):
        where_clause = " AND ".join([f"{k}=%s" for k in filters.keys()])
        values = list(filters.values())
        if self.name:
            where_clause += " AND name != %s"
            values.append(self.name)
        max_seq = frappe.db.sql(
            f"SELECT MAX({seq_field}) FROM `{table}` WHERE {where_clause}",
            values
        )[0][0] or 0
        if not seq or seq <= 0:
            seq = max_seq + 1
        seq = max(1, min(seq, max_seq + 1))
        if seq != max_seq + 1:
            filter_conditions = " AND ".join([f"{k}=%s" for k in filters.keys()])
            values_shift = list(values[:-1]) if self.name else values
            frappe.db.sql(
                f"UPDATE `{table}` SET {seq_field} = {seq_field} + 1 "
                f"WHERE {seq_field} >= %s AND {filter_conditions}",
                [seq] + values_shift
            )
        return seq
