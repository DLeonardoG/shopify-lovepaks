/**
 * LOVE BRANDS - CHECKOUT PAGE
 * Handles checkout form and redirect to partner signup
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const CheckoutState = {
    cart: {
        items: [],
        total: 0,
        totalSavings: 0
    },
    customerInfo: {}
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Format phone number
 */
function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return value;
}

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
 * Get cart from localStorage
 */
function getCartFromStorage() {
    const cart = localStorage.getItem('lovebrands_shop_cart');
    return cart ? JSON.parse(cart) : { items: [], total: 0 };
}

/**
 * Save customer info to localStorage
 */
function saveCustomerInfo(customerData) {
    localStorage.setItem('lovebrands_customer_info', JSON.stringify(customerData));
}

/**
 * Save order to localStorage
 */
function saveOrder(orderData) {
    localStorage.setItem('lovebrands_current_order', JSON.stringify(orderData));
}

// ============================================
// CART & UI
// ============================================

/**
 * Load cart data
 */
function loadCart() {
    const savedCart = getCartFromStorage();

    if (!savedCart || savedCart.items.length === 0) {
        // No cart found, redirect to shop
        window.location.href = 'shop-landing.html';
        return false;
    }

    CheckoutState.cart = savedCart;
    return true;
}

/**
 * Update order summary
 */
function updateOrderSummary() {
    const summaryItemsContainer = document.getElementById('summary-items');
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    const savingsRowEl = document.getElementById('savings-row');
    const totalSavingsEl = document.getElementById('total-savings');

    // Clear items
    summaryItemsContainer.innerHTML = '';

    // Add each item
    CheckoutState.cart.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'summary-item';

        const label = item.type === 'package' ? 'Package' : 'Add-on';

        itemEl.innerHTML = `
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-label">${label}</div>
            </div>
            <div class="item-price">${formatCurrency(item.price)}</div>
        `;

        summaryItemsContainer.appendChild(itemEl);
    });

    // Update totals
    subtotalEl.textContent = formatCurrency(CheckoutState.cart.total);
    totalEl.textContent = formatCurrency(CheckoutState.cart.total);

    // Show savings if any
    if (CheckoutState.cart.totalSavings && CheckoutState.cart.totalSavings > 0) {
        savingsRowEl.style.display = 'flex';
        totalSavingsEl.textContent = formatCurrency(CheckoutState.cart.totalSavings);
    } else {
        savingsRowEl.style.display = 'none';
    }
}

// ============================================
// FORM HANDLING
// ============================================

/**
 * Format card number
 */
function formatCardNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/.{1,4}/g);
    return match ? match.join(' ') : cleaned;
}

/**
 * Detect card type from number
 */
function detectCardType(number) {
    const cleaned = number.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    return 'unknown';
}

/**
 * Format expiry date
 */
function formatExpiryDate(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
}

/**
 * Validate card number
 */
function validateCardNumber(number) {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 13 && cleaned.length <= 19;
}

/**
 * Initialize form
 */
