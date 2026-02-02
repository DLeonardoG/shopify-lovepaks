/**
 * LOVE BRANDS - SHOPIFY CART API
 * Reemplaza localStorage con Shopify Cart API
 */

// ============================================
// SHOPIFY CART API FUNCTIONS
// ============================================

/**
 * Add item to Shopify cart
 * Uses the correct format and ensures the item is saved properly
 */
async function addToCartShopify(variantId, quantity = 1) {
    try {
        // Ensure variantId is a number
        const variantIdNum = typeof variantId === 'string' ? parseInt(variantId) : variantId;
        
        if (!variantIdNum || isNaN(variantIdNum)) {
            throw new Error('Invalid variant ID');
        }
        
        if (!quantity || quantity < 1) {
            quantity = 1;
        }
        
        console.log('Adding to cart - Variant ID:', variantIdNum, 'Quantity:', quantity);
        
        // Try new format first (items array) - more reliable
        let response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                items: [{
                    id: variantIdNum,
                    quantity: quantity
                }]
            })
        });
        
        // If new format fails, try old format for compatibility
        if (!response.ok) {
            console.log('New format failed, trying old format...');
            response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    id: variantIdNum,
                    quantity: quantity
                })
            });
        }
        
        if (!response.ok) {
            // Try to get error details
            let errorMessage = 'Failed to add item to cart';
            try {
                const errorData = await response.json();
                errorMessage = errorData.description || errorData.message || errorMessage;
            } catch (e) {
                // If response is not JSON, use status text
                errorMessage = response.statusText || errorMessage;
            }
            
            console.error('Cart API error:', response.status, errorMessage);
            throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('Product added to cart successfully:', data);
        
        // Small delay to ensure Shopify has saved the cart
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Verify the item was added by fetching cart
        const verifyResponse = await fetch('/cart.js', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (verifyResponse.ok) {
            const cart = await verifyResponse.json();
            console.log('Cart verified - Item count:', cart.item_count);
            
            // Update cart UI with verified data
            await updateCartUI();
            
            // Show success message
            showToast('Product added to cart!', 'success');
            
            return data;
        } else {
            // Even if verification fails, the item was added
            console.warn('Could not verify cart, but item was added');
            await updateCartUI();
            showToast('Product added to cart!', 'success');
            return data;
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        const errorMessage = error.message || 'Error adding product to cart';
        showToast(errorMessage, 'error');
        throw error;
    }
}

/**
 * Update cart UI from Shopify
 * Fetches the latest cart data and updates all UI elements
 */
async function updateCartUI() {
    try {
        // Add a small delay to ensure Shopify has updated the cart
        await new Promise(resolve => setTimeout(resolve, 50));
        
        const response = await fetch('/cart.js', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            credentials: 'same-origin',
            cache: 'no-store'
        });
        
        if (!response.ok) {
            console.error('Failed to fetch cart:', response.status, response.statusText);
            throw new Error('Failed to fetch cart');
        }
        
        const cart = await response.json();
        console.log('Cart updated - Items:', cart.item_count, 'Total:', cart.total_price);
        
        const cartCount = document.getElementById('cart-count');
        const headerCartCount = document.getElementById('header-cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('mini-cart-items');
        const cartDrawerBody = document.getElementById('cart-drawer-body');
        
        // Update cart count in header and drawer
        if (cartCount) {
            cartCount.textContent = cart.item_count;
            cartCount.style.display = cart.item_count > 0 ? 'flex' : 'none';
        }
        if (headerCartCount) {
            headerCartCount.textContent = cart.item_count;
            headerCartCount.style.display = cart.item_count > 0 ? 'flex' : 'none';
        } else {
            // If badge doesn't exist but cart has items, create it
            const cartButton = document.getElementById('nav-cart-btn');
            if (cartButton && cart.item_count > 0) {
                let badge = cartButton.querySelector('.cart-count-badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-count-badge';
                    badge.id = 'header-cart-count';
                    cartButton.appendChild(badge);
                }
                badge.textContent = cart.item_count;
                badge.style.display = 'flex';
            }
        }
        
        // Update cart total
        if (cartTotal) {
            cartTotal.textContent = formatMoney(cart.total_price);
        }
        
        // Update cart items in drawer
        if (cartItems) {
            if (cart.items.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Your cart is empty</p>';
            } else {
                cartItems.innerHTML = cart.items.map(item => `
                    <div class="mini-cart-item" data-key="${item.key}">
                        <div class="mini-cart-item-details">
                            <div class="mini-cart-item-name">${escapeHtml(item.product_title)}</div>
                            <div class="mini-cart-item-price">${formatMoney(item.price)} × ${item.quantity}</div>
                        </div>
                        <button class="mini-cart-item-remove" onclick="removeCartItem('${item.key}')" aria-label="Remove item">
                            ×
                        </button>
                    </div>
                `).join('');
            }
        }
        
        // Update cart drawer body (new enhanced drawer)
        const cartDrawerFooter = document.getElementById('cart-drawer-footer');
        if (cartDrawerBody) {
            if (cart.items.length === 0) {
                cartDrawerBody.innerHTML = `
                    <div class="empty-cart">
                        <h3>Your cart is empty</h3>
                        <p>But it doesn't have to be</p>
                        <a href="/collections/all" class="cta-btn">START SHOPPING</a>
                    </div>
                `;
                if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
            } else {
                if (cartDrawerFooter) cartDrawerFooter.style.display = '';
                const FREE_SHIPPING_THRESHOLD = 7500; // $75
                const cartItemsHTML = cart.items.map((item, index) => {
                    const spa = item.selling_plan_allocation;
                    const planName = spa && spa.selling_plan ? escapeHtml(spa.selling_plan.name) : '';
                    const planPrice = spa && (typeof spa.price === 'number') ? formatMoney(spa.price) : '';
                    const subscriptionHtml = planName
                        ? `<p class="selling-plan cart-item-subscription"><span class="subscription-badge">Subscription</span> ${planName}</p>${planPrice ? `<p class="cart__product-meta cart-item-subscription-price">${planPrice}</p>` : ''}`
                        : '';
                    return `
                    <div class="cart-item" data-key="${item.key}" data-line="${index + 1}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${escapeHtml(item.product_title)}" loading="lazy">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${escapeHtml(item.product_title)}</h4>
                            <p class="cart-item-variant">${escapeHtml(item.variant_title)}</p>
                            ${subscriptionHtml}
                            <div class="cart-item-price">${formatMoney(item.final_line_price)}</div>
                            <div class="cart-item-quantity">
                                <button type="button" class="qty-btn qty-minus" data-line="${index + 1}">−</button>
                                <input type="number" class="qty-input" value="${item.quantity}" min="1" data-line="${index + 1}" readonly>
                                <button type="button" class="qty-btn qty-plus" data-line="${index + 1}">+</button>
                            </div>
                            <button class="cart-item-remove" data-line="${index + 1}">Remove</button>
                        </div>
                    </div>
                `;
                }).join('');
                
                cartDrawerBody.innerHTML = `<div class="cart-items" id="cart-items">${cartItemsHTML}</div>`;
                
                // Update shipping threshold: FREE shipping on orders $75+
                const shippingBar = document.getElementById('cart-shipping-bar');
                const shippingMessage = document.getElementById('cart-shipping-message');
                const shippingProgressBar = document.getElementById('cart-shipping-progress-bar');
                const freeShippingMsg = document.getElementById('cart-free-shipping-msg');
                const totalPrice = cart.total_price;
                if (shippingBar && freeShippingMsg) {
                    if (totalPrice < FREE_SHIPPING_THRESHOLD) {
                        shippingBar.style.display = '';
                        freeShippingMsg.style.display = 'none';
                        const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;
                        if (shippingMessage) shippingMessage.textContent = `Add ${formatMoney(remaining)} for FREE shipping!`;
                        if (shippingProgressBar) {
                            const progress = Math.min(100, Math.round((totalPrice * 100) / FREE_SHIPPING_THRESHOLD));
                            shippingProgressBar.style.width = progress + '%';
                        }
                    } else {
                        shippingBar.style.display = 'none';
                        freeShippingMsg.style.display = '';
                    }
                }
                
                attachCartDrawerListeners();
            }
        }
        
        return cart;
    } catch (error) {
        console.error('Error updating cart UI:', error);
    }
}

/**
 * Remove item from cart
 * Ensures the item is properly removed from Shopify cart
 */
async function removeCartItem(itemKey) {
    try {
        console.log('Removing item from cart:', itemKey);
        
        const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                id: itemKey,
                quantity: 0
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.description || 'Failed to remove item');
        }
        
        const data = await response.json();
        console.log('Item removed successfully:', data);
        
        // Small delay to ensure Shopify has updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update cart UI
        await updateCartUI();
        showToast('Item removed from cart', 'success');
    } catch (error) {
        console.error('Error removing item:', error);
        showToast(error.message || 'Error removing item', 'error');
    }
}

