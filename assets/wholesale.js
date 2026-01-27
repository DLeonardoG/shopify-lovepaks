/**
 * LOVE BRANDS - WHOLESALE PAGE
 * Handles package selection and cart functionality
 * Exact copy of shop-landing.js logic
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
 * Add package to cart
 */
function addToCart(packageId, packageName, price) {
    // Clear cart (solo un paquete a la vez)
    ShopState.cart.items = [];

    // Add new package
    ShopState.cart.items.push({
        id: packageId,
        name: packageName,
        price: parseFloat(price),
        quantity: 1,
        type: 'package'
    });

    // Update total
    ShopState.cart.total = parseFloat(price);

    // Save to localStorage
    saveCartToStorage();

    // Show success message
    showToast(`${packageName} added to cart!`, 'success');

    // Redirect to upsell page after short delay
    setTimeout(() => {
        window.location.href = '/pages/upsell';
    }, 1000);
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
        button.addEventListener('click', function() {
            const packageId = this.getAttribute('data-package');
            const packageName = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');

            // Visual feedback
            this.classList.add('loading');
            this.textContent = 'Adding to Cart...';
            this.disabled = true;

            // Simulate loading
            setTimeout(() => {
                addToCart(packageId, packageName, price);
            }, 500);
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

    // Load cart from storage
    ShopState.cart = getCartFromStorage();

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