function initForm() {
    const checkoutForm = document.getElementById('checkout-form');
    const paymentForm = document.getElementById('payment-form');
    const phoneInput = document.getElementById('phone');
    const proceedPaymentBtn = document.getElementById('proceed-payment-btn');

    // Phone formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldLength = e.target.value.length;
            e.target.value = formatPhoneNumber(e.target.value);
            const newLength = e.target.value.length;
            e.target.setSelectionRange(
                cursorPosition + (newLength - oldLength),
                cursorPosition + (newLength - oldLength)
            );
        });
    }

    // Proceed to Payment button - Opens modal
    if (proceedPaymentBtn) {
        proceedPaymentBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (checkoutForm && checkoutForm.checkValidity()) {
                // Save checkout form data to state and localStorage
                const formData = new FormData(checkoutForm);
                const customerData = {
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    notes: formData.get('notes') || '',
                    timestamp: new Date().toISOString()
                };
                
                // Save to state
                CheckoutState.customerInfo = customerData;
                
                // Save to localStorage immediately
                saveCustomerInfo(customerData);

                // Show payment modal
                const paymentModal = document.getElementById('payment-modal-overlay');
                if (paymentModal) {
                    paymentModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            } else {
                checkoutForm.reportValidity();
            }
        });
    }

    // Close modal buttons
    const closePaymentModal = document.getElementById('close-payment-modal');
    const cancelPaymentBtn = document.getElementById('cancel-payment-btn');
    const paymentModalOverlay = document.getElementById('payment-modal-overlay');

    function closeModal() {
        if (paymentModalOverlay) {
            paymentModalOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    if (closePaymentModal) {
        closePaymentModal.addEventListener('click', closeModal);
    }

    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (paymentModalOverlay) {
        paymentModalOverlay.addEventListener('click', (e) => {
            if (e.target === paymentModalOverlay) {
                closeModal();
            }
        });
    }

    // Payment method change handler
    function setupPaymentMethodHandlers() {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const cardPaymentFields = document.getElementById('card-payment-fields');
        
        function handlePaymentMethodChange() {
            const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
            if (selectedMethod && selectedMethod.value === 'card') {
                if (cardPaymentFields) cardPaymentFields.style.display = 'block';
                
                // Make card fields required
                const cardInputs = cardPaymentFields.querySelectorAll('input[required]');
                cardInputs.forEach(input => input.required = true);
            } else {
                if (cardPaymentFields) cardPaymentFields.style.display = 'none';
                
                // Remove required from card fields
                const cardInputs = cardPaymentFields.querySelectorAll('input[required]');
                cardInputs.forEach(input => input.required = false);
            }
        }

        paymentMethods.forEach(radio => {
            radio.addEventListener('change', handlePaymentMethodChange);
        });

        // Initialize payment method state
        handlePaymentMethodChange();
    }

    // Setup payment method handlers
    setupPaymentMethodHandlers();

    // Card number formatting and validation
    const cardNumberInput = document.getElementById('card-number');
    const cardTypeIndicator = document.getElementById('card-type-indicator');
    
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const formatted = formatCardNumber(value);
            e.target.value = formatted;
            
            // Detect card type
            const cardType = detectCardType(formatted);
            if (cardTypeIndicator) {
                if (cardType === 'visa') {
                    cardTypeIndicator.textContent = '💳';
                    cardTypeIndicator.classList.add('visible');
                } else if (cardType === 'mastercard') {
                    cardTypeIndicator.textContent = '💳';
                    cardTypeIndicator.classList.add('visible');
                } else if (cardType === 'amex') {
                    cardTypeIndicator.textContent = '💳';
                    cardTypeIndicator.classList.add('visible');
                } else if (formatted.replace(/\D/g, '').length > 0) {
                    cardTypeIndicator.classList.remove('visible');
                } else {
                    cardTypeIndicator.classList.remove('visible');
                }
            }
        });
    }

    // Expiry date formatting
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            const value = e.target.value;
            e.target.value = formatExpiryDate(value);
        });
    }

    // CVV formatting
    const cardCvvInput = document.getElementById('card-cvv');
    if (cardCvvInput) {
        cardCvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    // Payment form submission
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePaymentSubmit);
    }
}

/**
 * Show payment processing in modal (Stripe-style)
 */
