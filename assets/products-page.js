/**
 * PRODUCTS PAGE JAVASCRIPT
 * Handles subscription block and single product add to cart on products page
 */

(function() {
  'use strict';

  /**
   * Add subscription to cart
   */
  async function addSubscriptionToCart(productId, variantId, sellingPlanId) {
    if (!sellingPlanId) {
      console.error('Selling plan ID is required for subscription');
      showToast('Please select a subscription plan', 'error');
      return;
    }

    const button = document.getElementById('start-subscription-btn');
    if (button) {
      button.disabled = true;
      const originalText = button.textContent;
      button.textContent = 'Starting Subscription...';

      try {
        // Ensure variantId is a number
        const variantIdNum = typeof variantId === 'string' ? parseInt(variantId) : variantId;
        
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            items: [{
              id: variantIdNum,
              quantity: 1,
              selling_plan: sellingPlanId
            }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.description || 'Failed to add subscription to cart');
        }

        const data = await response.json();
        console.log('Subscription added to cart:', data);

        // Update cart UI
        if (window.updateCartUI) {
          await window.updateCartUI();
        }

        // Open cart drawer or redirect
        if (window.openCartDrawer) {
          window.openCartDrawer();
        } else {
          window.location.href = '/cart';
        }

        showToast('Subscription started! Save 20%', 'success');

      } catch (error) {
        console.error('Error adding subscription to cart:', error);
        showToast(error.message || 'Error starting subscription', 'error');
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    }
  }

  /**
   * Get selling plan ID for product
   */
  async function getSellingPlanId(productHandle) {
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
      
      // Get first selling plan group and plan
      if (product.selling_plan_groups && product.selling_plan_groups.length > 0) {
        const group = product.selling_plan_groups[0];
        if (group.selling_plans && group.selling_plans.length > 0) {
          return group.selling_plans[0].id;
        }
      }

      return null;
    } catch (error) {
      console.error(`Error fetching selling plan for ${productHandle}:`, error);
      return null;
    }
  }

  /**
   * Initialize subscription block
   */
  function initSubscriptionBlock() {
    const subscriptionBtn = document.getElementById('start-subscription-btn');
    if (!subscriptionBtn) return;

    const citrusProductId = subscriptionBtn.dataset.citrusProductId;
    const fragranceProductId = subscriptionBtn.dataset.fragranceProductId;
    const citrusVariantId = subscriptionBtn.dataset.citrusVariantId;
    const fragranceVariantId = subscriptionBtn.dataset.fragranceVariantId;

    // Handle formula selection
    const formulaRadios = document.querySelectorAll('input[name="subscription-formula"]');
    let selectedFormula = 'citrus'; // default

    formulaRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        selectedFormula = this.value;
      });
    });

    // Handle subscription button click
    subscriptionBtn.addEventListener('click', async function(e) {
      e.preventDefault();

      const productId = selectedFormula === 'citrus' ? citrusProductId : fragranceProductId;
      const variantId = selectedFormula === 'citrus' ? citrusVariantId : fragranceVariantId;
      const productHandle = selectedFormula === 'citrus' ? 'citrus-flower-blossom' : 'dye-scent-free';

      // Get selling plan ID
      const sellingPlanId = await getSellingPlanId(productHandle);
      
      if (!sellingPlanId) {
        showToast('Subscription plans not configured. Please contact support.', 'error');
        return;
      }

      await addSubscriptionToCart(productId, variantId, sellingPlanId);
    });
  }

  /**
   * Add single product to cart
   */
  async function addSingleProductToCart(productId, variantId) {
    const button = document.querySelector(`[data-product-id="${productId}"].btn-add-to-cart-single`);
    if (!button) return;

    button.disabled = true;
    const originalText = button.textContent;
    button.textContent = 'Adding...';

    try {
      // Use centralized addToCartShopify function if available
      if (window.addToCartShopify) {
        // Ensure variantId is a number
        const variantIdNum = typeof variantId === 'string' ? parseInt(variantId) : variantId;
        await window.addToCartShopify(variantIdNum, 1);
        
        // Open cart drawer
        if (window.openCartDrawer) {
          window.openCartDrawer();
        }
      } else {
        // Fallback to direct API call
        const variantIdNum = typeof variantId === 'string' ? parseInt(variantId) : variantId;
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            items: [{
              id: variantIdNum,
              quantity: 1
            }]
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ description: 'Failed to add product to cart' }));
          throw new Error(errorData.description || 'Failed to add product to cart');
        }

        const data = await response.json();
        console.log('Product added to cart:', data);

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

        showToast('Product added to cart!', 'success');
      }

    } catch (error) {
      console.error('Error adding product to cart:', error);
      showToast(error.message || 'Error adding product to cart', 'error');
    } finally {
      button.disabled = false;
      button.textContent = originalText;
    }
  }

  /**
   * Initialize single product add to cart buttons
   */
  function initSingleProductButtons() {
    document.querySelectorAll('.btn-add-to-cart-single').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();

        const productId = this.dataset.productId;
        const variantId = this.dataset.variantId;

        if (productId && variantId) {
          addSingleProductToCart(productId, variantId);
        }
      });
    });
  }

  /**
   * Smooth scroll to section
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
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
      max-width: 400px;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  /**
   * Initialize everything
   */
  function init() {
    initSubscriptionBlock();
    initSingleProductButtons();
    initSmoothScroll();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Make functions globally available
  window.addSubscriptionToCart = addSubscriptionToCart;
  window.addSingleProductToCart = addSingleProductToCart;

})();