/**
 * Update cart quantity
 * Ensures the quantity is properly updated in Shopify cart
 */
async function updateCartQuantity(itemKey, quantity) {
    try {
        // Ensure quantity is a valid number
        const qty = parseInt(quantity) || 1;
        if (qty < 1) {
            throw new Error('Quantity must be at least 1');
        }
        
        console.log('Updating cart quantity - Key:', itemKey, 'Quantity:', qty);
        
        const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                id: itemKey,
                quantity: qty
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.description || 'Failed to update quantity');
        }
        
        const data = await response.json();
        console.log('Quantity updated successfully:', data);
        
        // Small delay to ensure Shopify has updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update cart UI
        await updateCartUI();
    } catch (error) {
        console.error('Error updating quantity:', error);
        showToast(error.message || 'Error updating quantity', 'error');
        throw error;
    }
}

/**
 * Show toast notification (fallback if not available from theme.js)
 */
function showToast(message, type = 'success') {
    if (window.showToast) {
        window.showToast(message, type);
        return;
    }
    
    // Fallback toast implementation
    const toast = document.getElementById('toast');
    if (toast) {
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    } else {
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
}

/**
 * Format money (Shopify returns prices in cents)
 */
function formatMoney(cents) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(cents / 100);
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Handle checkout button click
 * Ensures cart is synced and redirects to Shopify checkout
 */
async function handleCheckout() {
    try {
        console.log('Checkout button clicked - Verifying cart...');
        
        // First, update cart UI to get latest data
        await updateCartUI();
        
        // Verify cart has items
        const response = await fetch('/cart.js', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });
        
        if (!response.ok) {
            throw new Error('Failed to verify cart');
        }
        
        const cart = await response.json();
        
        if (cart.item_count === 0) {
            showToast('Your cart is empty. Add items before checkout.', 'error');
            return;
        }
        
        console.log('Cart verified - Items:', cart.item_count, 'Redirecting to checkout...');
        
        // Close cart drawer
        if (window.closeCartDrawer) {
            window.closeCartDrawer();
        }
        
        // Small delay to ensure drawer closes
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Redirect to Shopify checkout (GET request, not POST)
        window.location.href = '/checkout';
        
    } catch (error) {
        console.error('Error during checkout:', error);
        showToast('Error preparing checkout. Please try again.', 'error');
    }
}

