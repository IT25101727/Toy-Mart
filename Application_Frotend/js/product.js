/**
 * product.js - Product Management Logic
 */

const ProductModule = {
    products: [],
    categories: [],

    init: function() {
        this.fetchProducts();
        this.fetchCategoriesForDropdown();
    },

    fetchProducts: function() {
        fetch(`${API_BASE}/product`)
            .then(response => {
                if(!response.ok && response.status !== 400) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(res => {
                if (res.status === 200 || res.status === 201) {
                    this.products = res.data || [];
                    this.renderTable();
                } else {
                    App.showToast(res.massage || 'Failed to load products.', 'error');
                }
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                App.showToast('Failed to load products.', 'error');
            });
    },

    fetchCategoriesForDropdown: function() {
        fetch(`${API_BASE}/category`)
            .then(response => response.json().catch(() => {}))
            .then(res => {
                if (res && (res.status === 200 || res.status === 201)) {
                    this.categories = res.data || [];
                    this.populateCategoryDropdown();
                }
            })
            .catch(error => {
                console.error('Error fetching categories for dropdown:', error);
            });
    },

    populateCategoryDropdown: function() {
        const select = document.getElementById('productCategory');
        if (!select) return;
        
        let html = '<option value="" disabled selected>Select a category</option>';
        this.categories.forEach(cat => {
            html += `<option value="${cat.id}">${cat.name}</option>`;
        });
        select.innerHTML = html;
    },

    renderTable: function(data = this.products) {
        const tbody = document.getElementById('product-table-body');
        if (!tbody) return;
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="px-6 py-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">No products found.</td></tr>';
            return;
        }
        
        let html = '';
        data.forEach(prod => {
            const catName = prod.category ? prod.category.name : '<span class="text-gray-400 italic">None</span>';
            html += `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${prod.id}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${prod.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${prod.qty}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${prod.price != null ? Number(prod.price).toFixed(2) : '0.00'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${catName}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onclick='ProductModule.edit(${JSON.stringify(prod)})' class="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-3 p-1 rounded hover:bg-brand-50 dark:hover:bg-brand-900/30 transition-colors">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button onclick="ProductModule.delete('${prod.id}')" class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    },

    handleSearch: function(query) {
        const filtered = this.products.filter(p => 
            p.id.toLowerCase().includes(query.toLowerCase()) || 
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            (p.category && p.category.name.toLowerCase().includes(query.toLowerCase()))
        );
        this.renderTable(filtered);
    },

    setupModal: function(mode, data) {
        document.getElementById('productFormMode').value = mode;
        document.getElementById('productModalTitle').innerText = mode === 'create' ? 'Add New Product' : 'Edit Product';
        
        const idInput = document.getElementById('productID');
        idInput.classList.add('bg-gray-100', 'dark:bg-gray-800', 'cursor-not-allowed');
        
        if (mode === 'edit' && data) {
            idInput.value = data.id;
            document.getElementById('productName').value = data.name;
            document.getElementById('productQty').value = data.qty;
            document.getElementById('productPrice').value = data.price || '';
            if (data.category && data.category.id) {
                document.getElementById('productCategory').value = data.category.id;
            } else {
                document.getElementById('productCategory').value = "";
            }
        } else if (mode === 'create') {
            const nextNum = this.products.length > 0 
                ? Math.max(...this.products.map(p => {
                    const match = p.id.match(/\d+/);
                    return match ? parseInt(match[0]) : 0;
                })) + 1 
                : 1;
            idInput.value = 'P' + nextNum.toString().padStart(3, '0');
            document.getElementById('productName').value = "";
            document.getElementById('productQty').value = "";
            document.getElementById('productPrice').value = "";
            document.getElementById('productCategory').value = "";
        }
    },

    handleSubmit: function(e) {
        e.preventDefault();
        
        const mode = document.getElementById('productFormMode').value;
        const categoryId = parseInt(document.getElementById('productCategory').value);
        
        const productData = {
            id: document.getElementById('productID').value,
            name: document.getElementById('productName').value,
            qty: parseInt(document.getElementById('productQty').value) || 0,
            price: parseFloat(document.getElementById('productPrice').value) || 0,
            category: {
                id: categoryId
            }
        };
        
        const method = mode === 'create' ? 'POST' : 'PUT';
        
        fetch(`${API_BASE}/product`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        })
        .then(response => response.json().catch(() => ({ massage: 'Server error' })))
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                App.showToast(`Product ${mode === 'create' ? 'created' : 'updated'} successfully!`);
                App.closeModal('productModal');
                this.fetchProducts();
            } else {
                // Ensure errors like "user already exists" are shown in the toast
                App.showToast(res.massage || 'Operation failed.', 'error');
            }
        })
        .catch(err => {
            console.error(err);
            App.showToast('An error occurred while saving.', 'error');
        });
    },

    edit: function(prod) {
        App.openModal('productModal', 'edit', prod);
    },

    delete: function(id) {
        if (!confirm(`Are you sure you want to delete product ${id}?`)) return;
        
        fetch(`${API_BASE}/product/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json().catch(() => ({ massage: 'Server error' })))
        .then(res => {
            if (res.status === 200) {
                App.showToast('Product deleted successfully!');
                this.fetchProducts();
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
