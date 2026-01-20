/**
 * LOVE BRANDS - PARTNER SIGNUP FLOW
 * Handles multi-step partner registration with localStorage persistence
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
    isAuthorized: false,
    signatureComplete: false
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Save partner data to localStorage
 */
function savePartnerData() {
    localStorage.setItem('lovebrands_partner_data', JSON.stringify(PartnerState.companyData));
    localStorage.setItem('lovebrands_partner_status', 'pending');
}

/**
 * Complete partner registration
 */
function completePartnerRegistration() {
    const completeData = {
        ...PartnerState.companyData,
        registrationDate: new Date().toISOString(),
        status: 'active',
        agreementsAccepted: {
            supply: true,
            ecommerce: true,
            licensing: true,
            acceptedDate: new Date().toISOString()
        }
    };

    localStorage.setItem('lovebrands_partner_data', JSON.stringify(completeData));
    localStorage.setItem('lovebrands_partner_status', 'active');
    localStorage.setItem('lovebrands_is_partner', 'true');
}

/**
 * Check if user is already a partner
 */
function checkPartnerStatus() {
    const isPartner = localStorage.getItem('lovebrands_is_partner');
    const partnerStatus = localStorage.getItem('lovebrands_partner_status');

    if (isPartner === 'true' && partnerStatus === 'active') {
        // Redirect to dashboard
        window.location.href = 'partner-dashboard.html';
        return true;
    }
    return false;
}

/**
 * Load customer info from checkout if available
 */
function loadCustomerInfo() {
    const customerInfo = localStorage.getItem('lovebrands_customer_info');
    if (!customerInfo) return;

    const data = JSON.parse(customerInfo);

    // Pre-fill form fields if they exist
    const mainContactInput = document.getElementById('main-contact');
    const contactEmailInput = document.getElementById('contact-email');
    const cellPhoneInput = document.getElementById('cell-phone');

    if (mainContactInput && data.fullName) {
        mainContactInput.value = data.fullName;
    }

    if (contactEmailInput && data.email) {
        contactEmailInput.value = data.email;
    }

    if (cellPhoneInput && data.phone) {
        cellPhoneInput.value = data.phone;
    }
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
 * Format EIN
 */
function formatEIN(value) {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
        return cleaned.substring(0, 2) + '-' + cleaned.substring(2, 9);
    }
    return value;
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

    // If going to step 3, ensure data is loaded and summary is populated
    if (stepNumber === 3) {
        const savedData = localStorage.getItem('lovebrands_partner_data');
        if (savedData) {
            try {
                PartnerState.companyData = JSON.parse(savedData);
            } catch (e) {
                console.error('Error loading partner data:', e);
            }
        }
        populateSummary();
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

        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.remove('active');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
            step.classList.remove('completed');
        } else {
            step.classList.remove('active', 'completed');
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

    // Load customer info from checkout if available
    loadCustomerInfo();

    // Phone number formatting
    const phoneInput = document.getElementById('cell-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldLength = e.target.value.length;
            e.target.value = formatPhoneNumber(e.target.value);
            const newLength = e.target.value.length;
            e.target.setSelectionRange(cursorPosition + (newLength - oldLength), cursorPosition + (newLength - oldLength));
        });
    }

    // EIN formatting
    const einInput = document.getElementById('ein');
    if (einInput) {
        einInput.addEventListener('input', (e) => {
            const cursorPosition = e.target.selectionStart;
            const oldLength = e.target.value.length;
            e.target.value = formatEIN(e.target.value);
            const newLength = e.target.value.length;
            e.target.setSelectionRange(cursorPosition + (newLength - oldLength), cursorPosition + (newLength - oldLength));
        });
    }

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        PartnerState.companyData = Object.fromEntries(formData.entries());

        // Save to localStorage
        savePartnerData();

        // Go to next step
        goToStep(2);
    });
}

// ============================================
// STEP 2: LEGAL DISCLOSURES
// ============================================

/**
 * Initialize Step 2
 */
