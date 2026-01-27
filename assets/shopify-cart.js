/**
 * LOVE BRANDS - SHOPIFY CART API
 * Reemplaza localStorage con Shopify Cart API
 */

// ============================================
// SHOPIFY CART API FUNCTIONS
// ============================================

/**
 * Add item to Shopify cart
 */
async function addToCartShopify(variantId, quantity = 1) {
    try {
        const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin', // Important for Shopify
            body: JSON.stringify({
                items: [{
                    id: variantId,
                    quantity: quantity
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add item to cart');
        }
        
        const data = await response.json();
        await updateCartUI();
        showToast('Product added to cart!', 'success');
        return data;
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding product to cart', 'error');
        throw error;
    }
}

/**
 * Update cart UI from Shopify
 */
async function updateCartUI() {
    try {
        const response = await fetch('/cart.js', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            },
            credentials: 'same-origin'
        });
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const cart = await response.json();
        
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
        if (cartDrawerBody) {
            if (cart.items.length === 0) {
                cartDrawerBody.innerHTML = `
                    <div class="empty-cart">
                        <h3>Your cart is empty</h3>
                        <p>But it doesn't have to be</p>
                        <a href="/collections/all" class="cta-btn">START SHOPPING</a>
                    </div>
                `;
            } else {
                const cartItemsHTML = cart.items.map((item, index) => `
                    <div class="cart-item" data-key="${item.key}" data-line="${index + 1}">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${escapeHtml(item.product_title)}" loading="lazy">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${escapeHtml(item.product_title)}</h4>
                            <p class="cart-item-variant">${escapeHtml(item.variant_title)}</p>
                            <div class="cart-item-price">${formatMoney(item.final_line_price)}</div>
                            <div class="cart-item-quantity">
                                <button type="button" class="qty-btn qty-minus" data-line="${index + 1}">−</button>
                                <input type="number" class="qty-input" value="${item.quantity}" min="1" data-line="${index + 1}" readonly>
                                <button type="button" class="qty-btn qty-plus" data-line="${index + 1}">+</button>
                            </div>
                            <button class="cart-item-remove" data-line="${index + 1}">Remove</button>
                        </div>
                    </div>
                `).join('');
                
                cartDrawerBody.innerHTML = `<div class="cart-items" id="cart-items">${cartItemsHTML}</div>`;
                
                // Re-attach event listeners
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
 */
async function removeCartItem(itemKey) {
    try {
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
            throw new Error('Failed to remove item');
        }
        
        await updateCartUI();
        showToast('Item removed from cart', 'success');
    } catch (error) {
        console.error('Error removing item:', error);
        showToast('Error removing item', 'error');
    }
}

/**
 * Update cart quantity
 */
async function updateCartQuantity(itemKey, quantity) {
    try {
        const response = await fetch('/cart/change.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                id: itemKey,
                quantity: quantity
            })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update quantity');
        }
        
        await updateCartUI();
    } catch (error) {
        console.error('Error updating quantity:', error);
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
 * Attach event listeners to cart drawer
 */
function attachCartDrawerListeners() {
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
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Open cart drawer if function exists
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

