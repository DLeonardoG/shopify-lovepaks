/**
 * LOVE BRANDS - UPSELL PAGE
 * Handles upsell offers and cart management
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const UpsellState = {
    cart: {
        items: [],
        total: 0,
        totalSavings: 0
    },
    addedUpsells: new Set()
};

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
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/**
 * Get cart from localStorage
 */
function getCartFromStorage() {
    const cart = localStorage.getItem('lovebrands_shop_cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    localStorage.setItem('lovebrands_shop_cart', JSON.stringify(UpsellState.cart));
}

// ============================================
// CART MANAGEMENT
// ============================================

/**
 * Load cart data (Shopify Cart API)
 */
async function loadCart() {
    try {
        const response = await fetch('/cart.js');
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const cart = await response.json();
        
        if (cart.item_count === 0) {
            // No cart found, redirect to shop
            window.location.href = '/pages/shop-landing';
            return false;
        }

        // Convert Shopify cart to our format
        UpsellState.cart = {
            items: cart.items.map(item => ({
                id: item.variant_id,
                name: item.product_title,
                price: item.price / 100, // Shopify returns in cents
                quantity: item.quantity
            })),
            total: cart.total_price / 100
        };
        
        return true;
    } catch (error) {
        console.error('Error loading cart:', error);
        window.location.href = '/pages/shop-landing';
        return false;
    }
}

/**
 * Add upsell to cart (Shopify Cart API)
 */
async function addUpsellToCart(variantId, upsellName) {
    try {
        // Use Shopify Cart API
        if (typeof addToCartShopify === 'function') {
            await addToCartShopify(variantId, 1);
            showToast(`${upsellName} added to cart!`, 'success');
            
            // Redirect to cart after a short delay
            setTimeout(() => {
                window.location.href = '/cart';
            }, 1500);
        } else {
            // Fallback: redirect to cart
            showToast('Adding to cart...', 'success');
            window.location.href = '/cart';
        }
    } catch (error) {
        console.error('Error adding upsell to cart:', error);
        showToast('Error adding product to cart', 'error');
    }
}

/**
 * Mark offer card as added
 */
function markOfferAsAdded(upsellId) {
    const offerCard = document.querySelector('.offer-card-simple');
    const button = document.querySelector('.add-upsell-btn');

    if (offerCard && button && button.getAttribute('data-id') === upsellId) {
        offerCard.classList.add('added');
        button.textContent = '✓ Added to Order';
        button.disabled = true;
        button.style.background = 'var(--accent-green)';
    }
}

// ============================================
// UI UPDATE
// ============================================

/**
 * Update order summary
 */
function updateOrderSummary() {
    const summaryItemsContainer = document.getElementById('summary-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const savingsRowEl = document.getElementById('savings-row');
    const totalSavingsEl = document.getElementById('total-savings');

    // Clear items
    summaryItemsContainer.innerHTML = '';

    // Add each item
    UpsellState.cart.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'summary-item';

        const label = item.type === 'package' ? 'Package' : 'Add-on';

        itemEl.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-label">${label}</div>
            </div>
            <div class="item-price">${formatCurrency(item.price)}</div>
        `;

        summaryItemsContainer.appendChild(itemEl);
    });

    // Update totals
    subtotalEl.textContent = formatCurrency(UpsellState.cart.total);
    totalEl.textContent = formatCurrency(UpsellState.cart.total);

    // Show savings if any
    if (UpsellState.cart.totalSavings && UpsellState.cart.totalSavings > 0) {
        savingsRowEl.style.display = 'flex';
        totalSavingsEl.textContent = formatCurrency(UpsellState.cart.totalSavings);
    } else {
        savingsRowEl.style.display = 'none';
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Add upsell buttons
    const addUpsellButtons = document.querySelectorAll('.add-upsell-btn');

    addUpsellButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const variantId = this.getAttribute('data-variant-id');
            const upsellName = this.getAttribute('data-name') || 'Product';
            
            if (!variantId) {
                showToast('Product variant ID not found. Please configure the product in Shopify.', 'error');
                return;
            }

            // Visual feedback
            const originalText = this.textContent;
            this.textContent = 'Adding...';
            this.disabled = true;

            try {
                await addUpsellToCart(variantId, upsellName);
            } catch (error) {
                // Reset button on error
                this.textContent = originalText;
                this.disabled = false;
            }
        });
    });

    // Skip upsell / No thanks button
    const skipBtn = document.getElementById('skip-upsell');
    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = '/cart';
        });
    }

    // When upsell is added, redirect to checkout
    // This will be handled by the addUpsellToCart function
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize upsell page
 */
async function init() {
    console.log('🎁 Upsell Page - Initializing...');

    // Load cart
    const cartLoaded = await loadCart();
    if (!cartLoaded) {
        return;
    }

    // Initialize event listeners
    initEventListeners();

    console.log('✅ Upsell Page - Ready!');
    console.log('Current cart:', UpsellState.cart);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
