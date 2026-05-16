/**
 * main.js - Core Application Logic
 */

const API_BASE = 'http://localhost:8080/api';

const App = {
    state: {
        currentView: 'dashboard'
    },

    navigate: function (viewId) {
        this.state.currentView = viewId;

        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active-nav'));
        const navBtn = document.getElementById(`nav-${viewId}`);
        if (navBtn) navBtn.classList.add('active-nav');

        const titles = {
            'dashboard': 'Dashboard',
            'admin': 'Admin Management',
            'customer': 'Customer Management',
            'category': 'Category Management',
            'product': 'Product Management',
            'order': 'Order Management',
            'payment': 'Payment Management'
        };
        document.getElementById('page-title').innerText = titles[viewId];

        // Search container visibility
        const searchContainer = document.getElementById('search-container');
        if (searchContainer) {
            if (viewId === 'dashboard') {
                searchContainer.classList.add('hidden');
            } else {
                searchContainer.classList.remove('hidden');
                const searchInput = document.getElementById('global-search');
                if (searchInput) searchInput.value = ''; // Reset search on navigate
            }
        }

        const contentContainer = document.getElementById('app-content');

        // Fetch the HTML template
        fetch(`views/${viewId}.html`)
            .then(response => {
                if (!response.ok) throw new Error('Failed to load view');
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;

                // Initialize the loaded view
                if (viewId === 'admin' && typeof AdminModule !== 'undefined') AdminModule.fetchAdmins();
                if (viewId === 'customer' && typeof CustomerModule !== 'undefined') CustomerModule.fetchCustomers();
                if (viewId === 'category' && typeof CategoryModule !== 'undefined') CategoryModule.fetchCategories();
                if (viewId === 'product' && typeof ProductModule !== 'undefined') ProductModule.init();
                if (viewId === 'order' && typeof OrderModule !== 'undefined') OrderModule.init();
                if (viewId === 'payment' && typeof PaymentModule !== 'undefined') PaymentModule.init();

                if (viewId === 'dashboard') {
                    const fetchStat = (url, elementId) => {
                        fetch(url)
                            .then(res => res.json().catch(() => ({})))
                            .then(data => {
                                if (data && data.data) {
                                    App.animateNumber(elementId, data.data.length);
                                }
                            });
                    };
                    fetchStat(`${API_BASE}/admin`, 'stat-admin-count');
                    fetchStat(`${API_BASE}/customer`, 'stat-customer-count');
                    fetchStat(`${API_BASE}/category`, 'stat-category-count');
                    fetchStat(`${API_BASE}/product`, 'stat-product-count');
                }
            })
            .catch(error => {
                console.error('View load error:', error);
                App.showToast('Failed to load page.', 'error');
                contentContainer.innerHTML = `<div class="p-8 text-center text-red-500">Error loading view: ${viewId}</div>`;
            });
    },

    animateNumber: function (elementId, endValue) {
        const obj = document.getElementById(elementId);
        if (!obj) return;

        let startTimestamp = null;
        const duration = 1500;

        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // easeOutQuart
            const easeProgress = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeProgress * endValue);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },

    openModal: function (modalId, mode = 'create', data = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        modal.classList.remove('hidden');

        const form = modal.querySelector('form');
        if (form) form.reset();

        if (modalId === 'adminModal' && typeof AdminModule !== 'undefined') {
            AdminModule.setupModal(mode, data);
        } else if (modalId === 'customerModal' && typeof CustomerModule !== 'undefined') {
            CustomerModule.setupModal(mode, data);
        } else if (modalId === 'categoryModal' && typeof CategoryModule !== 'undefined') {
            CategoryModule.setupModal(mode, data);
        } else if (modalId === 'productModal' && typeof ProductModule !== 'undefined') {
            ProductModule.setupModal(mode, data);
        } else if (modalId === 'orderModal' && typeof OrderModule !== 'undefined') {
            OrderModule.setupModal(mode, data);
        } else if (modalId === 'paymentModal' && typeof PaymentModule !== 'undefined') {
            PaymentModule.setupModal(mode, data);
        }
    },

    handleSearch: function (query) {
        const view = this.state.currentView;
        if (view === 'admin' && typeof AdminModule !== 'undefined') AdminModule.handleSearch(query);
        if (view === 'customer' && typeof CustomerModule !== 'undefined') CustomerModule.handleSearch(query);
        if (view === 'category' && typeof CategoryModule !== 'undefined') CategoryModule.handleSearch(query);
        if (view === 'product' && typeof ProductModule !== 'undefined') ProductModule.handleSearch(query);
        if (view === 'order' && typeof OrderModule !== 'undefined') OrderModule.handleSearch(query);
        if (view === 'payment' && typeof PaymentModule !== 'undefined') PaymentModule.handleSearch(query);
    },

    closeModal: function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
        }
    },

    showToast: function (message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');

        // Tailwind classes handling dark mode as well
        const bgColors = {
            'success': 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-100',
            'error': 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-100',
            'info': 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-100'
        };

        const icons = {
            'success': 'fa-circle-check text-green-500 dark:text-green-400',
            'error': 'fa-circle-exclamation text-red-500 dark:text-red-400',
            'info': 'fa-circle-info text-blue-500 dark:text-blue-400'
        };

        toast.className = `toast flex items-center p-4 rounded-lg border shadow-sm ${bgColors[type]} max-w-sm w-full backdrop-blur-md`;
        toast.innerHTML = `
            <i class="fa-solid ${icons[type]} text-xl mr-3"></i>
            <div class="text-sm font-medium">${message}</div>
            <button class="ml-auto text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white focus:outline-none transition-colors" onclick="this.parentElement.remove()">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    init: function () {
        this.checkSession();
    },

    checkSession: function () {
        const user = localStorage.getItem('currentUser');
        if (user) {
            const userData = JSON.parse(user);
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('main-sidebar').classList.remove('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            this.updateProfile(userData.userName);
            this.navigate('dashboard');
        } else {
            document.getElementById('login-screen').classList.remove('hidden');
            document.getElementById('main-sidebar').classList.add('hidden');
            document.getElementById('main-content').classList.add('hidden');
        }
    },

    updateProfile: function (userName) {
        const nameEl = document.getElementById('user-display-name');
        const initialEl = document.getElementById('user-initials');
        if (nameEl) nameEl.innerText = userName;
        if (initialEl) initialEl.innerText = userName.charAt(0).toUpperCase();
    }
};

const AuthModule = {
    handleLogin: function (event) {
        event.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        const errorEl = document.getElementById('login-error');

        errorEl.classList.add('hidden');

        // Fetch admins to verify
        fetch(`${API_BASE}/admin`)
            .then(res => res.json())
            .then(data => {
                const admin = data.data.find(a => a.userName === user && a.password === pass);
                if (admin) {
                    localStorage.setItem('currentUser', JSON.stringify(admin));
                    App.showToast('Login successful!');
                    App.checkSession();
                } else {
                    errorEl.classList.remove('hidden');
                    App.showToast('Invalid username or password', 'error');
                }
            })
            .catch(err => {
                console.error('Login error:', err);
                App.showToast('Server error during login', 'error');
            });
    },

    logout: function () {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            App.checkSession();
            App.showToast('Logged out successfully');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
