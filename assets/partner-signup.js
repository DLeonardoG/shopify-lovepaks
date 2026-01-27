/**
 * LOVE BRANDS - PARTNER SIGNUP FLOW
 * Complete Shopify Integration with Customer API and Metafields
 * Handles multi-step partner registration and saves to Shopify
 */

// ============================================
// STATE MANAGEMENT
// ============================================

const PartnerState = {
    currentStep: 1,
    totalSteps: 4,
    companyData: {},
    agreementsScrolled: {
        supply: false,
        ecommerce: false,
        licensing: false
    },
    signatureData: {},
    isSubmitting: false
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Show loading overlay
 */
function showLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'flex';
}

/**
 * Hide loading overlay
 */
function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
}

/**
 * Show error message
 */
function showError(message, elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

/**
 * Clear error message
 */
function clearError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
    }
}

/**
 * Format phone number
 */
function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 6) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
    } else if (cleaned.length >= 3) {
        return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3)}`;
    }
    return cleaned;
}

/**
 * Format EIN
 */
function formatEIN(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 9)}`;
    }
    return cleaned;
}

/**
 * Validate email
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate EIN format
 */
function validateEIN(ein) {
    const cleaned = ein.replace(/\D/g, '');
    return cleaned.length === 9;
}

/**
 * Get customer IP address (for signature)
 */
async function getCustomerIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.warn('Could not fetch IP address:', error);
        return 'unknown';
    }
}

// ============================================
// STEP NAVIGATION
// ============================================

/**
 * Go to specific step
 */
function goToStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.signup-step').forEach(step => {
        step.classList.remove('active');
    });

    // Show current step
    const currentStepEl = document.getElementById(`step-${stepNumber}`);
    if (currentStepEl) {
        currentStepEl.classList.add('active');
    }

    // Update progress bar
    updateProgressBar(stepNumber);

    // Update state
    PartnerState.currentStep = stepNumber;

    // Step-specific initialization
    if (stepNumber === 3) {
        populateSummary();
        setCurrentDate();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Update progress bar
 */
function updateProgressBar(currentStep) {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');

        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
}

// ============================================
// STEP 1: COMPANY DETAILS
// ============================================

/**
 * Initialize Step 1
 */
function initStep1() {
    const form = document.getElementById('company-form');
    if (!form) return;

    // Phone number formatting
    const phoneInput = document.getElementById('cell-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            e.target.value = formatPhoneNumber(e.target.value);
            const newLength = e.target.value.length;
            const oldLength = oldValue.length;
            const diff = newLength - oldLength;
            e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
            clearError('cell-phone-error');
        });
    }

    // EIN formatting
    const einInput = document.getElementById('ein');
    if (einInput) {
        einInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldValue = e.target.value;
            e.target.value = formatEIN(e.target.value);
            const newLength = e.target.value.length;
            const oldLength = oldValue.length;
            const diff = newLength - oldLength;
            e.target.setSelectionRange(cursorPosition + diff, cursorPosition + diff);
            clearError('ein-error');
        });
    }

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearError(`${input.id}-error`));
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showError('Please fix the errors above', 'form-error');
            return;
        }

        // Collect form data
        const formData = new FormData(form);
        PartnerState.companyData = {
            companyName: formData.get('companyName'),
            address: formData.get('address'),
            ein: formData.get('ein'),
            cellPhone: formData.get('cellPhone'),
            mainContact: formData.get('mainContact'),
            contactEmail: formData.get('contactEmail')
        };

        // Go to next step
        goToStep(2);
    });
}

/**
 * Validate individual field
 */
function validateField(field) {
    const value = field.value.trim();
    const fieldId = field.id;
    let isValid = true;
    let errorMessage = '';

    // Required validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Email validation
    if (field.type === 'email' && value && !validateEmail(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
    }

    // EIN validation
    if (fieldId === 'ein' && value && !validateEIN(value)) {
        isValid = false;
        errorMessage = 'EIN must be in format XX-XXXXXXX';
    }

    // Phone validation
    if (fieldId === 'cell-phone' && value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length !== 10) {
            isValid = false;
            errorMessage = 'Phone number must be 10 digits';
        }
    }

    // Show/hide error
    if (isValid) {
        clearError(`${fieldId}-error`);
        field.classList.remove('error');
    } else {
        showError(errorMessage, `${fieldId}-error`);
        field.classList.add('error');
    }

    return isValid;
}

// ============================================
// STEP 2: LEGAL DISCLOSURES
// ============================================

/**
 * Initialize Step 2
 */
