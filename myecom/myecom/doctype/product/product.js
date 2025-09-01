frappe.ui.form.on('Product', {
    refresh: async function(frm) {
        if (!frm.fields_dict.quick_tag_input) {
            return;
        }
        
        const records = await frappe.db.get_list("Tags", {
            fields: ['tag_name'],
            limit: 50
        });
        
        frm.fields_dict.quick_tag_input.set_data(
            records.length ? 
            records.map(tag => ({ value: tag.tag_name, label: tag.tag_name })) : 
            []
        );
        
        frm.fields_dict.quick_tag_input.$input.on('keydown', function(e) {
            if (e.which === 13) {
                e.preventDefault();
                add_tag_from_input(frm);
            }
        });
        
        frm.fields_dict.quick_tag_input.$input.on('input', function() {
            const value = $(this).val();
            if (value) {
                filter_autocomplete(frm, value);
            }
        });
    }
});

async function filter_autocomplete(frm, search_term) {
    const records = await frappe.db.get_list("Tags", {
        fields: ['tag_name'],
        filters: { tag_name: ['like', `%${search_term}%`] },
        limit: 20
    });
    
    frm.fields_dict.quick_tag_input.set_data(
        records.length ? 
        records.map(tag => ({ value: tag.tag_name, label: tag.tag_name })) : 
        []
    );
}

function add_tag_from_input(frm) {
    var tag_name = frm.fields_dict.quick_tag_input.$input.val();
    
    if (!tag_name || tag_name.trim() === '') {
        return;
    }
    
    tag_name = tag_name.trim();
    
    var existing_tags = (frm.doc.product_tag || []).map(function(row) {
        return row.child_tag_name;
    });
    
    if (existing_tags.includes(tag_name)) {
        frappe.msgprint(__('Tag "{0}" is already added to this product', [tag_name]));
        frm.set_value('quick_tag_input', '');
        return;
    }
    
    frappe.call({
        method: 'frappe.client.get_value',
        args: {
            doctype: 'Tags',
            fieldname: 'name',
            filters: { tag_name: tag_name }
        },
        callback: function(r) {
            if (r.message && r.message.name) {
                add_to_child_table(frm, tag_name);
            } else {
                create_new_tag(frm, tag_name);
            }
        }
    });
}

function create_new_tag(frm, tag_name) {
    frappe.call({
        method: 'frappe.client.insert',
        args: {
            doc: {
                doctype: 'Tags',
                tag_name: tag_name
            }
        },
        callback: function(r) {
            if (r.message) {
                frappe.show_alert({
                    message: __('New tag "{0}" created', [tag_name]),
                    indicator: 'green'
                });
                add_to_child_table(frm, tag_name);
            } else {
                frappe.msgprint(__('Error creating tag "{0}"', [tag_name]));
            }
        }
    });
}

function add_to_child_table(frm, tag_name) {
    var child_table = frm.add_child('product_tag');
    child_table.child_tag_name = tag_name;
    frm.refresh_field('product_tag');
    frm.set_value('quick_tag_input', '');  
    frm.fields_dict.quick_tag_input.$input.val('');
    setTimeout(() => {
        filter_autocomplete(frm, '');
    }, 500);
    frappe.show_alert({
        message: __('Tag "{0}" added to product', [tag_name]),
        indicator: 'green'
    });
}
