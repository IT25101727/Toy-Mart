/**
 * payment.js - Payment Management Module
 */

const PaymentModule = {
    allPayments: [],

    fetchPayments: function () {
        fetch(`${API_BASE}/payment`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    this.allPayments = data.data;
                    this.renderTable(this.allPayments);
                }
            })
            .catch(error => {
                console.error('Error fetching payments:', error);
                App.showToast('Failed to fetch payments', 'error');
            });
    },

    fetchOrders: function () {
        fetch(`${API_BASE}/order`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    const select = document.getElementById('paymentOrderID');
                    if (select) {
                        select.innerHTML = '<option value="">Select Order</option>';
                        data.data.forEach(order => {
                            const option = document.createElement('option');
                            option.value = order.orderID;
                            option.textContent = `${order.orderID} - ${order.customer ? order.customer.name : 'Unknown'}`;
                            select.appendChild(option);
                        });
                    }
                }
            });
    },

    renderTable: function (payments) {
        const tableBody = document.getElementById('payment-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        payments.forEach(payment => {
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors';
            
            // Calculate total amount from order products if available
            let totalAmount = 0;
            if (payment.order && payment.order.products) {
                totalAmount = payment.order.products.reduce((sum, p) => sum + (p.price || 0), 0);
            }

            row.innerHTML = `
                <td class="px-6 py-4 text-sm font-medium text-gray-800 dark:text-white">${payment.paymentID}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">${payment.order ? payment.order.orderID : 'N/A'}</td>
                <td class="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">${new Date(payment.date).toLocaleDateString()}</td>
                <td class="px-6 py-4 text-sm font-bold text-brand-600 dark:text-brand-400">$${totalAmount.toFixed(2)}</td>
                <td class="px-6 py-4 text-right space-x-3">
                    <button onclick="PaymentModule.editPayment('${payment.paymentID}')" class="text-blue-500 hover:text-blue-700 transition-colors">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="PaymentModule.deletePayment('${payment.paymentID}')" class="text-red-500 hover:text-red-700 transition-colors">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    },

    generatePaymentID: function () {
        const idInput = document.getElementById('paymentID');
        if (!idInput) return;

        if (this.allPayments.length === 0) {
            idInput.value = 'PAY001';
        } else {
            const maxNum = Math.max(...this.allPayments.map(p => {
                const match = p.paymentID.match(/\d+/);
                return match ? parseInt(match[0]) : 0;
            }));
            idInput.value = `PAY${(maxNum + 1).toString().padStart(3, '0')}`;
        }
    },

    setupModal: function (mode, dataID = null) {
        const modalTitle = document.getElementById('modalTitle');
        const submitBtn = document.querySelector('#paymentForm button[type="submit"]');
        const idInput = document.getElementById('paymentID');

        this.fetchOrders();

        if (mode === 'create') {
            modalTitle.innerText = 'Record Payment';
            submitBtn.innerText = 'Save Payment';
            this.generatePaymentID();
            document.getElementById('paymentDate').valueAsDate = new Date();
        } else {
            modalTitle.innerText = 'Edit Payment';
            submitBtn.innerText = 'Update Payment';
            const payment = this.allPayments.find(p => p.paymentID === dataID);
            if (payment) {
                idInput.value = payment.paymentID;
                document.getElementById('paymentOrderID').value = payment.order ? payment.order.orderID : '';
                document.getElementById('paymentDate').value = new Date(payment.date).toISOString().split('T')[0];
            }
        }
    },

    handleSubmit: function (event) {
        event.preventDefault();

        const paymentData = {
            paymentID: document.getElementById('paymentID').value,
            date: new Date(document.getElementById('paymentDate').value).toISOString(),
            order: {
                orderID: document.getElementById('paymentOrderID').value
            }
        };

        const isUpdate = document.getElementById('modalTitle').innerText === 'Edit Payment';
        const method = isUpdate ? 'PUT' : 'POST';

        fetch(`${API_BASE}/payment`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(paymentData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                App.showToast(isUpdate ? 'Payment updated' : 'Payment recorded');
                App.closeModal('paymentModal');
                this.fetchPayments();
            } else {
                App.showToast(data.massage || 'Operation failed', 'error');
            }
        })
        .catch(error => {
            console.error('Error saving payment:', error);
            App.showToast('Server error', 'error');
        });
    },

    editPayment: function (id) {
        App.openModal('paymentModal', 'edit', id);
    },

    deletePayment: function (id) {
        if (confirm('Are you sure you want to delete this payment record?')) {
            fetch(`${API_BASE}/payment/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 200) {
                    App.showToast('Payment deleted');
                    this.fetchPayments();
                }
            })
            .catch(error => {
                console.error('Error deleting payment:', error);
                App.showToast('Delete failed', 'error');
            });
        }
    },

    handleSearch: function (query) {
        const filtered = this.allPayments.filter(p => 
            p.paymentID.toLowerCase().includes(query.toLowerCase()) ||
            (p.order && p.order.orderID.toLowerCase().includes(query.toLowerCase()))
        );
        this.renderTable(filtered);
    },

    init: function () {
        this.fetchPayments();
    }
};