function initStep2() {
    const agreements = [
        { id: 'supply-agreement', box: 'supply-agreement-box', status: 'supply-status', indicator: 'supply-indicator', key: 'supply' },
        { id: 'ecommerce-agreement', box: 'ecommerce-agreement-box', status: 'ecommerce-status', indicator: 'ecommerce-indicator', key: 'ecommerce' },
        { id: 'licensing-agreement', box: 'licensing-agreement-box', status: 'licensing-status', indicator: 'licensing-indicator', key: 'licensing' }
    ];

    agreements.forEach(agreement => {
        const element = document.getElementById(agreement.id);
        const box = document.getElementById(agreement.box);
        const statusEl = document.getElementById(agreement.status);
        const indicatorEl = document.getElementById(agreement.indicator);

        if (element && box) {
            element.addEventListener('scroll', () => {
                const scrollTop = element.scrollTop;
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

                // Check if scrolled to bottom (with 5px tolerance)
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    if (!PartnerState.agreementsScrolled[agreement.key]) {
                        PartnerState.agreementsScrolled[agreement.key] = true;
                        box.classList.add('scrolled');
                        if (statusEl) {
                            statusEl.textContent = '✓ Read';
                            statusEl.classList.add('read');
                        }
                        if (indicatorEl) {
                            indicatorEl.style.display = 'none';
                        }
                        checkAllAgreementsScrolled();
                    }
                } else {
                    // Update scroll percentage indicator
                    if (indicatorEl && scrollPercentage < 0.95) {
                        indicatorEl.style.opacity = '1';
                    }
                }
            });
        }
    });

    // Back button
    const backButton = document.getElementById('back-to-step-1');
    if (backButton) {
        backButton.addEventListener('click', () => goToStep(1));
    }

    // Continue button
    const continueButton = document.getElementById('continue-to-authorization');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            if (!continueButton.disabled) {
                goToStep(3);
            }
        });
    }
}

/**
 * Check if all agreements have been scrolled
 */
function checkAllAgreementsScrolled() {
    const allScrolled = Object.values(PartnerState.agreementsScrolled).every(val => val === true);
    const continueButton = document.getElementById('continue-to-authorization');

    if (continueButton) {
        continueButton.disabled = !allScrolled;
        if (allScrolled) {
            continueButton.classList.add('pulse');
        } else {
            continueButton.classList.remove('pulse');
        }
    }
}

// ============================================
// STEP 3: AUTHORIZATION & SIGNATURE
// ============================================

/**
 * Initialize Step 3
 */
function initStep3() {
    // Set current date
    setCurrentDate();

    // Populate summary
    populateSummary();

    // Signature validation
    const signatureInput = document.getElementById('signature-name');
    const titleInput = document.getElementById('signature-title');
    const authorizeCheckbox = document.getElementById('authorize-checkbox');
    const submitButton = document.getElementById('submit-application');
    const form = document.getElementById('signature-form');

    function checkSignatureComplete() {
        const nameComplete = signatureInput && signatureInput.value.trim().length >= 3;
        const titleComplete = titleInput && titleInput.value.trim().length > 0;
        const authorized = authorizeCheckbox && authorizeCheckbox.checked;

        if (submitButton) {
            submitButton.disabled = !(nameComplete && titleComplete && authorized);
        }
    }

    if (signatureInput) {
        signatureInput.addEventListener('input', () => {
            checkSignatureComplete();
            clearError('signature-name-error');
            if (signatureInput.value.trim().length > 0 && signatureInput.value.trim().length < 3) {
                showError('Signature must be at least 3 characters', 'signature-name-error');
            }
        });
    }

    if (titleInput) {
        titleInput.addEventListener('input', () => {
            checkSignatureComplete();
            clearError('signature-title-error');
        });
    }

    if (authorizeCheckbox) {
        authorizeCheckbox.addEventListener('change', () => {
            checkSignatureComplete();
            clearError('authorize-checkbox-error');
        });
    }

    // Back button
    const backButton = document.getElementById('back-to-step-2');
    if (backButton) {
        backButton.addEventListener('click', () => goToStep(2));
    }

    // Form submission - Using Shopify Forms
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Validate
            if (!signatureInput.value.trim() || signatureInput.value.trim().length < 3) {
                showError('Signature must be at least 3 characters', 'signature-name-error');
                return;
            }

            if (!titleInput.value.trim()) {
                showError('Title is required', 'signature-title-error');
                return;
            }

            if (!authorizeCheckbox.checked) {
                showError('You must authorize to continue', 'authorize-checkbox-error');
                return;
            }

            // Collect signature data
            PartnerState.signatureData = {
                fullName: signatureInput.value.trim(),
                title: titleInput.value.trim(),
                date: document.getElementById('signature-date').value
            };

            // Populate hidden fields with all data
            populateHiddenFields();

            // Get customer IP for signature
            const customerIP = await getCustomerIP();
            const signatureDataJSON = JSON.stringify({
                full_name: PartnerState.signatureData.fullName,
                title: PartnerState.signatureData.title,
                date: PartnerState.signatureData.date,
                ip_address: customerIP,
                timestamp: new Date().toISOString()
            });

            // Add signature data to hidden field
            const signatureDataField = document.getElementById('hidden-signature-data');
            if (signatureDataField) {
                signatureDataField.value = signatureDataJSON;
            }

            // Add agreements data
            const agreementsDataJSON = JSON.stringify({
                supply_agreement: PartnerState.agreementsScrolled.supply,
                ecommerce_agreement: PartnerState.agreementsScrolled.ecommerce,
                image_licensing: PartnerState.agreementsScrolled.licensing,
                accepted_at: new Date().toISOString()
            });

            const agreementsField = document.getElementById('hidden-agreements');
            if (agreementsField) {
                agreementsField.value = agreementsDataJSON;
            }

            // Show loading
            showLoading();
            const submitButton = document.getElementById('submit-application');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Processing...';
            }

            // Submit the Shopify form using AJAX to handle response
            submitShopifyForm(form);
        });
    }
}

