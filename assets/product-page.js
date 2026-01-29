/**
 * PRODUCT PAGE JAVASCRIPT
 * Handles variant selection, price updates, image changes, and AJAX add to cart
 * Based on trycreate.co functionality
 */

(function() {
  'use strict';

  // Get product data from JSON
  let productData, product;
  try {
    const jsonElement = document.getElementById('product-variants-json');
    if (!jsonElement) {
      console.error('Product variants JSON not found');
      return;
    }
    productData = JSON.parse(jsonElement.textContent);
    product = productData.product;
  } catch (error) {
    console.error('Error parsing product data:', error);
    return;
  }
  
  // State
  const state = {
    selectedOptions: {},
    currentVariant: null,
    quantity: 1
  };

  // Initialize selected options from current variant
  function initSelectedOptions() {
    const variantIdInput = document.getElementById('product-variant-id');
    if (!variantIdInput) {
      console.error('Variant ID input not found');
      return;
    }
    
    const variantId = parseInt(variantIdInput.value);
    const currentVariant = product.variants.find(v => v.id === variantId);
    
    if (currentVariant) {
      state.selectedOptions = {
        option1: currentVariant.option1 || '',
        option2: currentVariant.option2 || '',
        option3: currentVariant.option3 || ''
      };
      state.currentVariant = currentVariant;
      console.log('Initialized variant:', currentVariant);
    } else {
      // Fallback: use first available variant
      const firstAvailable = product.variants.find(v => v.available) || product.variants[0];
      if (firstAvailable) {
        state.selectedOptions = {
          option1: firstAvailable.option1 || '',
          option2: firstAvailable.option2 || '',
          option3: firstAvailable.option3 || ''
        };
        state.currentVariant = firstAvailable;
        variantIdInput.value = firstAvailable.id;
        console.log('Using fallback variant:', firstAvailable);
      }
    }
  }

  // Find variant based on selected options
  function findVariant() {
    return product.variants.find(variant => {
      return (
        (!state.selectedOptions.option1 || variant.option1 === state.selectedOptions.option1) &&
        (!state.selectedOptions.option2 || variant.option2 === state.selectedOptions.option2) &&
        (!state.selectedOptions.option3 || variant.option3 === state.selectedOptions.option3)
      );
    });
  }

  // Update variant when options change
  function updateVariant() {
    const variant = findVariant();
    
    if (!variant) {
      console.warn('Variant not found for selected options');
      return;
    }

    state.currentVariant = variant;
    
    // Update hidden input
    document.getElementById('product-variant-id').value = variant.id;
    
    // Update price
    updatePrice(variant);
    
    // Update image
    updateImage(variant);
    
    // Update availability
    updateAvailability(variant);
    
    // Update variant description
    updateVariantDescription(variant);
    
    // Update URL without reload
    updateURL(variant);
  }

  // Update price display
  function updatePrice(variant) {
    const priceEl = document.getElementById('product-price');
    const comparePriceEl = document.getElementById('product-compare-price');
    const pricePerDayEl = document.getElementById('price-per-day');
    
    if (priceEl) {
      priceEl.textContent = formatMoney(variant.price);
    }
    
    if (comparePriceEl) {
      if (variant.compare_at_price > variant.price) {
        comparePriceEl.textContent = formatMoney(variant.compare_at_price);
        comparePriceEl.style.display = 'inline';
      } else {
        comparePriceEl.style.display = 'none';
      }
    }
    
    // Update price per day if applicable
    if (pricePerDayEl && variant.title) {
      const title = variant.title.toLowerCase();
      let days = 30; // default
      
      if (title.includes('90') || title.includes('3 month')) days = 90;
      else if (title.includes('60') || title.includes('2 month')) days = 60;
      else if (title.includes('30') || title.includes('1 month')) days = 30;
      
      const pricePerDay = variant.price / days / 100;
      pricePerDayEl.textContent = `As low as ${formatMoney(pricePerDay * 100)}/day`;
    }

  }

  // Update main product image
  function updateImage(variant) {
    const mainImage = document.getElementById('product-main-image');
    if (mainImage && variant.image) {
      mainImage.src = variant.image;
      mainImage.alt = variant.title || 'Product image';
    }
  }

  // Update availability status
  function updateAvailability(variant) {
    const stockStatus = document.getElementById('stock-status');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (stockStatus) {
      if (variant.available) {
        stockStatus.innerHTML = '<span class="in-stock">In Stock</span>';
      } else {
        stockStatus.innerHTML = '<span class="out-of-stock">Sold Out</span>';
      }
    }
    
    if (addToCartBtn) {
      const btnText = addToCartBtn.querySelector('.btn-text');
      
      if (variant.available) {
        addToCartBtn.disabled = false;
        addToCartBtn.classList.remove('disabled');
        addToCartBtn.removeAttribute('disabled');
        if (btnText) btnText.textContent = 'Add to cart';
      } else {
        addToCartBtn.disabled = true;
        addToCartBtn.classList.add('disabled');
        addToCartBtn.setAttribute('disabled', 'disabled');
        if (btnText) btnText.textContent = 'Sold Out';
      }
    }
  }

  // Update variant description
  function updateVariantDescription(variant) {
    const descEl = document.getElementById('variant-description');
    if (descEl) {
      descEl.textContent = variant.title;
    }
  }

  // Update URL without page reload
  function updateURL(variant) {
    const url = new URL(window.location);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);
  }

  // Format money (Shopify prices are in cents)
  function formatMoney(cents) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(cents / 100);
  }

  // Handle variant selector clicks
  function initVariantSelectors() {
    // Flavor swatches
    document.querySelectorAll('.flavor-swatch').forEach(btn => {
      btn.addEventListener('click', function() {
        const optionName = this.dataset.optionName;
        const optionValue = this.dataset.optionValue;
        
        // Update selected state
        document.querySelectorAll('.flavor-swatch').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update state
        state.selectedOptions.option1 = optionValue;
        updateVariant();
      });
    });

    // Size buttons
    document.querySelectorAll('.size-button').forEach(btn => {
      btn.addEventListener('click', function() {
        const optionName = this.dataset.optionName;
        const optionValue = this.dataset.optionValue;
        
        // Update selected state
        document.querySelectorAll('.size-button').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        
        // Update state
        state.selectedOptions.option2 = optionValue;
        updateVariant();
      });
    });

    // Default select dropdowns
    document.querySelectorAll('.variant-select').forEach(select => {
      select.addEventListener('change', function() {
        const optionName = this.dataset.optionName;
        const optionValue = this.value;
        
        // Determine which option position
        const position = parseInt(this.dataset.optionPosition);
        if (position === 1) state.selectedOptions.option1 = optionValue;
        else if (position === 2) state.selectedOptions.option2 = optionValue;
        else if (position === 3) state.selectedOptions.option3 = optionValue;
        
        updateVariant();
      });
    });
  }

  // Handle quantity controls
  function initQuantityControls() {
    const qtyInput = document.getElementById('quantity');
    const qtyMinus = document.querySelector('.qty-minus');
    const qtyPlus = document.querySelector('.qty-plus');
    
    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        const current = parseInt(qtyInput.value) || 1;
        if (current > 1) {
          qtyInput.value = current - 1;
          state.quantity = qtyInput.value;
        }
      });
    }
    
    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        const current = parseInt(qtyInput.value) || 1;
        qtyInput.value = current + 1;
        state.quantity = qtyInput.value;
      });
    }
    
    if (qtyInput) {
      qtyInput.addEventListener('change', function() {
        const value = parseInt(this.value) || 1;
        if (value < 1) {
          this.value = 1;
        }
        state.quantity = this.value;
      });
    }
  }

  // Handle subscription toggle (checkbox + details; widget nativo o inyectado por app)
  function initSubscriptionToggle() {
    const subscriptionToggle = document.getElementById('subscription-toggle');
    const subscriptionDetails = document.getElementById('subscription-details');
    if (subscriptionToggle && subscriptionDetails) {
      subscriptionToggle.addEventListener('change', function() {
        subscriptionDetails.style.display = this.checked ? 'block' : 'none';
      });
    }
  }

  // Check if we're in a Shopify environment
  function isShopifyEnvironment() {
    // Check if we're on a Shopify domain
    const hostname = window.location.hostname;
    const isShopifyDomain = hostname.includes('myshopify.com') || 
                           hostname.includes('shopify.com') ||
                           hostname.includes('shopifycdn.com');
    
    // Check if Shopify theme object exists
    const hasShopifyTheme = typeof window.Shopify !== 'undefined' || 
                           typeof window.theme !== 'undefined';
    
    // Check if we're NOT on localhost (local dev server)
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' || 
                       hostname.startsWith('192.168.') ||
                       hostname.startsWith('10.') ||
                       hostname === '[::1]';
    
    // We're in Shopify environment if:
    // 1. We're on a Shopify domain, OR
    // 2. We have Shopify theme objects AND we're not on localhost
    return isShopifyDomain || (hasShopifyTheme && !isLocalhost);
  }

  // Handle add to cart (AJAX)
  function initAddToCart() {
    const form = document.getElementById('product-form');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    
    if (!form) {
      console.error('Product form not found');
      return;
    }
    
    if (!addToCartBtn) {
      console.error('Add to cart button not found');
      return;
    }
    
    // Handle form submit - Use AJAX first, fallback to traditional submit
    form.addEventListener('submit', async function(e) {
      // Always prevent default first, we'll handle submission
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      
      console.log('Form submit event captured');
      
      const btnText = addToCartBtn.querySelector('.btn-text');
      const btnLoader = addToCartBtn.querySelector('.btn-loader');
      
      console.log('Form submit triggered');
      
      // Get current variant ID from hidden input (fallback if state is not set)
      const variantIdInput = document.getElementById('product-variant-id');
      const variantId = variantIdInput ? parseInt(variantIdInput.value) : null;
      
      console.log('Variant ID from input:', variantId);
      console.log('Current variant from state:', state.currentVariant);
      
      // Use state.currentVariant or find variant by ID
      let variant = state.currentVariant;
      if (!variant && variantId) {
        variant = product.variants.find(v => v.id === variantId);
        console.log('Found variant by ID:', variant);
      }
      
      // If still no variant, use first available
      if (!variant) {
        variant = product.variants.find(v => v.available) || product.variants[0];
        console.log('Using first available variant:', variant);
      }
      
      if (!variant) {
        console.error('No variant found at all');
        alert('Error: No product variant found. Please refresh the page.');
        return;
      }
      
      if (!variant.available) {
        console.warn('Variant is not available');
        if (window.showToast) {
          window.showToast('This variant is sold out', 'error');
        }
        return;
      }
      
      // Show loading state
      addToCartBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoader) btnLoader.style.display = 'flex';
      
      // Declare ajaxSuccess outside try block so it's available in finally
      let ajaxSuccess = false;
      
      // Check if we're in a Shopify environment
      const inShopifyEnv = isShopifyEnvironment();
      console.log('Shopify environment detected:', inShopifyEnv);
      console.log('Current hostname:', window.location.hostname);
      
      try {
        // Get quantity
        const quantityInput = document.getElementById('quantity');
        const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;
        
        // Get selling plan if subscription is selected (select o input que inyecte la app)
        const sellingPlanSelect = document.getElementById('selling-plan-select');
        const sellingPlanInput = document.getElementById('selling-plan-id');
        const sellingPlanId = (sellingPlanSelect && sellingPlanSelect.value) || (sellingPlanInput && sellingPlanInput.value) || null;
        
        // Update form inputs to ensure they have correct values
        if (variantIdInput) variantIdInput.value = variant.id;
        if (quantityInput) quantityInput.value = quantity;
        
        // Use centralized addToCartShopify function if available
        if (inShopifyEnv && window.addToCartShopify) {
          try {
            // Ensure variant ID is a number
            const variantIdNum = typeof variant.id === 'string' ? parseInt(variant.id) : variant.id;
            
            console.log('Using addToCartShopify with variant:', variantIdNum, 'quantity:', quantity);
            
            // For subscriptions, we need to use a different approach
            if (sellingPlanId) {
              // Use direct API call for subscriptions
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
                    quantity: quantity,
                    selling_plan: sellingPlanId
                  }]
                })
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log('Subscription added to cart:', data);
                ajaxSuccess = true;
                
                // Update cart UI
                if (window.updateCartUI) {
                  await window.updateCartUI();
                }
                
                // Open cart drawer
                if (window.openCartDrawer) {
                  window.openCartDrawer();
                }
                
                // Show success message
                if (window.showToast) {
                  window.showToast('Subscription added to cart!', 'success');
                }
              } else {
                const errorData = await response.json().catch(() => ({ description: 'Failed to add subscription' }));
                throw new Error(errorData.description || 'Failed to add subscription');
              }
            } else {
              // Use centralized function for regular products
              await window.addToCartShopify(variantIdNum, quantity);
              ajaxSuccess = true;
              
              // Open cart drawer
              if (window.openCartDrawer) {
                window.openCartDrawer();
              }
            }
          } catch (ajaxError) {
            console.error('Error adding to cart:', ajaxError);
            
            // Show error message
            if (window.showToast) {
              window.showToast(ajaxError.message || 'Error adding product to cart', 'error');
            }
            
            // Reset button
            addToCartBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
            
            return; // Don't try form submit, show error instead
          }
        } else {
          // Not in Shopify environment or function not available, skip AJAX
          console.log('Not in Shopify environment or addToCartShopify not available, using form submit');
          ajaxSuccess = false;
        }
        
        // If AJAX didn't work, use traditional form submit
        if (!ajaxSuccess) {
          console.log('AJAX failed or skipped, using traditional form submit...');
          
          // If we're in local development, show a helpful message
          if (!inShopifyEnv) {
            console.warn('Running in local development environment. Form submission may not work.');
            console.warn('To test cart functionality, please use Shopify theme preview or deploy to Shopify.');
            
            // Reset button
            addToCartBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
            
            // Show helpful message
            const localDevMsg = 'You are running in local development mode.\n\n' +
                              'The cart functionality requires a Shopify environment.\n\n' +
                              'To test this feature:\n' +
                              '1. Use Shopify Theme Preview, or\n' +
                              '2. Deploy the theme to your Shopify store\n\n' +
                              'The form will still attempt to submit, but it may not work locally.';
            
            if (window.showToast) {
              window.showToast('Cart requires Shopify environment. See console for details.', 'info');
            } else {
              console.info(localDevMsg);
            }
          }
          
          // Update form inputs to ensure correct values
          if (variantIdInput) variantIdInput.value = variant.id;
          if (quantityInput) quantityInput.value = quantity;
          
          // Add selling plan if needed
          if (sellingPlanId) {
            let spInput = form.querySelector('input[name="selling_plan"]');
            if (!spInput) {
              spInput = document.createElement('input');
              spInput.type = 'hidden';
              spInput.name = 'selling_plan';
              form.appendChild(spInput);
            }
            spInput.value = sellingPlanId;
          }
          
          // Ensure form is configured correctly
          form.action = '/cart/add';
          form.method = 'POST';
          form.enctype = 'multipart/form-data';
          
          // For form submit, update inputs and allow natural submission
          console.log('Using form submit fallback...');
          console.log('Variant ID for form:', variant.id);
          console.log('Quantity for form:', quantity);
          
          // Update form inputs
          if (variantIdInput) {
            variantIdInput.value = variant.id;
            console.log('Updated variant ID input to:', variantIdInput.value);
          }
          if (quantityInput) {
            quantityInput.value = quantity;
            console.log('Updated quantity input to:', quantityInput.value);
          }
          
          // Add selling plan if needed
          if (sellingPlanId) {
            let spInput = form.querySelector('input[name="selling_plan"]');
            if (!spInput) {
              spInput = document.createElement('input');
              spInput.type = 'hidden';
              spInput.name = 'selling_plan';
              form.appendChild(spInput);
            }
            spInput.value = sellingPlanId;
            console.log('Added selling plan:', sellingPlanId);
          }
          
          // Ensure form is set up correctly
          form.action = '/cart/add';
          form.method = 'POST';
          
          console.log('Form action:', form.action);
          console.log('Form method:', form.method);
          console.log('Form inputs:', Array.from(form.elements).map(el => ({
            name: el.name,
            value: el.value,
            type: el.type
          })));
          
          // Create a new form to bypass our preventDefault
          const newForm = document.createElement('form');
          newForm.method = 'POST';
          newForm.action = '/cart/add';
          newForm.enctype = 'multipart/form-data';
          
          // Copy all form data
          Array.from(form.elements).forEach(element => {
            if (element.name && (element.type === 'hidden' || element.type === 'number' || element.tagName === 'SELECT')) {
              const newInput = document.createElement('input');
              newInput.type = 'hidden';
              newInput.name = element.name;
              newInput.value = element.value || element.selectedOptions?.[0]?.value || '';
              newForm.appendChild(newInput);
            }
          });
          
          // Ensure variant ID and quantity are set
          const idInput = document.createElement('input');
          idInput.type = 'hidden';
          idInput.name = 'id';
          idInput.value = variant.id;
          newForm.appendChild(idInput);
          
          const qtyInput = document.createElement('input');
          qtyInput.type = 'hidden';
          qtyInput.name = 'quantity';
          qtyInput.value = quantity;
          newForm.appendChild(qtyInput);
          
          document.body.appendChild(newForm);
          console.log('Submitting new form...');
          newForm.submit();
          return;
        }
        
      } catch (error) {
        console.error('Error in add to cart:', error);
        
        // Last resort: show error instead of submitting (to avoid blank page)
        console.error('All methods failed, showing error instead of submitting form');
        
        // Reset button
        addToCartBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
        
        // Show error message
        const errorMsg = 'Unable to add product to cart. Please:\n' +
                        '1. Check that the product is available\n' +
                        '2. Verify you have selected a valid variant\n' +
                        '3. Try refreshing the page\n' +
                        '4. If the problem persists, contact support';
        
        if (window.showToast) {
          window.showToast('Error adding to cart. Please try again.', 'error');
        } else {
          alert(errorMsg);
        }
        
        console.error('Full error details:', error);
        return; // Don't submit, stay on page
      } finally {
        // Reset button if AJAX succeeded (form submit will redirect, so we don't need to reset in that case)
        if (ajaxSuccess) {
          // Small delay to allow cart drawer to open
          setTimeout(() => {
            addToCartBtn.disabled = false;
            if (btnText) btnText.style.display = 'inline';
            if (btnLoader) btnLoader.style.display = 'none';
          }, 500);
        }
      }
    });
    
    // Also handle direct button click (backup - in case form submit doesn't work)
    addToCartBtn.addEventListener('click', async function(e) {
      console.log('Add to cart button clicked directly');
      
      // If button is disabled, don't do anything
      if (addToCartBtn.disabled) {
        console.log('Button is disabled');
        return;
      }
      
      // If it's a submit button, let the form handle it first
      // But also add a backup handler
      if (addToCartBtn.type === 'submit') {
        // Wait a bit to see if form submit handler fires
        setTimeout(() => {
          // If form submit didn't work, handle it directly
          console.log('Form submit may not have worked, handling directly');
        }, 100);
      } else {
        // If button is not type submit, manually trigger form submit
        e.preventDefault();
        if (form) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
          form.dispatchEvent(submitEvent);
        }
      }
    }, { capture: true });
    
    console.log('Add to cart initialized successfully');
  }

  // Handle gallery thumbnails
  function initGallery() {
    const thumbnails = document.querySelectorAll('.thumbnail-btn');
    const mainImage = document.getElementById('product-main-image');
    
    thumbnails.forEach(btn => {
      btn.addEventListener('click', function() {
        const imageSrc = this.dataset.imageSrc;
        
        if (mainImage && imageSrc) {
          mainImage.src = imageSrc;
        }
        
        // Update active thumbnail
        thumbnails.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    });
  }

  // Initialize everything
  function init() {
    console.log('Initializing product page...');
    
    try {
      initSelectedOptions();
      initVariantSelectors();
      initQuantityControls();
      initSubscriptionToggle();
      initAddToCart();
      initGallery();
      
      // Update variant on page load if URL has variant parameter
      const urlParams = new URLSearchParams(window.location.search);
      const variantId = urlParams.get('variant');
      if (variantId) {
        const variant = product.variants.find(v => v.id === parseInt(variantId));
        if (variant) {
          state.selectedOptions = {
            option1: variant.option1,
            option2: variant.option2,
            option3: variant.option3
          };
          updateVariant();
        }
      }
      
      // Verify state is set after initialization
      if (!state.currentVariant) {
        console.warn('No variant initialized, trying to set one');
        const variantIdInput = document.getElementById('product-variant-id');
        if (variantIdInput) {
          const variantId = parseInt(variantIdInput.value);
          state.currentVariant = product.variants.find(v => v.id === variantId);
          if (!state.currentVariant) {
            state.currentVariant = product.variants.find(v => v.available) || product.variants[0];
            if (state.currentVariant && variantIdInput) {
              variantIdInput.value = state.currentVariant.id;
            }
          }
        }
      }
      
      console.log('Product page initialized successfully');
      console.log('Current variant:', state.currentVariant);
      console.log('State:', state);
    } catch (error) {
      console.error('Error initializing product page:', error);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM already ready, but wait a bit to ensure all scripts are loaded
    setTimeout(init, 100);
  }

})();