/**
 * Attach event listeners to cart drawer
 */
function attachCartDrawerListeners() {
    // Checkout button
    const checkoutBtn = document.getElementById('cart-checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
    
    // Quantity controls
    document.querySelectorAll('.cart-item .qty-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const line = parseInt(this.dataset.line);
            const isPlus = this.classList.contains('qty-plus');
            const qtyInput = this.parentElement.querySelector('.qty-input');
            const currentQty = parseInt(qtyInput.value) || 1;
            const newQty = isPlus ? currentQty + 1 : Math.max(1, currentQty - 1);
            
            const cartItem = this.closest('.cart-item');
            const itemKey = cartItem.dataset.key;
            
            if (window.updateCartQuantity) {
                await window.updateCartQuantity(itemKey, newQty);
                await updateCartUI();
            }
        });
    });
    
    // Remove item buttons
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', async function() {
            const cartItem = this.closest('.cart-item');
            const itemKey = cartItem.dataset.key;
            
            if (window.removeCartItem) {
                await window.removeCartItem(itemKey);
                await updateCartUI();
            }
        });
    });
}

/**
 * Initialize cart on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
    await updateCartUI();
    
    // Update cart when page becomes visible (in case cart was updated in another tab)
    document.addEventListener('visibilitychange', async () => {
        if (!document.hidden) {
            await updateCartUI();
        }
    });
    
    // Attach listeners to initial cart items
    attachCartDrawerListeners();
    
    // Handle cart button click to open drawer instead of navigating
    const cartButton = document.getElementById('nav-cart-btn');
    if (cartButton) {
        cartButton.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Check if cart is empty
            try {
                const response = await fetch('/cart.js', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    },
                    credentials: 'same-origin'
                });
                
                if (response.ok) {
                    const cart = await response.json();
                    
                    // If cart is empty, redirect to catalog
                    if (cart.item_count === 0) {
                        window.location.href = '/pages/catalog';
                        return;
                    }
                }
            } catch (error) {
                console.error('Error checking cart:', error);
            }
            
            // If cart has items, open cart drawer
            if (window.openCartDrawer) {
                window.openCartDrawer();
            } else {
                // Fallback: navigate to cart page
                window.location.href = '/cart';
            }
        });
    }
});

// Make functions globally available
window.addToCartShopify = addToCartShopify;
window.removeCartItem = removeCartItem;
window.updateCartQuantity = updateCartQuantity;
window.updateCartUI = updateCartUI;
window.attachCartDrawerListeners = attachCartDrawerListeners;
window.handleCheckout = handleCheckout;

