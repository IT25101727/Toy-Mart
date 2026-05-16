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
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    if (data.length === 0) {
      grid.innerHTML = '<div class="col-span-full py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"><i class="fa-solid fa-box-open text-4xl mb-3 text-gray-300 dark:text-gray-600"></i><p>No products found.</p></div>';
      return;
    }

    let html = '';
    data.forEach(prod => {
      const catName = prod.category ? prod.category.name : '<span class="text-gray-400 italic">None</span>';
      const imgHtml = (prod.image && prod.image.imgData)
        ? `<img src="data:${prod.image.imgType};base64,${prod.image.imgData}" alt="${prod.name}" class="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300">`
        : `<div class="w-full h-48 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400"><i class="fa-solid fa-image text-4xl"></i></div>`;

      html += `
                <div class="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative">
                    <div class="overflow-hidden relative">
                        ${imgHtml}
                        <div class="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-700 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-700">
                            ${prod.id}
                        </div>
                    </div>

                    <div class="p-5 flex-1 flex flex-col">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1" title="${prod.name}">${prod.name}</h3>
                            <span class="text-sm px-2 py-0.5 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full font-medium whitespace-nowrap ml-2">${catName}</span>
                        </div>

                        <div class="text-2xl font-black text-brand-600 dark:text-brand-400 mb-4">
                            Rs. ${prod.price != null ? Number(prod.price).toFixed(2) : '0.00'}
                        </div>

                        <div class="mt-auto flex items-center justify-between">
                            <div class="flex items-center text-sm font-medium ${prod.qty > 10 ? 'text-green-600 dark:text-green-400' : (prod.qty > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400')} bg-gray-50 dark:bg-gray-800/80 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                <i class="fa-solid fa-layer-group mr-2"></i> ${prod.qty} in stock
                            </div>

                            <div class="flex space-x-2">
                                <button onclick='ProductModule.edit(${JSON.stringify(prod)})' class="w-9 h-9 flex items-center justify-center rounded-lg text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/20 dark:hover:bg-brand-900/40 dark:text-brand-400 transition-colors tooltip" title="Edit Product">
                                    <i class="fa-solid fa-pen"></i>
                                </button>
                                <button onclick="ProductModule.delete('${prod.id}')" class="w-9 h-9 flex items-center justify-center rounded-lg text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 transition-colors tooltip" title="Delete Product">
                                    <i class="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
    });
    grid.innerHTML = html;
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

    const imgInputContainer = document.getElementById('productImageContainer');
    const imgInput = document.getElementById('productImage');

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
      if (imgInputContainer) imgInputContainer.style.display = 'block';
      if (imgInput) {
        imgInput.value = '';
        imgInput.required = false;
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
      if (imgInputContainer) imgInputContainer.style.display = 'block';
      if (imgInput) {
        imgInput.value = '';
        imgInput.required = true;
      }
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

    const formData = new FormData();
    formData.append('product', JSON.stringify(productData));

    const imgInput = document.getElementById('productImage');
    if (imgInput && imgInput.files.length > 0) {
      formData.append('img', imgInput.files[0]);
    } else if (mode === 'create') {
      App.showToast('Please select a product image', 'error');
      return;
    }

    const fetchOptions = {
      method: method,
      body: formData
    };

    fetch(`${API_BASE}/product`, fetchOptions)
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
