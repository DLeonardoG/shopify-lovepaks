/**
 * LOVE BRANDS - PROFESSIONAL JAVASCRIPT
 * Created: January 2026
 * Version: 1.0
 * 
 * TABLE OF CONTENTS:
 * 1. Configuration & State Management
 * 2. Utility Functions
 * 3. Navigation & Mobile Menu
 * 4. Scroll Animations
 * 5. Shopping Cart
 * 6. Newsletter
 * 7. Toast Notifications
 * 8. Back to Top Button
 * 9. Smooth Scrolling
 * 10. Initialization
 */

// ============================================
// 1. CONFIGURATION & STATE MANAGEMENT
// ============================================

const AppState = {
    cart: {
        items: [],
        count: 0,
        total: 0
    },
    isCartOpen: false,
    isMobileMenuOpen: false
};

const CONFIG = {
    animationThreshold: 0.1,
    scrollOffset: 100,
    toastDuration: 3000,
    debounceDelay: 150
};

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Get cart from localStorage
 */
function getCartFromStorage() {
    const cart = localStorage.getItem('lovebrands_cart');
    return cart ? JSON.parse(cart) : { items: [], count: 0, total: 0 };
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage() {
    localStorage.setItem('lovebrands_cart', JSON.stringify(AppState.cart));
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, CONFIG.toastDuration);
}

// ============================================
// 3. NAVIGATION & MOBILE MENU
// ============================================

/**
 * Initialize navigation
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    // Scroll effect for navbar
    const handleScroll = debounce(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, CONFIG.debounceDelay);
    
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            AppState.isMobileMenuOpen = !AppState.isMobileMenuOpen;
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        // Close mobile menu when clicking a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                AppState.isMobileMenuOpen = false;
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

// ============================================
// 4. SCROLL ANIMATIONS
// ============================================

/**
 * Initialize scroll animations using Intersection Observer
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: CONFIG.animationThreshold,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// 5. SHOPPING CART
// ============================================

/**
 * Add item to cart
 */
function addToCart(productId, productName, price) {
    // Check if item already exists
    const existingItem = AppState.cart.items.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        AppState.cart.items.push({
            id: productId,
            name: productName,
            price: parseFloat(price),
            quantity: 1
        });
    }
    
    // Update cart totals
    updateCartTotals();
    
    // Save to localStorage
    saveCartToStorage();
    
    // Update UI
    updateCartUI();
    
    // Show cart
    openMiniCart();
    
    // Show success toast
    showToast(`${productName} added to cart!`, 'success');
}

/**
 * Remove item from cart
 */
function removeFromCart(productId) {
    AppState.cart.items = AppState.cart.items.filter(item => item.id !== productId);
    updateCartTotals();
    saveCartToStorage();
    updateCartUI();
}

/**
 * Update cart totals
 */