/**
 * Set current date
 */
function setCurrentDate() {
    const dateInput = document.getElementById('signature-date');
    if (dateInput) {
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateInput.value = today;
    }
}

/**
 * Populate agreement summary
 */
function populateSummary() {
    const summaryContainer = document.getElementById('agreement-summary');
    if (!summaryContainer) return;

    const data = PartnerState.companyData;
    const summaryHTML = `
        <div class="summary-item">
            <div class="summary-label">Company Name</div>
            <div class="summary-value">${data.companyName || 'N/A'}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Main Contact</div>
            <div class="summary-value">${data.mainContact || 'N/A'}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Email</div>
            <div class="summary-value">${data.contactEmail || 'N/A'}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Phone</div>
            <div class="summary-value">${data.cellPhone || 'N/A'}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Address</div>
            <div class="summary-value">${data.address || 'N/A'}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">EIN</div>
            <div class="summary-value">${data.ein || 'N/A'}</div>
        </div>
    `;

    summaryContainer.innerHTML = summaryHTML;
}

// ============================================
// SHOPIFY INTEGRATION
// ============================================

/**
 * Populate hidden fields with all partner data
 */
function populateHiddenFields() {
    // Company data
    const companyNameField = document.getElementById('hidden-company-name');
    const addressField = document.getElementById('hidden-address');
    const einField = document.getElementById('hidden-ein');
    const phoneField = document.getElementById('hidden-phone');
    const contactNameField = document.getElementById('hidden-contact-name');
    const contactEmailField = document.getElementById('hidden-contact-email');

    if (companyNameField) companyNameField.value = PartnerState.companyData.companyName || '';
    if (addressField) addressField.value = PartnerState.companyData.address || '';
    if (einField) einField.value = PartnerState.companyData.ein || '';
    if (phoneField) phoneField.value = PartnerState.companyData.cellPhone || '';
    if (contactNameField) contactNameField.value = PartnerState.companyData.mainContact || '';
    if (contactEmailField) contactEmailField.value = PartnerState.companyData.contactEmail || '';
}

/**
 * Submit Shopify Form using AJAX
 * This uses Shopify's contact form endpoint
 */
async function submitShopifyForm(form) {
    try {
        const formData = new FormData(form);
        
        // Submit to Shopify contact form endpoint
        const response = await fetch('/contact', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        // Check if submission was successful
        if (response.ok || response.redirected) {
            // Success - go to step 4
            hideLoading();
            goToStep(4);
            
            // Store success in localStorage for reference
            localStorage.setItem('partner_signup_submitted', 'true');
            localStorage.setItem('partner_signup_timestamp', new Date().toISOString());
        } else {
            // Error handling
            const errorText = await response.text();
            console.error('Form submission error:', errorText);
            throw new Error('Failed to submit form');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        hideLoading();
        
        const submitButton = document.getElementById('submit-application');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Application';
        }

        // Show error message
        alert('There was an error submitting your application. Please try again or contact support at partners@lovebrands.com');
    }
}

// ============================================
// STEP 4: SUCCESS
// ============================================

/**
 * Initialize Step 4
 */
function initStep4() {
    // Auto-redirect after 5 seconds (optional)
    // const dashboardButton = document.getElementById('go-to-dashboard');
    // setTimeout(() => {
    //     if (dashboardButton) {
    //         window.location.href = '/pages/partner-dashboard';
    //     }
    // }, 5000);
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize partner signup flow
 */
function init() {
    console.log('🚀 Partner Signup - Initializing...');

    // Check if user is already logged in and is a partner
    {% if customer %}
        {% if customer.tags contains 'wholesale-partner' or customer.tags contains 'partner' %}
            // Redirect to dashboard if already a partner
            window.location.href = '/pages/partner-dashboard';
            return;
        {% endif %}
    {% endif %}

    // Initialize all steps
    initStep1();
    initStep2();
    initStep3();
    initStep4();

    // Start at step 1
    goToStep(1);

    console.log('✅ Partner Signup - Ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
