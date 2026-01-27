/**
 * LOVE BRANDS - WHOLESALE PAGE
 * Handles package selection and cart functionality for wholesale page
 * Based on shop-landing.js reference
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const WholesaleState = {
    selectedPackage: null,
    cart: {
        items: [],
        total: 0
    }
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
 * Add package to cart (Shopify Cart API)
 */
async function addToCartWholesale(variantId, packageName) {
    try {
        // Use Shopify Cart API
        if (typeof addToCartShopify === 'function') {
            await addToCartShopify(variantId, 1);
            showToast(`${packageName} added to cart!`, 'success');
            
            // Redirect to cart or upsell page
            setTimeout(() => {
                window.location.href = '/cart';
            }, 1000);
        } else {
            // Fallback: use form submission
            showToast('Adding to cart...', 'success');
            // Form will submit naturally
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding product to cart', 'error');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Add to cart forms
    const addToCartForms = document.querySelectorAll('.add-to-cart-form');

    addToCartForms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const button = this.querySelector('.add-to-cart-btn');
            const variantId = button.getAttribute('data-variant-id');
            const packageName = button.getAttribute('data-name') || 'Product';
            
            if (!variantId || variantId === 'REPLACE_WITH_VARIANT_ID') {
                showToast('Product variant ID not found. Please configure the product in Shopify.', 'error');
                return;
            }

            // Visual feedback
            button.classList.add('loading');
            const originalText = button.textContent;
            button.textContent = 'Adding to Cart...';
            button.disabled = true;

            try {
                // Use Shopify Cart API if available
                if (typeof addToCartShopify === 'function') {
                    await addToCartWholesale(variantId, packageName);
                } else {
                    // Fallback: submit form normally
                    this.submit();
                }
            } catch (error) {
                // Reset button on error
                button.classList.remove('loading');
                button.textContent = originalText;
                button.disabled = false;
            }
        });
    });

    // Add to cart buttons (if not in a form)
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn:not([form])');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const variantId = this.getAttribute('data-variant-id');
            const packageName = this.getAttribute('data-name') || 'Product';
            
            if (!variantId || variantId === 'REPLACE_WITH_VARIANT_ID') {
                showToast('Product variant ID not found. Please configure the product in Shopify.', 'error');
                return;
            }

            // Visual feedback
            this.classList.add('loading');
            const originalText = this.textContent;
            this.textContent = 'Adding to Cart...';
            this.disabled = true;

            try {
                await addToCartWholesale(variantId, packageName);
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
 * Initialize wholesale page
 */
function init() {
    console.log('🏪 Wholesale Page - Initializing...');

    // Initialize event listeners
    initEventListeners();

    // Initialize animations
    initScrollAnimations();

    // Initialize FAQ accordion
    initFAQ();

    console.log('✅ Wholesale Page - Ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