function showPaymentProcessingInModal(paymentMethod) {
    const paymentForm = document.getElementById('payment-form');
    const processingState = document.getElementById('payment-processing-state');
    
    // Hide payment form
    if (paymentForm) {
        paymentForm.style.display = 'none';
    }
    
    // Show processing state
    if (processingState) {
        processingState.style.display = 'block';
    }

    // Adjust steps based on payment method
    const steps = paymentMethod === 'card' 
        ? [
            { id: 'modal-step-1', text: 'Verifying card details...', delay: 0 },
            { id: 'modal-step-2', text: 'Processing payment...', delay: 1500 },
            { id: 'modal-step-3', text: 'Confirming order...', delay: 3000 }
          ]
        : [
            { id: 'modal-step-1', text: 'Creating invoice...', delay: 0 },
            { id: 'modal-step-2', text: 'Processing order...', delay: 1000 },
            { id: 'modal-step-3', text: 'Confirming order...', delay: 2000 }
          ];

    steps.forEach((step, index) => {
        setTimeout(() => {
            // Update status text
            const statusEl = document.getElementById('processing-status');
            if (statusEl) {
                statusEl.textContent = step.text;
            }

            // Complete previous step
            if (index > 0) {
                const prevStep = document.getElementById(steps[index - 1].id);
                if (prevStep) {
                    prevStep.classList.remove('active', 'processing');
                    prevStep.classList.add('completed');
                    const prevIcon = prevStep.querySelector('.step-icon');
                    if (prevIcon) {
                        prevIcon.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        `;
                    }
                }
            }

            // Activate current step
            const currentStep = document.getElementById(step.id);
            if (currentStep) {
                currentStep.classList.add('active', 'processing');
                const currentIcon = currentStep.querySelector('.step-icon');
                if (currentIcon && !currentStep.classList.contains('completed')) {
                    currentIcon.innerHTML = '<div class="step-spinner"></div>';
                }
            }

            // Complete last step
            if (index === steps.length - 1) {
                setTimeout(() => {
                    const lastStep = document.getElementById(step.id);
                    if (lastStep) {
                        lastStep.classList.remove('active', 'processing');
                        lastStep.classList.add('completed');
                        const lastIcon = lastStep.querySelector('.step-icon');
                        if (lastIcon) {
                            lastIcon.innerHTML = `
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            `;
                        }
                    }
                    
                    // Update final status
                    const statusEl = document.getElementById('processing-status');
                    if (statusEl) {
                        statusEl.textContent = 'Payment successful!';
                    }

                    // Hide spinner
                    const spinnerContainer = processingState.querySelector('.spinner-container');
                    if (spinnerContainer) {
                        spinnerContainer.style.display = 'none';
                    }
                }, 1000);
            }
        }, step.delay);
    });
}

/**
 * Handle payment form submission
 */
function handlePaymentSubmit(e) {
    e.preventDefault();

    const submitButton = document.getElementById('complete-payment-btn');
    const formData = new FormData(e.target);
    const paymentMethod = formData.get('paymentMethod');

    // Validate card fields if credit card is selected
    if (paymentMethod === 'card') {
        const cardNumber = formData.get('cardNumber');
        const cardExpiry = formData.get('cardExpiry');
        const cardCvv = formData.get('cardCvv');
        const cardName = formData.get('cardName');

        if (!validateCardNumber(cardNumber)) {
            showToast('Please enter a valid card number', 'error');
            return;
        }

        if (!cardExpiry || cardExpiry.length < 5) {
            showToast('Please enter a valid expiry date', 'error');
            return;
        }

        if (!cardCvv || cardCvv.length < 3) {
            showToast('Please enter a valid CVV', 'error');
            return;
        }

        if (!cardName || cardName.trim().length === 0) {
            showToast('Please enter the cardholder name', 'error');
            return;
        }
    }

    console.log('💳 Processing payment...');
    console.log('📋 Payment Method:', paymentMethod);
    console.log('🛒 Cart:', CheckoutState.cart);
    console.log('👤 Customer Info:', CheckoutState.customerInfo);

    // Merge customer info from checkout form with payment data
    const customerData = {
        ...CheckoutState.customerInfo,
        paymentMethod: paymentMethod,
        paymentTimestamp: new Date().toISOString()
    };

    // Add card details if credit card payment
    if (paymentMethod === 'card') {
        const cardNumber = formData.get('cardNumber');
        customerData.cardDetails = {
            last4: cardNumber.slice(-4).replace(/\D/g, ''),
            expiry: formData.get('cardExpiry'),
            type: detectCardType(cardNumber)
        };
        console.log('💳 Card Details:', customerData.cardDetails);
    }

    // Create order data
    const orderData = {
        customer: customerData,
        cart: CheckoutState.cart,
        orderNumber: generateOrderNumber(),
        orderDate: new Date().toISOString(),
        status: paymentMethod === 'card' ? 'paid' : 'pending_payment',
        paymentStatus: paymentMethod === 'card' ? 'paid' : 'pending'
    };

    console.log('📦 Order Data:', orderData);

    // Disable submit button
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
    }

    // Show payment processing in modal
    showPaymentProcessingInModal(paymentMethod);

    // Simulate payment processing and save data
    // Total processing time: ~4.5 seconds for card, ~3.5 for invoice
    const totalProcessingTime = paymentMethod === 'card' ? 4500 : 3500;
    
    setTimeout(() => {
        // Update customer data with payment info
        const updatedCustomerData = {
            ...CheckoutState.customerInfo,
            paymentMethod: paymentMethod,
            paymentTimestamp: new Date().toISOString()
        };

        // Add card details if credit card payment
        if (paymentMethod === 'card') {
            updatedCustomerData.cardDetails = {
                last4: formData.get('cardNumber').slice(-4).replace(/\D/g, ''),
                expiry: formData.get('cardExpiry'),
                type: detectCardType(formData.get('cardNumber'))
            };
        }

        // Save updated customer info to localStorage
        console.log('💾 Saving customer info:', updatedCustomerData);
        saveCustomerInfo(updatedCustomerData);

        // Update order data with customer info
        orderData.customer = updatedCustomerData;

        // Save order to localStorage
        console.log('💾 Saving order:', orderData);
        saveOrder(orderData);

        // Mark that customer has paid (completed checkout)
        localStorage.setItem('lovebrands_has_paid', 'true');

        // Save order number for confirmation page
        localStorage.setItem('lovebrands_order_number', orderData.orderNumber);

        console.log('✅ Payment processed successfully!');
        console.log('📦 Order Number:', orderData.orderNumber);
        console.log('💰 Total:', formatCurrency(orderData.cart.total));

        // Wait a moment to show "Payment successful!" message, then redirect
        setTimeout(() => {
            console.log('🔄 Redirecting to confirmation page...');
            window.location.href = 'payment-confirmation.html';
        }, 1500);
    }, totalProcessingTime);
}

/**
 * Generate order number
 */
function generateOrderNumber() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `LB-${timestamp}-${random}`;
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize checkout page
 */
function init() {
    console.log('💳 Checkout - Initializing...');

    // Load cart
    if (!loadCart()) {
        return;
    }

    // Update order summary
    updateOrderSummary();

    // Initialize form
    initForm();

    console.log('✅ Checkout - Ready!');
    console.log('Current cart:', CheckoutState.cart);
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