function initStep2() {
    // Track scrolling for each agreement
    const agreements = [
        { id: 'supply-agreement', box: 'supply-agreement-box', key: 'supply' },
        { id: 'ecommerce-agreement', box: 'ecommerce-agreement-box', key: 'ecommerce' },
        { id: 'licensing-agreement', box: 'licensing-agreement-box', key: 'licensing' }
    ];

    agreements.forEach(agreement => {
        const element = document.getElementById(agreement.id);
        const box = document.getElementById(agreement.box);

        if (element && box) {
            element.addEventListener('scroll', () => {
                const scrollTop = element.scrollTop;
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;

                // Check if scrolled to bottom (with 10px tolerance)
                if (scrollTop + clientHeight >= scrollHeight - 10) {
                    PartnerState.agreementsScrolled[agreement.key] = true;
                    box.classList.add('scrolled');
                    checkAllAgreementsScrolled();
                }
            });
        }
    });

    // Back button
    const backButton = document.getElementById('back-to-step-1');
    if (backButton) {
        backButton.addEventListener('click', () => {
            goToStep(1);
        });
    }

    // Continue button
    const continueButton = document.getElementById('continue-to-authorization');
    if (continueButton) {
        continueButton.addEventListener('click', () => {
            goToStep(3);
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
    // Load saved data from localStorage if available
    const savedData = localStorage.getItem('lovebrands_partner_data');
    if (savedData) {
        try {
            PartnerState.companyData = JSON.parse(savedData);
        } catch (e) {
            console.error('Error loading partner data:', e);
        }
    }

    // Populate summary
    populateSummary();

    // Set current date
    const dateInput = document.getElementById('signature-date');
    if (dateInput) {
        const today = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        dateInput.value = today;
    }

    // Track signature completion
    const signatureInput = document.getElementById('signature-name');
    const titleInput = document.getElementById('signature-title');
    const authorizeCheckbox = document.getElementById('authorize-checkbox');
    const submitButton = document.getElementById('submit-application');

    function checkSignatureComplete() {
        const nameComplete = signatureInput && signatureInput.value.trim().length > 0;
        const titleComplete = titleInput && titleInput.value.trim().length > 0;
        const authorized = authorizeCheckbox && authorizeCheckbox.checked;

        if (submitButton) {
            submitButton.disabled = !(nameComplete && titleComplete && authorized);
        }
    }

    if (signatureInput) {
        signatureInput.addEventListener('input', checkSignatureComplete);
    }

    if (titleInput) {
        titleInput.addEventListener('input', checkSignatureComplete);
    }

    if (authorizeCheckbox) {
        authorizeCheckbox.addEventListener('change', checkSignatureComplete);
    }

    // Back button
    const backButton = document.getElementById('back-to-step-2');
    if (backButton) {
        backButton.addEventListener('click', () => {
            goToStep(2);
        });
    }

    // Submit button
    if (submitButton) {
        submitButton.addEventListener('click', () => {
            // Add signature data to company data
            PartnerState.companyData.signature = {
                name: signatureInput.value,
                title: titleInput.value,
                date: dateInput.value,
                timestamp: new Date().toISOString()
            };

            // Complete registration
            completePartnerRegistration();

            // Show success animation
            submitButton.textContent = 'Processing...';
            submitButton.disabled = true;

            setTimeout(() => {
                goToStep(4);
            }, 1000);
        });
    }
}

/**
 * Format annual revenue for display
 */
function formatAnnualRevenue(value) {
    if (!value) return 'N/A';
    
    const revenueMap = {
        '0-100k': '$0 - $100,000',
        '100k-500k': '$100,000 - $500,000',
        '500k-1m': '$500,000 - $1,000,000',
        '1m-5m': '$1,000,000 - $5,000,000',
        '5m+': '$5,000,000+'
    };
    
    return revenueMap[value] || value;
}

/**
 * Populate agreement summary
 */
function populateSummary() {
    const summaryContainer = document.getElementById('agreement-summary');

    if (!summaryContainer) return;

    // Try to get data from state first, then localStorage
    let data = PartnerState.companyData;
    
    if (!data || Object.keys(data).length === 0) {
        const savedData = localStorage.getItem('lovebrands_partner_data');
        if (savedData) {
            try {
                data = JSON.parse(savedData);
                PartnerState.companyData = data; // Update state
            } catch (e) {
                console.error('Error loading partner data:', e);
                data = {};
            }
        } else {
            data = {};
        }
    }

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
// STEP 4: SUCCESS
// ============================================

/**
 * Initialize Step 4
 */
function initStep4() {
    const dashboardButton = document.getElementById('go-to-dashboard');

    if (dashboardButton) {
        dashboardButton.addEventListener('click', () => {
            window.location.href = 'partner-dashboard.html';
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize partner signup flow
 */
function init() {
    console.log('🚀 Partner Signup - Initializing...');

    // Check if already a partner
    if (checkPartnerStatus()) {
        return;
    }

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
