/**
 * LOVE BRANDS - WHOLESALE PAGE (MASTERCASE)
 * Handles package selection and cart functionality using Shopify Cart API
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const ShopState = {
    selectedPackage: null
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

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

// ============================================
// ADD TO CART FUNCTIONALITY
// ============================================

/**
 * Add package to cart using Shopify Cart API
 */
async function addToCart(variantId, packageName, price) {
    try {
        // Check if addToCartShopify is available (from shopify-cart.js)
        if (typeof window.addToCartShopify === 'function') {
            // Use Shopify Cart API
            await window.addToCartShopify(variantId, 1);
            
            // Show success message
            showToast(`${packageName} added to cart!`, 'success');
            
            // Update cart UI
            if (window.updateCartUI) {
                await window.updateCartUI();
            }
            
            // Redirect to upsell page after short delay
            setTimeout(() => {
                window.location.href = '/pages/upsell';
            }, 1000);
        } else {
            // Fallback: Use direct fetch to Shopify Cart API
            const response = await fetch('/cart/add.js', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'same-origin',
                body: JSON.stringify({
                    items: [{
                        id: variantId,
                        quantity: 1
                    }]
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.description || 'Failed to add item to cart');
            }
            
            const data = await response.json();
            
            // Show success message
            showToast(`${packageName} added to cart!`, 'success');
            
            // Update cart UI
            if (window.updateCartUI) {
                await window.updateCartUI();
            }
            
            // Redirect to upsell page after short delay
            setTimeout(() => {
                window.location.href = '/pages/upsell';
            }, 1000);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast(error.message || 'Error adding product to cart', 'error');
        throw error;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();

            // If this button is meant to send users to a registration flow (e.g. wholesale signup),
            // redirect instead of adding to cart.
            const redirectUrl = this.getAttribute('data-redirect-url');
            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }
            
            const variantId = this.getAttribute('data-variant-id');
            const packageName = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            
            // Validate variant ID
            if (!variantId || variantId === 'REPLACE_WITH_VARIANT_ID') {
                showToast('Product variant not configured. Please contact support.', 'error');
                console.error('Variant ID not set. Please set data-variant-id attribute on the button.');
                return;
            }

            // Visual feedback
            const originalText = this.textContent;
            this.classList.add('loading');
            this.textContent = 'Adding to Cart...';
            this.disabled = true;

            try {
                // Add to cart using Shopify API
                await addToCart(variantId, packageName, price);
            } catch (error) {
                // Reset button on error
                this.classList.remove('loading');
                this.textContent = originalText;
                this.disabled = false;
            }
        });
    });
}

// ============================================
// ANIMATIONS
// ============================================

/**
 * Add scroll animations
 */
function initScrollAnimations() {
    const cards = document.querySelectorAll('.package-card, .faq-item');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(20px)';

                setTimeout(() => {
                    entry.target.style.transition = 'all 0.6s ease';
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, 100);

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        observer.observe(card);
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize FAQ accordion
 */
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const answer = this.nextElementSibling;

            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.style.maxHeight = '0';
                    q.nextElementSibling.style.padding = '0 32px';
                }
            });

            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                answer.style.padding = '0 32px';
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                answer.style.padding = '0 32px 24px';
            }
        });
    });
}

/**
 * Initialize wholesale/mastercase page
 */
function init() {
    console.log('🏪 MasterCase Page - Initializing...');

    // Initialize event listeners
    initEventListeners();

    // Initialize animations
    initScrollAnimations();

    // Initialize FAQ accordion
    initFAQ();

    console.log('✅ MasterCase Page - Ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

