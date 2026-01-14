const products = [
    { id: 1, title: "Wireless Headphones", category: "electronics", price: 89.99, old: 129.99, image: "🎧", desc: "Premium wireless headphones with noise cancellation" },
    { id: 2, title: "Smart Watch", category: "electronics", price: 199.99, old: 299.99, image: "⌚", desc: "Advanced smartwatch with heart rate monitor" },
    { id: 3, title: "Classic T-Shirt", category: "fashion", price: 19.99, old: 39.99, image: "👕", desc: "Comfortable t-shirt made from organic cotton" },
    { id: 4, title: "Running Shoes", category: "sports", price: 79.99, old: 119.99, image: "👟", desc: "Lightweight running shoes with advanced cushioning" },
    { id: 5, title: "Water Bottle", category: "home", price: 34.99, old: 49.99, image: "🧴", desc: "Insulated stainless steel water bottle" },
    { id: 6, title: "Vintage Watch", category: "fashion", price: 149.99, old: 199.99, image: "⌚", desc: "Elegant watch with leather strap" },
    { id: 7, title: "Portable Speaker", category: "electronics", price: 59.99, old: 89.99, image: "🔊", desc: "Compact Bluetooth speaker with powerful bass" },
    { id: 8, title: "Yoga Mat", category: "sports", price: 29.99, old: 49.99, image: "🧘", desc: "Non-slip yoga mat with extra cushioning" },
];

let cart = [];
let filter = "all";
let selectedProduct = null;

// DOM Elements
const grid = document.getElementById('grid');
const cartBtn = document.getElementById('cart-btn');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const count = document.getElementById('count');
const total = document.getElementById('total');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('close-modal');
const search = document.getElementById('search');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('.filter-btn.active').classList.remove('active');
        btn.classList.add('active');
        filter = btn.dataset.filter;
        render();
    });
});

cartBtn.addEventListener('click', () => cartPanel.classList.add('open'));
closeCart.addEventListener('click', () => cartPanel.classList.remove('open'));
closeModal.addEventListener('click', () => modal.classList.remove('open'));
search.addEventListener('keyup', render);
checkoutBtn.addEventListener('click', () => {
    alert('Order placed! Thank you for shopping!');
    cart = [];
    updateCart();
    cartPanel.classList.remove('open');
});

// Render products
function render() {
    const query = search.value.toLowerCase();
    const filtered = products.filter(p => 
        (filter === 'all' || p.category === filter) &&
        (p.title.toLowerCase().includes(query) || p.category.includes(query))
    );
    
    grid.innerHTML = filtered.map(p => `
        <div class="card">
            <div class="card-img">${p.image}</div>
            <div class="card-info">
                <div class="card-category">${p.category}</div>
                <div class="card-title">${p.title}</div>
                <div class="card-price">
                    <span>$${p.price}</span>
                    <span>$${p.old}</span>
                </div>
                <div class="card-buttons">
                    <button class="quick-view" onclick="openModal(${p.id})">Quick View</button>
                    <button class="add-cart" onclick="addCart(${p.id})">Add</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Cart functions
function addCart(id) {
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) existing.qty++;
    else cart.push({...product, qty: 1});
    
    updateCart();
    alert(product.title + ' added to cart!');
}

function removeCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateQty(id, qty) {
    const item = cart.find(item => item.id === id);
    if (item) item.qty = Math.max(1, qty);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    count.textContent = cart.length;
    
    const t = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    total.textContent = t.toFixed(2);
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center;padding:2rem;">Cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-img">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">$${item.price}</div>
                <div class="cart-item-controls">
                    <button onclick="updateQty(${item.id}, ${item.qty - 1})">−</button>
                    <input type="number" value="${item.qty}" onchange="updateQty(${item.id}, this.value)">
                    <button onclick="updateQty(${item.id}, ${item.qty + 1})">+</button>
                    <button class="cart-item-remove" onclick="removeCart(${item.id})">✕</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Modal
function openModal(id) {
    selectedProduct = products.find(p => p.id === id);
    document.getElementById('modal-img').textContent = selectedProduct.image;
    document.getElementById('modal-title').textContent = selectedProduct.title;
    document.getElementById('modal-desc').textContent = selectedProduct.desc;
    document.getElementById('modal-price').textContent = '$' + selectedProduct.price;
    document.getElementById('modal-old-price').textContent = '$' + selectedProduct.old;
    document.getElementById('qty').value = 1;
    modal.classList.add('open');
}

document.getElementById('add-modal').addEventListener('click', () => {
    const qty = parseInt(document.getElementById('qty').value);
    for (let i = 0; i < qty; i++) addCart(selectedProduct.id);
    modal.classList.remove('open');
});

// Load cart on start
function init() {
    const saved = localStorage.getItem('cart');
    if (saved) cart = JSON.parse(saved);
    render();
    updateCart();
}

init();