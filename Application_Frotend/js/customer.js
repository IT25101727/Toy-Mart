/**
 * customer.js - Customer Management Logic
 */

const CustomerModule = {
  customers: [],

  fetchCustomers: function(statsOnly = false) {
    fetch(`${API_BASE}/customer`)
      .then(response => response.json())
      .then(res => {
        const customers = res.data || [];
        this.customers = customers;

        if (document.getElementById('stat-customer-count')) {
          document.getElementById('stat-customer-count').innerText = customers.length;
        }

        if (!statsOnly) this.renderTable();
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
        if(!statsOnly) App.showToast('Failed to load customers.', 'error');
      });
  },

  renderTable: function(data = this.customers) {
    const tbody = document.getElementById('customer-table-body');
    if (!tbody) return;

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">No customers found.</td></tr>';
      return;
    }

    let html = '';
    data.forEach(cust => {
      const email = cust.email || cust.eMail || '';
      html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${cust.customerId}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${cust.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${email}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick='CustomerModule.edit(${JSON.stringify(cust)})' class="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-3 p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="CustomerModule.delete('${cust.customerId}')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
    });
    tbody.innerHTML = html;
  },

  handleSearch: function(query) {
    const filtered = this.customers.filter(c =>
      c.customerId.toLowerCase().includes(query.toLowerCase()) ||
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      (c.email || c.eMail || '').toLowerCase().includes(query.toLowerCase())
    );
    this.renderTable(filtered);
  },

  setupModal: function(mode, data) {
    document.getElementById('customerFormMode').value = mode;
    document.getElementById('customerModalTitle').innerText = mode === 'create' ? 'Add New Customer' : 'Edit Customer';

    const idInput = document.getElementById('customerID');
    idInput.readOnly = true;
    // Visual indicator that it's disabled/readonly
    idInput.classList.add('bg-gray-100', 'dark:bg-gray-800', 'cursor-not-allowed');

    const passwordInput = document.getElementById('customerPassword');

    if (mode === 'edit' && data) {
      idInput.value = data.customerId;
      document.getElementById('customerName').value = data.name;
      document.getElementById('customerEmail').value = data.email || data.eMail || '';
      passwordInput.value = '';
      passwordInput.placeholder = 'Leave blank to keep current password';
      passwordInput.required = false;
    } else if (mode === 'create') {
      passwordInput.value = '';
      passwordInput.placeholder = 'Enter password';
      passwordInput.required = true;
      const nextNum = this.customers.length > 0
        ? Math.max(...this.customers.map(c => {
        const match = c.customerId.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      })) + 1
        : 1;
      idInput.value = 'C' + nextNum.toString().padStart(3, '0');
    }
  },

  handleSubmit: function(e) {
    e.preventDefault();

    const mode = document.getElementById('customerFormMode').value;
    const customerData = {
      customerId: document.getElementById('customerID').value,
      name: document.getElementById('customerName').value,
      eMail: document.getElementById('customerEmail').value,
      passWord: document.getElementById('customerPassword').value
    };

    const method = mode === 'create' ? 'POST' : 'PUT';

    fetch(`${API_BASE}/customer`, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    })
      .then(response => response.json())
      .then(res => {
        if (res.status === 200 || res.status === 201) {
          App.showToast(`Customer ${mode === 'create' ? 'created' : 'updated'} successfully!`);
          App.closeModal('customerModal');
          this.fetchCustomers();
        } else {
          App.showToast(res.massage || 'Operation failed.', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        App.showToast('An error occurred while saving.', 'error');
      });
  },

  edit: function(cust) {
    App.openModal('customerModal', 'edit', cust);
  },

  delete: function(id) {
    if (!confirm(`Are you sure you want to delete customer ${id}?`)) return;

    fetch(`${API_BASE}/customer/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(res => {
        if (res.status === 200) {
          App.showToast('Customer deleted successfully!');
          this.fetchCustomers();
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
