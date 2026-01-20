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
            },
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
        const response = await fetch('/cart.js');
        if (!response.ok) {
            throw new Error('Failed to fetch cart');
        }
        
        const cart = await response.json();
        
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('mini-cart-items');
        
        if (cartCount) {
            cartCount.textContent = cart.item_count;
        }
        
        if (cartTotal) {
            cartTotal.textContent = formatMoney(cart.total_price);
        }
        
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
            },
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
            },
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
});

// Make functions globally available
window.addToCartShopify = addToCartShopify;
window.removeCartItem = removeCartItem;
window.updateCartQuantity = updateCartQuantity;
window.updateCartUI = updateCartUI;

