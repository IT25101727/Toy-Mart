/**
 * admin.js - Admin Management Logic
 */

const AdminModule = {
    admins: [],

    fetchAdmins: function(statsOnly = false) {
        fetch(`${API_BASE}/admin`)
            .then(response => response.json())
            .then(res => {
                const admins = res.data || [];
                this.admins = admins;
                
                if (document.getElementById('stat-admin-count')) {
                    document.getElementById('stat-admin-count').innerText = admins.length;
                }
                
                if (!statsOnly) this.renderTable();
            })
            .catch(error => {
                console.error('Error fetching admins:', error);
                if(!statsOnly) App.showToast('Failed to load administrators.', 'error');
            });
    },

    renderTable: function(data = this.admins) {
        const tbody = document.getElementById('admin-table-body');
        if (!tbody) return;
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">No administrators found.</td></tr>';
            return;
        }
        
        let html = '';
        data.forEach(admin => {
            html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${admin.adminID}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${admin.userName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick='AdminModule.edit(${JSON.stringify(admin)})' class="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-3 p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="AdminModule.delete('${admin.adminID}')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    handleSearch: function(query) {
        const filtered = this.admins.filter(a => 
            a.adminID.toLowerCase().includes(query.toLowerCase()) || 
            a.userName.toLowerCase().includes(query.toLowerCase())
        );
        this.renderTable(filtered);
    },

    setupModal: function(mode, data) {
        document.getElementById('adminFormMode').value = mode;
        document.getElementById('adminModalTitle').innerText = mode === 'create' ? 'Add New Admin' : 'Edit Admin';
        
        const idInput = document.getElementById('adminID');
        idInput.readOnly = true;
        // Visual indicator that it's disabled/readonly
        idInput.classList.add('bg-gray-100', 'dark:bg-gray-800', 'cursor-not-allowed');
        
        if (mode === 'edit' && data) {
            idInput.value = data.adminID;
            document.getElementById('adminUsername').value = data.userName;
            document.getElementById('adminPassword').value = data.password;
        } else if (mode === 'create') {
            const nextNum = this.admins.length > 0 
                ? Math.max(...this.admins.map(a => {
                    const match = a.adminID.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                })) + 1 
                : 1;
            idInput.value = 'A' + nextNum.toString().padStart(3, '0');
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();
        
        const mode = document.getElementById('adminFormMode').value;
        const adminData = {
            adminID: document.getElementById('adminID').value,
            userName: document.getElementById('adminUsername').value,
            password: document.getElementById('adminPassword').value
        };
        
        const method = mode === 'create' ? 'POST' : 'PUT';
        
        fetch(`${API_BASE}/admin`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminData)
        })
        .then(response => response.json())
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                App.showToast(`Administrator ${mode === 'create' ? 'created' : 'updated'} successfully!`);
                App.closeModal('adminModal');
                this.fetchAdmins();
            } else {
                App.showToast(res.massage || 'Operation failed.', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            App.showToast('An error occurred while saving.', 'error');
        });
    },

    edit: function(admin) {
        App.openModal('adminModal', 'edit', admin);
    },

    delete: function(id) {
        if (!confirm(`Are you sure you want to delete administrator ${id}?`)) return;
        
        fetch(`${API_BASE}/admin/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(res => {
            if (res.status === 200) {
                App.showToast('Administrator deleted successfully!');
                this.fetchAdmins();
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
