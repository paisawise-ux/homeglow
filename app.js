// ==========================================
// HomeGlow Store - Main Application Logic
// ==========================================

// ===== PRODUCT DATA (with cost prices for profit tracking) =====
// costPrice = what YOU pay the supplier | price = what CUSTOMER pays
const PRODUCTS = [
  {
    id: 1,
    name: "Ceiling Fan Cleaning Duster",
    category: "cleaning",
    price: 349,
    originalPrice: 599,
    costPrice: 120,      // Your cost from supplier
    supplier: "BaapStore",
    image: "images/fan-cleaner.png",
    rating: 4.8,
    reviews: 127,
    badge: "Bestseller",
    description: "Extendable microfiber ceiling fan duster that bends to clean both sides of fan blades in one swipe. No ladder needed! Washable and reusable head.",
    features: [
      "Extendable handle — reaches any ceiling fan",
      "Microfiber head — traps dust, doesn't spread it",
      "Washable & reusable — eco-friendly",
      "Lightweight — easy for anyone to use",
      "Works on AC vents, blinds & shelves too"
    ]
  },
  {
    id: 2,
    name: "Premium Spin Mop with Bucket Set",
    category: "cleaning",
    price: 799,
    originalPrice: 1499,
    costPrice: 350,
    supplier: "BaapStore",
    image: "images/spin-mop.png",
    rating: 4.7,
    reviews: 95,
    badge: "47% OFF",
    description: "Heavy-duty stainless steel spin mop with wheeled bucket. 360° rotating head, built-in wringer, and 2 extra microfiber refill heads included.",
    features: [
      "360° spin technology — no hand wringing",
      "Stainless steel handle — durable & rust-free",
      "Wheeled bucket — easy to move around",
      "2 extra refill heads included",
      "Deep cleans tiles, marble & wooden floors"
    ]
  },
  {
    id: 3,
    name: "Minimalist Floating Wall Shelf",
    category: "decor",
    price: 449,
    originalPrice: 799,
    costPrice: 180,
    supplier: "BaapStore",
    image: "images/wall-shelf.png",
    rating: 4.9,
    reviews: 84,
    badge: "Top Rated",
    description: "Solid wood floating shelf with invisible mounting brackets. Perfect for displaying plants, photos, candles or books. Adds elegance to any room.",
    features: [
      "Solid natural wood — premium finish",
      "Invisible mounting — looks like it floats",
      "Holds up to 10kg — sturdy & reliable",
      "Easy DIY installation — hardware included",
      "Perfect for living room, bedroom or study"
    ]
  },
  {
    id: 4,
    name: "Eco-Friendly Spray Bottle Set (3pc)",
    category: "eco",
    price: 399,
    originalPrice: 699,
    costPrice: 150,
    supplier: "BaapStore",
    image: "images/spray-bottles.png",
    rating: 4.6,
    reviews: 63,
    badge: "Eco ♻️",
    description: "Set of 3 premium amber glass spray bottles with leak-proof nozzles. Perfect for homemade cleaners, essential oil mixes, or plant misting.",
    features: [
      "Amber glass — protects contents from UV light",
      "Leak-proof trigger nozzle — adjustable spray",
      "Reusable & eco-friendly — no more plastic",
      "Includes waterproof labels + marker",
      "500ml capacity each — perfect size"
    ]
  },
  {
    id: 5,
    name: "Gold Mushroom LED Table Lamp",
    category: "decor",
    price: 599,
    originalPrice: 999,
    costPrice: 220,
    supplier: "BaapStore",
    image: "images/led-lamp.png",
    rating: 4.8,
    reviews: 112,
    badge: "Trending",
    description: "Rechargeable LED table lamp with warm ambient glow. Touch-controlled brightness, cordless design, and a stunning brushed gold finish. USB-C charging.",
    features: [
      "3 brightness levels — touch controlled",
      "Cordless — rechargeable via USB-C",
      "8-hour battery life on single charge",
      "Warm 2700K light — cozy ambiance",
      "Premium brushed gold metal finish"
    ]
  },
  {
    id: 6,
    name: "3-Tier Bamboo Kitchen Organizer",
    category: "kitchen",
    price: 549,
    originalPrice: 899,
    costPrice: 200,
    supplier: "BaapStore",
    image: "images/organizer.png",
    rating: 4.7,
    reviews: 76,
    badge: "New",
    description: "3-tier bamboo shelf organizer for kitchen countertops. Holds spices, bottles, jars and cooking utensils. Space-saving vertical design.",
    features: [
      "Natural bamboo — eco-friendly & durable",
      "3 spacious tiers — maximizes counter space",
      "Anti-slip rubber feet — stays in place",
      "Easy assembly — no tools needed",
      "Works in kitchen, bathroom or office"
    ]
  }
];

