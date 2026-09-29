// ==========================================
// B-MAX IMPRESIÓN 3D - SISTEMA GLOBAL JS
// Carrito, Notificaciones, Menú Móvil, Búsqueda y Panel Admin
// ==========================================

const CART_STORAGE_KEY = 'bmax_cart_v1';
const PRODUCTS_STORAGE_KEY = 'bmax_custom_products_v1';
const ADMIN_SESSION_KEY = 'bmax_admin_session';

// Credenciales
const ADMIN_USER = 'Cami';
const ADMIN_PASS = 'Cami1144';

// Verificar sesión
function isAdminLoggedIn() {
    return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

function loginAdmin(user, pass) {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
        localStorage.setItem(ADMIN_SESSION_KEY, 'true');
        showToast('¡Bienvenido/a Cami! Modo administrador activado.');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1000);
        return true;
    } else {
        alert('Usuario o contraseña incorrectos.');
        return false;
    }
}

function logoutAdmin() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    showToast('Sesión de administración cerrada.');
    setTimeout(() => {
        window.location.reload();
    }, 800);
}

// Renderizar Botón Login / Admin en Header
function renderHeaderAdminBtn() {
    const actionContainers = document.querySelectorAll('header .shrink-0.flex.items-center.gap-5');
    
    actionContainers.forEach(container => {
        if (container.querySelector('#btn-admin-login-header')) return;

        const btn = document.createElement('button');
        btn.id = 'btn-admin-login-header';
        btn.type = 'button';
        btn.className = 'text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5';

        if (isAdminLoggedIn()) {
            btn.className += ' bg-brand-dark text-white border-brand-dark hover:bg-brand-tan hover:text-brand-dark';
            btn.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span>Panel Admin</span>
            `;
            btn.onclick = () => { window.location.href = 'admin.html'; };
        } else {
            btn.className += ' bg-white hover:bg-brand-tan/20 text-brand-dark border-brand-border';
            btn.innerHTML = `
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                <span>Login</span>
            `;
            btn.onclick = () => openLoginModal();
        }

        container.appendChild(btn);
    });
}

// Modal de Login
function openLoginModal() {
    let modal = document.getElementById('login-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'login-modal';
        modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-[#F8F5F2] w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-[#E3DDD5] relative animate-in fade-in zoom-in duration-200">
                <button id="btn-close-login" class="absolute top-4 right-4 text-gray-400 hover:text-black text-xl leading-none">&times;</button>
                <div class="text-center mb-6">
                    <span class="text-[10px] font-bold tracking-[0.2em] text-[#766B63] uppercase">Acceso Restringido</span>
                    <h3 class="text-xl font-light text-[#2B221B] mt-1">Ingreso Administrador</h3>
                </div>
                <form id="login-form" class="space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-[#2B221B] mb-1">Usuario</label>
                        <input type="text" id="login-user" required placeholder="Ingresá tu usuario" class="w-full bg-white border border-[#E3DDD5] rounded-xl px-4 py-2.5 text-xs text-[#2B221B] focus:outline-none focus:border-[#CFAD91]" />
                    </div>
                    <div>
                        <label class="block text-xs font-semibold text-[#2B221B] mb-1">Contraseña</label>
                        <input type="password" id="login-pass" required placeholder="••••••••" class="w-full bg-white border border-[#E3DDD5] rounded-xl px-4 py-2.5 text-xs text-[#2B221B] focus:outline-none focus:border-[#CFAD91]" />
                    </div>
                    <button type="submit" class="w-full bg-[#CFAD91] hover:bg-[#C29E80] text-[#2B221B] font-semibold py-3 rounded-full text-xs uppercase tracking-wider transition-all shadow-sm">
                        Ingresar al Control
                    </button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-close-login').onclick = closeLoginModal;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeLoginModal();
        });

        document.getElementById('login-form').onsubmit = handleLoginSubmit;
    }
    modal.classList.remove('hidden');
    modal.classList.add('flex');
}

function closeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}

function handleLoginSubmit(e) {
    e.preventDefault();
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();
    if (loginAdmin(user, pass)) {
        closeLoginModal();
    }
}

// LocalStorage Carrito
function getCart() {
    try {
        const cart = localStorage.getItem(CART_STORAGE_KEY);
        return cart ? JSON.parse(cart) : [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        updateCartBadge();
    } catch (e) {
        console.error('Error al guardar carrito:', e);
    }
}

function addToCart(product) {
    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += (product.quantity || 1);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: Number(product.price),
            image: product.image,
            category: product.category || 'General',
            quantity: product.quantity || 1
        });
    }

    saveCart(cart);
    showToast(`"${product.name}" se agregó al carrito.`);
}

function updateCartQuantity(id, delta) {
    let cart = getCart();
    const item = cart.find(item => item.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.id !== id);
    saveCart(cart);
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    showToast('Producto eliminado del carrito.');
}

function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartBadge();
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    badges.forEach(badge => {
        if (totalCount > 0) {
            badge.textContent = totalCount;
            badge.classList.remove('hidden');
        } else {
            badge.textContent = '0';
            badge.classList.add('hidden');
        }
    });
}

function showToast(message) {
    let toast = document.getElementById('bmax-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'bmax-toast';
        toast.className = 'fixed bottom-6 right-6 z-50 transform transition-all duration-300 translate-y-20 opacity-0 bg-[#2B221B] text-white px-5 py-3.5 rounded-xl shadow-2xl text-[13px] flex items-center gap-3 border border-[#CFAD91]/40';
        toast.innerHTML = `
            <svg class="w-4 h-4 text-[#CFAD91] shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
            <span id="bmax-toast-msg" class="font-normal"></span>
        `;
        document.body.appendChild(toast);
    }

    const msgSpan = document.getElementById('bmax-toast-msg');
    if (msgSpan) msgSpan.textContent = message;

    toast.classList.remove('translate-y-20', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    if (window.toastTimeout) clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
}

// Búsqueda
function openSearchModal() {
    let modal = document.getElementById('search-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'search-modal';
        modal.className = 'fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4 transition-opacity';
        modal.innerHTML = `
            <div class="bg-[#F8F5F2] w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-[#E3DDD5] relative animate-in fade-in zoom-in duration-200">
                <div class="flex items-center justify-between pb-4 border-b border-[#E3DDD5]">
                    <h3 class="text-sm font-semibold tracking-wider text-[#2B221B] uppercase">Buscar en B-Max</h3>
                    <button id="btn-close-search" class="text-gray-400 hover:text-black p-1 text-lg leading-none">&times;</button>
                </div>
                <div class="mt-4 relative">
                    <input type="text" id="search-input" placeholder="Ej: maceta, organizador, llavero..." class="w-full bg-white border border-[#E3DDD5] rounded-full px-5 py-3 text-sm text-[#2B221B] focus:outline-none focus:border-[#CFAD91] shadow-inner" />
                    <button id="btn-execute-search" class="absolute right-2 top-2 bg-[#CFAD91] hover:bg-[#C29E80] text-[#2B221B] font-semibold text-xs px-4 py-2 rounded-full uppercase tracking-wider transition-colors">
                        Buscar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('btn-close-search').onclick = closeSearchModal;
        document.getElementById('btn-execute-search').onclick = executeSearch;

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeSearchModal();
        });

        const input = document.getElementById('search-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') executeSearch();
            if (e.key === 'Escape') closeSearchModal();
        });
    }
    modal.classList.remove('hidden');
}

function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.add('hidden');
}

function executeSearch() {
    const query = document.getElementById('search-input')?.value.trim();
    if (query) {
        window.location.href = `productos.html?q=${encodeURIComponent(query)}`;
    }
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.toggle('hidden');
}

// Inicialización automática de la interfaz
function initAppUI() {
    updateCartBadge();
    renderHeaderAdminBtn();

    document.querySelectorAll('.btn-search').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            openSearchModal();
        };
    });

    const mobileBtn = document.getElementById('btn-mobile-menu');
    if (mobileBtn) mobileBtn.onclick = toggleMobileMenu;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAppUI);
} else {
    initAppUI();
}