function updateCartTotals() {
    AppState.cart.count = AppState.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    AppState.cart.total = AppState.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Update cart UI
 */
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const cartItems = document.getElementById('mini-cart-items');
    
    // Update count
    if (cartCount) {
        cartCount.textContent = AppState.cart.count;
    }
    
    // Update total
    if (cartTotal) {
        cartTotal.textContent = formatCurrency(AppState.cart.total);
    }
    
    // Update items list
    if (cartItems) {
        if (AppState.cart.items.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 40px 0;">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = AppState.cart.items.map(item => `
                <div class="mini-cart-item">
                    <div class="mini-cart-item-details">
                        <div class="mini-cart-item-name">${item.name}</div>
                        <div class="mini-cart-item-price">${formatCurrency(item.price)} × ${item.quantity}</div>
                    </div>
                    <button class="mini-cart-item-remove" onclick="removeFromCart('${item.id}')" aria-label="Remove item">
                        ×
                    </button>
                </div>
            `).join('');
        }
    }
}

/**
 * Open mini cart
 */
function openMiniCart() {
    const miniCart = document.getElementById('mini-cart');
    if (miniCart) {
        miniCart.classList.add('open');
        AppState.isCartOpen = true;
    }
}

/**
 * Close mini cart
 */
function closeMiniCart() {
    const miniCart = document.getElementById('mini-cart');
    if (miniCart) {
        miniCart.classList.remove('open');
        AppState.isCartOpen = false;
    }
}

/**
 * Initialize shopping cart
 */
function initShoppingCart() {
    // Load cart from localStorage
    AppState.cart = getCartFromStorage();
    updateCartUI();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const price = this.getAttribute('data-price');
            
            // Visual feedback
            this.classList.add('loading');
            this.textContent = 'Adding...';
            
            // Simulate API call (remove in production)
            setTimeout(() => {
                addToCart(productId, productName, price);
                this.classList.remove('loading');
                this.classList.add('added');
                this.textContent = 'Added!';
                
                setTimeout(() => {
                    this.classList.remove('added');
                    this.textContent = 'Add to Cart';
                }, 2000);
            }, 500);
        });
    });
    
    // Close cart button
    const closeButton = document.getElementById('mini-cart-close');
    if (closeButton) {
        closeButton.addEventListener('click', closeMiniCart);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', (e) => {
        const miniCart = document.getElementById('mini-cart');
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        
        if (AppState.isCartOpen && 
            !miniCart.contains(e.target) && 
            ![...addToCartButtons].some(btn => btn.contains(e.target))) {
            closeMiniCart();
        }
    });
}

// ============================================
// 6. NEWSLETTER
// ============================================

/**
 * Initialize newsletter form
 */
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const emailInput = document.getElementById('newsletter-email');
            const submitButton = form.querySelector('.newsletter-button');
            const email = emailInput.value.trim();
            
            // Validate email
            if (!isValidEmail(email)) {
                showToast('Please enter a valid email address', 'error');
                return;
            }
            
            // Disable button during submission
            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';
            
            // Simulate API call (replace with actual API endpoint)
            setTimeout(() => {
                // Success
                showToast('Thank you for subscribing!', 'success');
                emailInput.value = '';
                submitButton.disabled = false;
                submitButton.textContent = 'Subscribe';
                
                // Store in localStorage (optional)
                localStorage.setItem('lovebrands_subscribed', 'true');
            }, 1000);
        });
    }
}

/**
 * Validate email address
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// 7. TOAST NOTIFICATIONS
// ============================================
// (Already implemented in utility functions)

// ============================================
// 8. BACK TO TOP BUTTON
// ============================================

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        const handleScroll = debounce(() => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }, CONFIG.debounceDelay);
        
        window.addEventListener('scroll', handleScroll);
        
        // Scroll to top on click
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ============================================
// 9. SMOOTH SCROLLING
// ============================================

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

/**
 * Initialize smooth scrolling for all anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const targetId = href.substring(1);
                scrollToSection(targetId);
            }
        });
    });
}

// ============================================
// 10. ANALYTICS & TRACKING (Optional)
// ============================================

/**
 * Track page view
 */
function trackPageView() {
    // Implement Google Analytics or other tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
}

/**
 * Track add to cart event
 */
function trackAddToCart(productId, productName, price) {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'add_to_cart', {
            currency: 'USD',
            value: price,
            items: [{
                item_id: productId,
                item_name: productName,
                price: price,
                quantity: 1
            }]
        });
    }
}

// ============================================
// 11. PERFORMANCE OPTIMIZATIONS
// ============================================

/**
 * Lazy load images
 */
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============================================
// 12. INITIALIZATION
// ============================================

/**
 * Check and display partner status in navigation
 */
function initPartnerNavigation() {
    const navUserLink = document.getElementById('nav-user-link');
    const isPartner = localStorage.getItem('lovebrands_is_partner');
    const partnerStatus = localStorage.getItem('lovebrands_partner_status');
    
    if (navUserLink && isPartner === 'true' && partnerStatus === 'active') {
        navUserLink.style.display = 'flex';
    }
}

/**
 * Initialize hero video
 */
function initHeroVideo() {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // Set video properties
        heroVideo.setAttribute('loop', 'true');
        heroVideo.setAttribute('muted', 'true');
        heroVideo.setAttribute('playsinline', 'true');
        heroVideo.setAttribute('autoplay', 'true');
        
        // Force video to play
        const playPromise = heroVideo.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Video playing successfully');
            }).catch(error => {
                console.log('Video autoplay prevented:', error);
                // Try to play on user interaction
                const playOnInteraction = () => {
                    heroVideo.play();
                    document.removeEventListener('click', playOnInteraction);
                    document.removeEventListener('touchstart', playOnInteraction);
                };
                document.addEventListener('click', playOnInteraction, { once: true });
                document.addEventListener('touchstart', playOnInteraction, { once: true });
            });
        }
        
        // Ensure video loops
        heroVideo.addEventListener('ended', () => {
            heroVideo.currentTime = 0;
            heroVideo.play();
        });
    }
}

/**
 * Initialize all functionality when DOM is ready
 */
function init() {
    console.log('🚀 Love Brands - Initializing...');
    
    // Initialize core functionality
    initNavigation();
    initScrollAnimations();
    initShoppingCart();
    initNewsletter();
    initBackToTop();
    initSmoothScroll();
    initLazyLoading();
    initPartnerNavigation();
    initHeroVideo();
    
    // Track page view
    trackPageView();
    
    console.log('✅ Love Brands - Ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// 13. GLOBAL ERROR HANDLING
// ============================================

window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // Optionally send to error tracking service
});

// ============================================
// 14. EXPORT FUNCTIONS (for module usage)
// ============================================

// ============================================
// 15. PARTNER NAVIGATION
// ============================================

/**
 * Handle "Become a Partner" button click
 */
function handleBecomePartner() {
    // Check if user is already a partner
    const isPartner = localStorage.getItem('lovebrands_is_partner');
    const partnerStatus = localStorage.getItem('lovebrands_partner_status');

    if (isPartner === 'true' && partnerStatus === 'active') {
        // Redirect to dashboard
        window.location.href = 'partner-dashboard.html';
    } else {
        // Redirect to signup
        window.location.href = 'partner-signup.html';
    }
}

// Make key functions available globally
window.LoveBrands = {
    addToCart,
    removeFromCart,
    openMiniCart,
    closeMiniCart,
    showToast,
    scrollToSection,
    handleBecomePartner
};

// Make handleBecomePartner available globally
window.handleBecomePartner = handleBecomePartner;
