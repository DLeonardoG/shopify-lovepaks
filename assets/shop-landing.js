/**
 * LOVE BRANDS - SHOP LANDING PAGE
 * Handles package selection and cart functionality
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const ShopState = {
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

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    localStorage.setItem('lovebrands_shop_cart', JSON.stringify(ShopState.cart));
}

/**
 * Get cart from localStorage
 */
function getCartFromStorage() {
    const cart = localStorage.getItem('lovebrands_shop_cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
}

// ============================================
// ADD TO CART FUNCTIONALITY
// ============================================

/**
 * Add package to cart (Shopify Cart API)
 */
async function addToCart(variantId, packageName) {
    try {
        // Use Shopify Cart API
        if (typeof addToCartShopify === 'function') {
            await addToCartShopify(variantId, 1);
            showToast(`${packageName} added to cart!`, 'success');
            
            // Redirect to checkout or upsell page
            setTimeout(() => {
                window.location.href = '/cart';
            }, 1000);
        } else {
            // Fallback: redirect to product page or cart
            showToast('Adding to cart...', 'success');
            window.location.href = '/cart';
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
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const variantId = this.getAttribute('data-variant-id');
            const packageName = this.getAttribute('data-name') || 'Product';
            
            if (!variantId) {
                showToast('Product variant ID not found. Please configure the product in Shopify.', 'error');
                return;
            }

            // Visual feedback
            this.classList.add('loading');
            const originalText = this.textContent;
            this.textContent = 'Adding to Cart...';
            this.disabled = true;

            try {
                await addToCart(variantId, packageName);
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
 * Initialize shop landing page
 */
function init() {
    console.log('🛍️ Shop Landing - Initializing...');

    // Initialize event listeners
    initEventListeners();

    // Initialize animations
    initScrollAnimations();

    // Initialize FAQ accordion
    initFAQ();

    console.log('✅ Shop Landing - Ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
