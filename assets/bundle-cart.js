/**
 * BUNDLE CART JAVASCRIPT
 * Handles adding bundles to cart
 * Supports: Try Both, Citrus 3-Month, Fragrance-Free 3-Month
 */

(function() {
  'use strict';

  // Bundle configurations
  const BUNDLE_CONFIG = {
    'try-both': {
      products: ['citrus-flower-blossom', 'dye-scent-free'],
      quantities: [1, 1],
      discount: 10, // 10% off
      discountCode: 'TRYBOTH10', // Optional: discount code to apply
      freeShipping: false
    },
    'citrus-3month': {
      products: ['citrus-flower-blossom'],
      quantities: [3],
      discount: 15, // 15% off
      discountCode: 'CITRUS3MONTH15', // Optional: discount code to apply
      freeShipping: true
    },
    'fragrance-3month': {
      products: ['dye-scent-free'],
      quantities: [3],
      discount: 15, // 15% off
      discountCode: 'FRAGRANCE3MONTH15', // Optional: discount code to apply
      freeShipping: true
    }
  };

  /**
   * Get product variant ID by handle
   */
  async function getProductVariantId(productHandle) {
    try {
      const response = await fetch(`/products/${productHandle}.js`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch product: ${productHandle}`);
      }

      const product = await response.json();
      // Get first available variant
      const variant = product.variants.find(v => v.available) || product.variants[0];
      return variant ? variant.id : null;
    } catch (error) {
      console.error(`Error fetching product ${productHandle}:`, error);
      return null;
    }
  }

  /**
   * Add bundle to cart
   */
  async function addBundleToCart(bundleType) {
    const config = BUNDLE_CONFIG[bundleType];
    if (!config) {
      console.error(`Unknown bundle type: ${bundleType}`);
      showToast('Error: Unknown bundle type', 'error');
      return;
    }

    const button = document.querySelector(`[data-bundle-type="${bundleType}"]`);
    if (button) {
      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'Adding...';
      
      try {
        // Get variant IDs for all products in bundle
        const variantIds = [];
        for (let i = 0; i < config.products.length; i++) {
          const productHandle = config.products[i];
          const variantId = await getProductVariantId(productHandle);
          
          if (!variantId) {
            throw new Error(`Could not find variant for product: ${productHandle}`);
          }
          
          // Add quantity times
          for (let qty = 0; qty < config.quantities[i]; qty++) {
            variantIds.push(variantId);
          }
        }

        // Add all items to cart
        const items = variantIds.map(id => ({
          id: id,
          quantity: 1
        }));

        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({ items: items })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.description || 'Failed to add bundle to cart');
        }

        const data = await response.json();
        console.log('Bundle added to cart:', data);

        // Apply discount code if available
        if (config.discountCode) {
          // Note: Discount codes need to be applied via checkout or discount API
          // For now, we'll store it in sessionStorage to apply later
          sessionStorage.setItem('pending_discount_code', config.discountCode);
        }

        // Update cart UI
        if (window.updateCartUI) {
          await window.updateCartUI();
        }

        // Open cart drawer
        if (window.openCartDrawer) {
          window.openCartDrawer();
        } else {
          window.location.href = '/cart';
        }

        // Show success message
        const savingsText = config.discount ? `Save ${config.discount}%` : '';
        const shippingText = config.freeShipping ? ' + Free Shipping' : '';
        showToast(`Bundle added to cart! ${savingsText}${shippingText}`, 'success');

      } catch (error) {
        console.error('Error adding bundle to cart:', error);
        showToast(error.message || 'Error adding bundle to cart', 'error');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    }
  }

  /**
   * Initialize bundle buttons
   */
  function initBundleButtons() {
    document.querySelectorAll('.btn-add-bundle').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const bundleType = this.dataset.bundleType;
        if (bundleType) {
          addBundleToCart(bundleType);
        }
      });
    });
  }

  /**
   * Show toast notification
   */
  function showToast(message, type = 'info') {
    if (window.showToast) {
      window.showToast(message, type);
      return;
    }

    // Fallback toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
      color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      z-index: 10000;
      font-weight: 500;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBundleButtons);
  } else {
    initBundleButtons();
  }

  // Make function globally available
  window.addBundleToCart = addBundleToCart;

})();

