/**
 * LOVE BRANDS - PAYMENT CONFIRMATION PAGE
 * Shows order confirmation and prompts for partnership registration
 */

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Get order from localStorage
 */
function getOrderFromStorage() {
    const order = localStorage.getItem('lovebrands_current_order');
    return order ? JSON.parse(order) : null;
}

/**
 * Get customer info from localStorage
 */
function getCustomerInfo() {
    const info = localStorage.getItem('lovebrands_customer_info');
    return info ? JSON.parse(info) : null;
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

/**
 * Display order details
 */
function displayOrderDetails() {
    const order = getOrderFromStorage();
    const customerInfo = getCustomerInfo();

    // Try to get order from Shopify checkout or use localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');
    
    if (!order && !orderId) {
        // No order found, redirect to shop
        window.location.href = '/pages/shop-landing';
        return;
    }

    // Display order number
    const orderNumberEl = document.getElementById('order-number');
    if (orderNumberEl && order.orderNumber) {
        orderNumberEl.textContent = order.orderNumber;
    }

    // Display order total
    const orderTotalEl = document.getElementById('order-total');
    if (orderTotalEl && order.cart) {
        orderTotalEl.textContent = formatCurrency(order.cart.total);
    }

    // Display order items
    const orderItemsContainer = document.getElementById('order-items');
    if (orderItemsContainer && order.cart && order.cart.items) {
        orderItemsContainer.innerHTML = order.cart.items.map(item => {
            const itemType = item.type === 'package' ? 'Wholesale Package' : 'Add-on';
            return `
                <div class="order-item">
                    <div>
                        <div class="item-name">${item.name}</div>
                        <div class="item-type">${itemType}</div>
                    </div>
                    <div class="item-price">${formatCurrency(item.price)}</div>
                </div>
            `;
        }).join('');
    }

    // Display customer email
    const customerEmailEl = document.getElementById('customer-email');
    if (customerEmailEl && customerInfo && customerInfo.email) {
        customerEmailEl.textContent = customerInfo.email;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    const becomePartnerBtn = document.getElementById('become-partner-btn');

    if (becomePartnerBtn) {
        becomePartnerBtn.addEventListener('click', () => {
            // Add loading state
            becomePartnerBtn.disabled = true;
            becomePartnerBtn.innerHTML = `
                <span class="btn-icon">⏳</span>
                <span class="btn-text">Redirecting...</span>
            `;

            // Redirect after short delay
            setTimeout(() => {
                window.location.href = '/pages/partner-signup';
            }, 800);
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize payment confirmation page
 */
function init() {
    console.log('✅ Payment Confirmation - Initializing...');

    // Display order details
    displayOrderDetails();

    // Initialize event listeners
    initEventListeners();

    // Add entrance animations with delay
    setTimeout(() => {
        document.querySelector('.confirmation-content').classList.add('visible');
    }, 300);

    console.log('✅ Payment Confirmation - Ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