// =============================================================================
// ⚙️ CONFIGURATION — UPDATE THESE WITH YOUR REAL VALUES
// =============================================================================
const CONFIG = {
  // ---- RAZORPAY ----
  // Sign up at https://dashboard.razorpay.com → Settings → API Keys
  // Use "rzp_test_..." for testing, "rzp_live_..." when ready for real payments
  razorpayKeyId: "rzp_test_XXXXXXXXXXXX",

  // ---- BUSINESS INFO ----
  businessName: "HomeGlow",
  businessLogo: "images/logo.png",

  // ---- SHIPPING ----
  shippingFee: 0,
  freeShippingAbove: 499,

  // ---- GOOGLE SHEETS (Order Tracking) ----
  // Follow setup instructions in google-sheets-script.js
  // After deploying, paste the Web App URL here:
  googleSheetURL: "https://script.google.com/macros/s/AKfycbz4r9fc4Sb9ZVt-f6Yeoee7zvQPss0I1VmRBcPP8R7_DPgguZ1KCbTJT0fVy_jF9wMJ/exec",

  // ---- WHATSAPP ----
  whatsappNumber: "919999999999",

  // ---- CURRENCY ----
  currency: "INR"
};

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('homeglow_cart') || '[]');
let activeFilter = 'all';
let selectedPayment = 'online';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  setupEventListeners();
  setupScrollReveal();
  setupHeaderScroll();
});

// ===== RENDER PRODUCTS =====
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = filtered.map(product => `
    <div class="product-card" data-id="${product.id}">
      ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
      <div class="product-image" onclick="openProductModal(${product.id})">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <div class="product-quick-actions">
          <button class="quick-action-btn" onclick="event.stopPropagation(); openProductModal(${product.id})" title="Quick view">👁️</button>
          <button class="quick-action-btn" onclick="event.stopPropagation(); addToCart(${product.id})" title="Add to cart">🛒</button>
        </div>
      </div>
      <div class="product-info">
        <div class="product-category">${getCategoryLabel(product.category)}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="stars">${getStars(product.rating)}</span>
          <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-price-row">
          <div class="product-price">
            ₹${product.price}
            <span class="original-price">₹${product.originalPrice}</span>
          </div>
          <button class="add-to-cart-btn" onclick="addToCart(${product.id})" title="Add to cart">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryLabel(cat) {
  const labels = { cleaning: 'Cleaning', decor: 'Home Decor', kitchen: 'Kitchen', eco: 'Eco Friendly' };
  return labels[cat] || cat;
}

function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
}

// ===== CART LOGIC =====
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: productId, qty: 1 });
  }

  saveCart();
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(productId); return; }
  saveCart();
  updateCartUI();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
}

function saveCart() {
  localStorage.setItem('homeglow_cart', JSON.stringify(cart));
}

function getCartSubtotal() {
  return cart.reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return total + (product ? product.price * item.qty : 0);
  }, 0);
}

function getCartCost() {
  return cart.reduce((total, item) => {
    const product = PRODUCTS.find(p => p.id === item.id);
    return total + (product ? product.costPrice * item.qty : 0);
  }, 0);
}

function getShippingFee() {
  const subtotal = getCartSubtotal();
  if (CONFIG.freeShippingAbove && subtotal >= CONFIG.freeShippingAbove) return 0;
  return CONFIG.shippingFee;
}

function getCartTotal() {
  return getCartSubtotal() + getShippingFee();
}

function updateCartUI() {
  const countEl = document.getElementById('cartCount');
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  countEl.textContent = totalCount;
  countEl.classList.toggle('show', totalCount > 0);
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>Your cart is empty</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;">Add some products to get started!</p>
      </div>`;
    footer.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => {
    const product = PRODUCTS.find(p => p.id === item.id);
    if (!product) return '';
    return `
      <div class="cart-item">
        <div class="cart-item-image"><img src="${product.image}" alt="${product.name}"></div>
        <div class="cart-item-details">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">₹${product.price * item.qty}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>`;
  }).join('');

  footer.style.display = 'block';
  document.getElementById('cartTotal').textContent = `₹${getCartTotal()}`;
}

