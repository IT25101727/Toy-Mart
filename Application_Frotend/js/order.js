/**
 * order.js - Order Management Logic
 */

const OrderModule = {
    orders: [],
    customers: [],
    products: [],

    init: function() {
        this.fetchOrders();
        this.fetchCustomersForDropdown();
        this.fetchProductsForDropdown();
    },

    fetchOrders: function() {
        fetch(`${API_BASE}/order`)
            .then(response => {
                if(!response.ok && response.status !== 400) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    this.orders = res.data || [];
                    this.renderTable();
                } else {
                    App.showToast(res.massage || 'Failed to load orders.', 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
                App.showToast('Failed to load orders.', 'error');
            });
    },

    fetchCustomersForDropdown: function() {
        fetch(`${API_BASE}/customer`)
            .then(response => response.json().catch(() => {}))
            .then(res => {
                if (res && (res.status === 200 || res.status === 201)) {
                    this.customers = res.data || [];
                    this.populateCustomerDropdown();
                }
            })
            .catch(error => {
                console.error('Error fetching customers for dropdown:', error);
            });
    },

    fetchProductsForDropdown: function() {
        fetch(`${API_BASE}/product`)
            .then(response => response.json().catch(() => {}))
            .then(res => {
                if (res && (res.status === 200 || res.status === 201)) {
                    this.products = res.data || [];
                    this.populateProductDropdown();
                }
            })
            .catch(error => {
                console.error('Error fetching products for dropdown:', error);
            });
    },

    populateCustomerDropdown: function() {
        const select = document.getElementById('orderCustomer');
        if (!select) return;

        let html = '<option value="" disabled selected>Select a customer</option>';
        this.customers.forEach(cust => {
            html += `<option value="${cust.customerId}">${cust.name} (${cust.customerId})</option>`;
        });
        select.innerHTML = html;
    },

    populateProductDropdown: function() {
        const select = document.getElementById('orderProducts');
        if (!select) return;

        let html = '';
        this.products.forEach(prod => {
            html += `<option value="${prod.id}">${prod.name} (${prod.id}) - $${prod.price != null ? Number(prod.price).toFixed(2) : '0.00'}</option>`;
        });
        select.innerHTML = html;
    },

    renderTable: function(data = this.orders) {
        const tbody = document.getElementById('order-table-body');
        if (!tbody) return;

        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">No orders found.</td></tr>';
            return;
        }

        let html = '';
        data.forEach(order => {
            const customerName = order.customer ? order.customer.name : '<span class="text-gray-400 italic">Unknown</span>';
            const productCount = order.products ? order.products.length : 0;

            html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${order.orderID}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${customerName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        <span class="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 py-1 px-2.5 rounded-full text-xs font-semibold">${productCount} Items</span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick="OrderModule.edit('${order.orderID}')" class="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-3 p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="OrderModule.delete('${order.orderID}')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    handleSearch: function(query) {
        const filtered = this.orders.filter(o =>
            o.orderID.toLowerCase().includes(query.toLowerCase()) ||
            (o.customer && o.customer.name.toLowerCase().includes(query.toLowerCase()))
        );
        this.renderTable(filtered);
    },

    setupModal: function(mode, data) {
        document.getElementById('orderFormMode').value = mode;
        document.getElementById('orderModalTitle').innerText = mode === 'create' ? 'Place New Order' : 'Edit Order';

        const idInput = document.getElementById('orderID');
        idInput.classList.add('bg-gray-100', 'dark:bg-gray-800', 'cursor-not-allowed');

        const productSelect = document.getElementById('orderProducts');
        // Deselect all
        for (let i = 0; i < productSelect.options.length; i++) {
            productSelect.options[i].selected = false;
        }

        if (mode === 'edit' && data) {
            idInput.value = data.orderID;

            if (data.customer && data.customer.customerId) {
                document.getElementById('orderCustomer').value = data.customer.customerId;
            } else {
                document.getElementById('orderCustomer').value = "";
            }

            if (data.products && data.products.length > 0) {
                const selectedIds = data.products.map(p => p.id);
                for (let i = 0; i < productSelect.options.length; i++) {
                    if (selectedIds.includes(productSelect.options[i].value)) {
                        productSelect.options[i].selected = true;
                    }
                }
            }
        } else if (mode === 'create') {
            const nextNum = this.orders.length > 0
                ? Math.max(...this.orders.map(o => {
                    const match = o.orderID.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                })) + 1
                : 1;
            idInput.value = 'O' + nextNum.toString().padStart(3, '0');
            document.getElementById('orderCustomer').value = "";
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();

        const mode = document.getElementById('orderFormMode').value;
        const customerId = document.getElementById('orderCustomer').value;

        const productSelect = document.getElementById('orderProducts');
        const selectedProducts = [];
        for (let i = 0; i < productSelect.options.length; i++) {
            if (productSelect.options[i].selected) {
                selectedProducts.push({
                    id: productSelect.options[i].value,
                    qty: 0,
                    price: 0.0
                });
            }
        }

        if (selectedProducts.length === 0) {
            App.showToast('Please select at least one product.', 'error');
            return;
        }

        const orderData = {
            orderID: document.getElementById('orderID').value,
            customer: {
                customerId: customerId
            },
            products: selectedProducts
        };

        const method = mode === 'create' ? 'POST' : 'PUT';

        fetch(`${API_BASE}/order`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json().catch(() => ({ massage: 'Server error' })))
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                App.showToast(`Order ${mode === 'create' ? 'created' : 'updated'} successfully!`);
                App.closeModal('orderModal');
                this.fetchOrders();
            } else {
                App.showToast(res.massage || 'Operation failed.', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            App.showToast('An error occurred while saving.', 'error');
        });
    },

    edit: function(id) {
        const order = this.orders.find(o => o.orderID === id);
        if (order) App.openModal('orderModal', 'edit', order);
    },

    delete: function(id) {
        if (!confirm(`Are you sure you want to delete order ${id}?`)) return;

        fetch(`${API_BASE}/order/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json().catch(() => ({ massage: 'Server error' })))
        .then(res => {
            if (res.status === 200) {
                App.showToast('Order deleted successfully!');
                this.fetchOrders();
            } else {
                App.showToast(res.massage || 'Failed to delete.', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            App.showToast('An error occurred while deleting.', 'error');
        });
    }
};