// ===== CART SIDEBAR =====
function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartSidebar').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartSidebar').classList.remove('open');
  document.body.style.overflow = '';
}

// ===== PRODUCT MODAL =====
function openProductModal(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  document.getElementById('modalImage').src = product.image;
  document.getElementById('modalImage').alt = product.name;
  document.getElementById('modalCategory').textContent = getCategoryLabel(product.category);
  document.getElementById('modalTitle').textContent = product.name;
  document.getElementById('modalPrice').innerHTML = `₹${product.price} <span class="original">₹${product.originalPrice}</span>`;
  document.getElementById('modalDescription').textContent = product.description;
  document.getElementById('modalFeatures').innerHTML = product.features.map(f => `<li>${f}</li>`).join('');

  document.getElementById('modalAddToCart').onclick = () => { addToCart(productId); closeProductModal(); };

  const waMsg = encodeURIComponent(`Hi! I'm interested in *${product.name}* (₹${product.price}) from HomeGlow.`);
  document.getElementById('modalWhatsapp').href = `https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}`;

  document.getElementById('productModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProductModal() {
  document.getElementById('productModal').classList.remove('open');
  document.body.style.overflow = '';
}

// =============================================================================
// CHECKOUT
// =============================================================================
function openCheckout() {
  if (cart.length === 0) return;
  closeCart();
  selectedPayment = 'online';
  renderCheckout();
  document.getElementById('checkoutOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCheckout() {
  document.getElementById('checkoutOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCheckout() {
  const container = document.getElementById('checkoutContainer');
  const subtotal = getCartSubtotal();
  const shipping = getShippingFee();
  const total = getCartTotal();

  container.innerHTML = `
    <div class="checkout-header">
      <h2>🛒 Checkout</h2>
      <button class="checkout-back" onclick="closeCheckout()">← Back to Store</button>
    </div>
    <div class="checkout-grid">
      <div>
        <div class="checkout-form-section">
          <h3>📦 Shipping Details</h3>
          <form id="checkoutForm" onsubmit="return false;">
            <div class="form-row">
              <div class="form-group">
                <label>Full Name <span class="required">*</span></label>
                <input type="text" id="custName" placeholder="Your full name" required>
              </div>
              <div class="form-group">
                <label>Phone Number <span class="required">*</span></label>
                <input type="tel" id="custPhone" placeholder="10-digit mobile" maxlength="10" required>
              </div>
            </div>
            <div class="form-row full">
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="custEmail" placeholder="your.email@example.com (for order updates)">
              </div>
            </div>
            <div class="form-row full">
              <div class="form-group">
                <label>Address <span class="required">*</span></label>
                <input type="text" id="custAddress" placeholder="House/Flat No., Street, Area" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City <span class="required">*</span></label>
                <input type="text" id="custCity" placeholder="City" required>
              </div>
              <div class="form-group">
                <label>Pincode <span class="required">*</span></label>
                <input type="text" id="custPincode" placeholder="6-digit pincode" maxlength="6" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>State <span class="required">*</span></label>
                <select id="custState" required>
                  <option value="">Select State</option>
                  <option>Andhra Pradesh</option><option>Arunachal Pradesh</option>
                  <option>Assam</option><option>Bihar</option><option>Chhattisgarh</option>
                  <option>Delhi</option><option>Goa</option><option>Gujarat</option>
                  <option>Haryana</option><option>Himachal Pradesh</option><option>Jharkhand</option>
                  <option>Karnataka</option><option>Kerala</option><option>Madhya Pradesh</option>
                  <option>Maharashtra</option><option>Manipur</option><option>Meghalaya</option>
                  <option>Mizoram</option><option>Nagaland</option><option>Odisha</option>
                  <option>Punjab</option><option>Rajasthan</option><option>Sikkim</option>
                  <option>Tamil Nadu</option><option>Telangana</option><option>Tripura</option>
                  <option>Uttar Pradesh</option><option>Uttarakhand</option><option>West Bengal</option>
                </select>
              </div>
              <div class="form-group">
                <label>Landmark</label>
                <input type="text" id="custLandmark" placeholder="Near...">
              </div>
            </div>
          </form>
        </div>

        <div class="checkout-form-section" style="margin-top:1.5rem;">
          <h3>💳 Payment Method</h3>
          <div class="payment-options">
            <label class="payment-option selected" id="payOnline" onclick="selectPayment('online')">
              <input type="radio" name="payment" value="online" checked>
              <div class="payment-option-label">
                <strong>Pay Online (UPI / GPay / Cards)</strong>
                <span>Razorpay — UPI, Google Pay, PhonePe, Cards, Net Banking</span>
              </div>
            </label>
            <label class="payment-option" id="payCOD" onclick="selectPayment('cod')">
              <input type="radio" name="payment" value="cod">
              <div class="payment-option-label">
                <strong>Cash on Delivery (COD)</strong>
                <span>Pay when you receive the product</span>
              </div>
            </label>
          </div>
        </div>

        <button class="btn btn-primary btn-lg" style="width:100%;margin-top:1.5rem;" id="placeOrderBtn" onclick="handlePlaceOrder()">
          Place Order — ₹${total}
        </button>
      </div>

      <div class="order-summary">
        <h3>Order Summary</h3>
        ${cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    return p ? `
            <div class="summary-item">
              <div class="summary-item-image"><img src="${p.image}" alt="${p.name}"></div>
              <div class="summary-item-info">
                <div class="summary-item-name">${p.name}</div>
                <div class="summary-item-qty">Qty: ${item.qty}</div>
              </div>
              <div class="summary-item-price">₹${p.price * item.qty}</div>
            </div>` : '';
  }).join('')}
        <div class="summary-divider"></div>
        <div class="summary-row"><span>Subtotal</span><span>₹${subtotal}</span></div>
        <div class="summary-row"><span>Shipping</span><span>${shipping === 0 ? '<span style="color:#22C55E;">FREE</span>' : '₹' + shipping}</span></div>
        <div class="summary-row total"><span>Total</span><span>₹${total}</span></div>
        <div class="payment-methods-info">
          <span class="pay-method">🏦 UPI</span>
          <span class="pay-method">💳 Cards</span>
          <span class="pay-method">📱 GPay</span>
          <span class="pay-method">📱 PhonePe</span>
          <span class="pay-method">💵 COD</span>
        </div>
      </div>
    </div>`;
}

function selectPayment(method) {
  selectedPayment = method;
  document.getElementById('payOnline').classList.toggle('selected', method === 'online');
  document.getElementById('payCOD').classList.toggle('selected', method === 'cod');
  document.querySelector('#payOnline input').checked = method === 'online';
  document.querySelector('#payCOD input').checked = method === 'cod';
}

// ===== FORM VALIDATION =====
function validateCheckoutForm() {
  const name = document.getElementById('custName').value.trim();
  const phone = document.getElementById('custPhone').value.trim();
  const address = document.getElementById('custAddress').value.trim();
  const city = document.getElementById('custCity').value.trim();
  const pincode = document.getElementById('custPincode').value.trim();
  const state = document.getElementById('custState').value;

  if (!name) { showToast('Please enter your name'); return null; }
  if (!phone || !/^\d{10}$/.test(phone)) { showToast('Enter a valid 10-digit phone number'); return null; }
  if (!address) { showToast('Please enter your address'); return null; }
  if (!city) { showToast('Please enter your city'); return null; }
  if (!pincode || !/^\d{6}$/.test(pincode)) { showToast('Enter a valid 6-digit pincode'); return null; }
  if (!state) { showToast('Please select your state'); return null; }

  return {
    name, phone, address, city, pincode, state,
    email: document.getElementById('custEmail').value.trim(),
    landmark: document.getElementById('custLandmark').value.trim()
  };
}

// ===== PLACE ORDER =====
function handlePlaceOrder() {
  const customer = validateCheckoutForm();
  if (!customer) return;

  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Processing...';

  if (selectedPayment === 'online') {
    initiateRazorpay(customer);
  } else {
    processOrder(customer, 'COD', 'cod_' + Date.now());
  }
}

// =============================================================================
// RAZORPAY PAYMENT
// =============================================================================
function initiateRazorpay(customer) {
  const total = getCartTotal();

  // Check if Razorpay SDK loaded
  if (typeof Razorpay === 'undefined') {
    showToast('Payment system loading... please try again in a moment');
    resetPlaceOrderBtn();
    return;
  }

  const options = {
    key: CONFIG.razorpayKeyId,
    amount: total * 100,     // paise
    currency: CONFIG.currency,
    name: CONFIG.businessName,
    description: `Order - ${cart.length} item(s)`,
    image: CONFIG.businessLogo,
    handler: function (response) {
      processOrder(customer, 'Razorpay', response.razorpay_payment_id);
    },
    prefill: {
      name: customer.name,
      email: customer.email,
      contact: customer.phone
    },
    notes: {
      address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`
    },
    theme: { color: '#F59E0B' },
    modal: {
      ondismiss: function () {
        resetPlaceOrderBtn();
        showToast('Payment cancelled');
      }
    }
  };

  try {
    const rzp = new Razorpay(options);
    rzp.on('payment.failed', function () {
      resetPlaceOrderBtn();
      showToast('Payment failed. Please try again.');
    });
    rzp.open();
  } catch (err) {
    resetPlaceOrderBtn();
    showToast('Payment error. Please try again.');
    console.error('Razorpay error:', err);
  }
}

function resetPlaceOrderBtn() {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) {
    btn.disabled = false;
    btn.innerHTML = `Place Order — ₹${getCartTotal()}`;
  }
}

// =============================================================================
// PROCESS ORDER → Save locally + Send to Google Sheets
// =============================================================================
function processOrder(customer, paymentMethod, paymentId) {
  const orderId = 'HG-' + Date.now().toString(36).toUpperCase();
  const subtotal = getCartSubtotal();
  const costTotal = getCartCost();
  const shipping = getShippingFee();
  const total = getCartTotal();
  const profit = subtotal - costTotal;

  const orderData = {
    orderId,
    date: new Date().toLocaleString('en-IN'),
    customer,
    paymentMethod,
    paymentId,
    items: cart.map(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      return {
        name: product.name,
        qty: item.qty,
        price: product.price,
        costPrice: product.costPrice,
        supplier: product.supplier,
        total: product.price * item.qty
      };
    }),
    subtotal,
    costTotal,
    profit,
    shipping,
    total
  };

  // 1. Send to Google Sheets (auto-updates your spreadsheet)
  sendToGoogleSheets(orderData);

  // 2. Save order locally as backup
  const orders = JSON.parse(localStorage.getItem('homeglow_orders') || '[]');
  orders.push(orderData);
  localStorage.setItem('homeglow_orders', JSON.stringify(orders));

  // 3. Clear cart
  cart = [];
  saveCart();
  updateCartUI();

  // 4. Show success
  showOrderSuccess(orderData);
}

// =============================================================================
// GOOGLE SHEETS INTEGRATION
// =============================================================================
function sendToGoogleSheets(order) {
  if (!CONFIG.googleSheetURL) {
    console.log('Google Sheets not configured. Order saved locally:', order);
    console.log('📋 Set CONFIG.googleSheetURL in app.js to enable auto-tracking.');
    return;
  }

  fetch(CONFIG.googleSheetURL, {
    method: 'POST',
    mode: 'no-cors',  // Google Apps Script requires this
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  })
    .then(() => console.log('✅ Order sent to Google Sheets:', order.orderId))
    .catch(err => {
      console.error('Failed to send to Sheets:', err);
      console.log('Order is saved locally as backup.');
    });
}

// ===== ORDER SUCCESS SCREEN =====
function showOrderSuccess(order) {
  const container = document.getElementById('checkoutContainer');
  container.innerHTML = `
    <div class="order-success">
      <div class="success-icon">🎉</div>
      <h2>Order Placed Successfully!</h2>
      <p style="color:var(--text-secondary);max-width:500px;margin:0 auto 1.5rem;">
        Thank you, <strong>${order.customer.name}</strong>! Your order has been received.
      </p>
      <div class="order-id">Order ID: ${order.orderId}</div>
      <div style="margin:1.5rem 0;padding:1.5rem;background:var(--bg-card);border-radius:var(--radius-lg);border:1px solid var(--border-subtle);max-width:450px;margin-left:auto;margin-right:auto;text-align:left;">
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
          <span style="color:var(--text-muted);">Items</span>
          <span>${order.items.length} product(s)</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
          <span style="color:var(--text-muted);">Total</span>
          <span style="font-weight:700;color:var(--color-primary);">₹${order.total}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;">
          <span style="color:var(--text-muted);">Payment</span>
          <span>${order.paymentMethod === 'COD' ? '💵 Cash on Delivery' : '✅ Paid Online'}</span>
        </div>
        <div style="display:flex;justify-content:space-between;">
          <span style="color:var(--text-muted);">Delivery</span>
          <span>3–7 business days</span>
        </div>
      </div>
      <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem;">
        📱 Updates will be sent to <strong>${order.customer.phone}</strong>
      </p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="closeCheckout(); window.scrollTo(0,0);">Continue Shopping</button>
        <a href="https://wa.me/${CONFIG.whatsappNumber}?text=Hi! I placed order %23${order.orderId}." target="_blank" class="btn btn-secondary">💬 Contact Support</a>
      </div>
    </div>`;
}

// ===== TOAST =====
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  document.getElementById('cartBtn').addEventListener('click', openCart);
  document.getElementById('cartClose').addEventListener('click', closeCart);
  document.getElementById('cartOverlay').addEventListener('click', closeCart);
  document.getElementById('clearCartBtn').addEventListener('click', clearCart);
  document.getElementById('proceedCheckoutBtn').addEventListener('click', openCheckout);

  document.getElementById('modalClose').addEventListener('click', closeProductModal);
  document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('productModal')) closeProductModal();
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;
      renderProducts(activeFilter);
    });
  });

  document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
      const cat = card.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.filter === cat);
      });
      activeFilter = cat;
      renderProducts(cat);
      document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    });
  });

  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navLinks = document.getElementById('navLinks');
  mobileBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    mobileBtn.classList.toggle('active');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      mobileBtn.classList.remove('active');
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeCart(); closeProductModal(); closeCheckout(); }
  });
}

// ===== HEADER SCROLL =====
function setupHeaderScroll() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ===== SCROLL REVEAL =====
function setupScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
