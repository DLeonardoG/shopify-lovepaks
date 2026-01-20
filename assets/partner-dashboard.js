/**
 * LOVE BRANDS - PARTNER DASHBOARD
 * Manages partner dashboard with data from localStorage
 */

// ============================================
// STATE MANAGEMENT
// ============================================

let partnerData = null;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get partner data from localStorage
 */
function getPartnerData() {
    const data = localStorage.getItem('lovebrands_partner_data');
    return data ? JSON.parse(data) : null;
}

/**
 * Check if user is a partner
 */
function checkPartnerAccess() {
    const isPartner = localStorage.getItem('lovebrands_is_partner');
    const partnerStatus = localStorage.getItem('lovebrands_partner_status');

    if (isPartner !== 'true' || partnerStatus !== 'active') {
        // Redirect to signup
        window.location.href = 'partner-signup.html';
        return false;
    }
    return true;
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
 * Logout partner
 */
function logoutPartner() {
    if (confirm('Are you sure you want to logout?')) {
        // Don't clear partner data, just log out
        localStorage.removeItem('lovebrands_is_partner');
        localStorage.setItem('lovebrands_partner_status', 'inactive');
        window.location.href = 'index.html';
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

/**
 * Display partner name in header
 */
function displayPartnerName() {
    const nameElement = document.getElementById('partner-name');
    if (nameElement && partnerData) {
        const name = partnerData.companyName || partnerData.mainContact || 'Partner';
        nameElement.textContent = name;
    }
}

/**
 * Display company information
 */
function displayCompanyInfo() {
    const infoContainer = document.getElementById('company-info');
    if (!infoContainer || !partnerData) return;

    const infoHTML = `
        <div class="info-item">
            <div class="info-label">Company Name</div>
            <div class="info-value">${partnerData.companyName || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Main Contact</div>
            <div class="info-value">${partnerData.mainContact || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Email</div>
            <div class="info-value">${partnerData.contactEmail || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Phone</div>
            <div class="info-value">${partnerData.cellPhone || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Address</div>
            <div class="info-value">${partnerData.address || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">EIN</div>
            <div class="info-value">${partnerData.ein || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Billing Email</div>
            <div class="info-value">${partnerData.billingEmail || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Annual Revenue</div>
            <div class="info-value">${partnerData.annualRevenue || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Employees</div>
            <div class="info-value">${partnerData.numEmployees || 'N/A'}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Locations</div>
            <div class="info-value">${partnerData.numLocations || 'N/A'}</div>
        </div>
    `;

    infoContainer.innerHTML = infoHTML;
}

/**
 * Get current order from localStorage
 */
function getCurrentOrder() {
    const order = localStorage.getItem('lovebrands_current_order');
    return order ? JSON.parse(order) : null;
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Display order tracking
 */
function displayOrderTracking() {
    const order = getCurrentOrder();
    const ordersTableBody = document.querySelector('.orders-table');

    if (!ordersTableBody) return;

    // Clear existing orders except header
    const header = ordersTableBody.querySelector('.order-header');
    ordersTableBody.innerHTML = '';
    if (header) {
        ordersTableBody.appendChild(header);
    }

    if (!order) {
        // Show placeholder message
        const noOrdersRow = document.createElement('div');
        noOrdersRow.className = 'order-row';
        noOrdersRow.innerHTML = `
            <div class="order-cell" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                No orders yet. <a href="/pages/shop-landing" style="color: var(--primary-pink); font-weight: 600;">Place your first order</a>
            </div>
        `;
        ordersTableBody.appendChild(noOrdersRow);
        return;
    }

    // Calculate order status based on time
    const orderDate = new Date(order.orderDate);
    const now = new Date();
    const hoursSinceOrder = (now - orderDate) / (1000 * 60 * 60);

    let status = 'processing';
    let statusClass = 'pending';
    let statusText = 'Processing';

    if (hoursSinceOrder > 48) {
        status = 'delivered';
        statusClass = 'delivered';
        statusText = 'Delivered';
    } else if (hoursSinceOrder > 24) {
        status = 'shipped';
        statusClass = 'shipped';
        statusText = 'Shipped';
    }

    // Format order date
    const formattedDate = orderDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    // Create order row
    const orderRow = document.createElement('div');
    orderRow.className = 'order-row current-order';
    orderRow.style.cursor = 'pointer';
    orderRow.innerHTML = `
        <div class="order-cell">${order.orderNumber}</div>
        <div class="order-cell">${formattedDate}</div>
        <div class="order-cell">${formatCurrency(order.cart.total)}</div>
        <div class="order-cell">
            <span class="status-badge ${statusClass}">${statusText}</span>
        </div>
    `;

    // Add click event to show tracking details
    orderRow.addEventListener('click', () => showTrackingModal(order));

    ordersTableBody.appendChild(orderRow);
}

/**
 * Show tracking modal with order details
 */
function showTrackingModal(order) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('tracking-modal');

    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'tracking-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }

    const orderDate = new Date(order.orderDate);
    const now = new Date();
    const hoursSinceOrder = (now - orderDate) / (1000 * 60 * 60);

    // Professional icon SVGs
    const icons = {
        checkmark: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        gear: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.01129 9.77251C4.28059 9.5799 4.48571 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        truck: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V15C19 15.5304 18.7893 16.0391 18.4142 16.4142C18.0391 16.7893 17.5304 17 17 17H13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M13 17H1V11H13V17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M5 17C5.53043 17 6.03914 16.7893 6.41421 16.4142C6.78929 16.0391 7 15.5304 7 15C7 14.4696 6.78929 13.9609 6.41421 13.5858C6.03914 13.2107 5.53043 13 5 13C4.46957 13 3.96086 13.2107 3.58579 13.5858C3.21071 13.9609 3 14.4696 3 15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 15H22C22.5304 15 23.0391 15.2107 23.4142 15.5858C23.7893 15.9609 24 16.4696 24 17C24 17.5304 23.7893 18.0391 23.4142 18.4142C23.0391 18.7893 22.5304 19 22 19H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M17 11H19L22 14V17H19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M19 17C19.5304 17 20.0391 16.7893 20.4142 16.4142C20.7893 16.0391 21 15.5304 21 15C21 14.4696 20.7893 13.9609 20.4142 13.5858C20.0391 13.2107 19.5304 13 19 13C18.4696 13 17.9609 13.2107 17.5858 13.5858C17.2107 13.9609 17 14.4696 17 15C17 15.5304 17.2107 16.0391 17.5858 16.4142C17.9609 16.7893 18.4696 17 19 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`,
        delivered: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
    };

    // Determine tracking steps
    const steps = [
        {
            title: 'Order Placed',
            desc: 'Your order has been confirmed',
            icon: icons.checkmark,
            completed: true,
            date: orderDate
        },
        {
            title: 'Processing',
            desc: 'Preparing your wholesale package',
            icon: icons.gear,
            completed: hoursSinceOrder > 0,
            date: new Date(orderDate.getTime() + 2 * 60 * 60 * 1000) // +2 hours
        },
        {
            title: 'Shipped',
            desc: 'Package is on its way',
            icon: icons.truck,
            completed: hoursSinceOrder > 24,
            date: new Date(orderDate.getTime() + 24 * 60 * 60 * 1000) // +24 hours
        },
        {
            title: 'Delivered',
            desc: 'Package delivered successfully',
            icon: icons.delivered,
            completed: hoursSinceOrder > 48,
            date: new Date(orderDate.getTime() + 48 * 60 * 60 * 1000) // +48 hours
        }
    ];

    const currentStep = steps.filter(s => s.completed).length;

    // Build tracking timeline
    const timelineHTML = steps.map((step, index) => {
        const stepClass = step.completed ? 'completed' : (index === currentStep ? 'current' : '');
        const formattedDate = step.date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });

        return `
            <div class="tracking-step ${stepClass}">
                <div class="tracking-icon">${step.icon}</div>
                <div class="tracking-content">
                    <div class="tracking-title">${step.title}</div>
                    <div class="tracking-desc">${step.desc}</div>
                    ${step.completed ? `<div class="tracking-date">${formattedDate}</div>` : ''}
                </div>
            </div>
            ${index < steps.length - 1 ? '<div class="tracking-connector ' + (step.completed ? 'completed' : '') + '"></div>' : ''}
        `;
    }).join('');

    // Build order items list
    const itemsHTML = order.cart.items.map(item => `
        <div class="tracking-item">
            <div class="tracking-item-name">${item.name}</div>
            <div class="tracking-item-details">
                <span class="tracking-item-type">${item.type === 'package' ? 'Package' : 'Add-on'}</span>
                <span class="tracking-item-price">${formatCurrency(item.price)}</span>
            </div>
        </div>
    `).join('');

    modal.innerHTML = `
        <div class="modal-content tracking-modal-content">
            <div class="modal-header">
                <div>
                    <h2>Order Tracking</h2>
                    <p class="tracking-order-number">${order.orderNumber}</p>
                </div>
                <button class="modal-close" onclick="closeTrackingModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="tracking-timeline">
                    ${timelineHTML}
                </div>

                <div class="tracking-order-details">
                    <h3>Order Details</h3>
                    <div class="tracking-items">
                        ${itemsHTML}
                    </div>
                    <div class="tracking-total">
                        <span>Order Total:</span>
                        <span class="tracking-total-amount">${formatCurrency(order.cart.total)}</span>
                    </div>
                </div>

                <div class="tracking-customer-info">
                    <h3>Shipping Information</h3>
                    <p><strong>Contact:</strong> ${order.customer.fullName}</p>
                    <p><strong>Email:</strong> ${order.customer.email}</p>
                    <p><strong>Phone:</strong> ${order.customer.phone}</p>
                    ${order.customer.notes ? `<p><strong>Notes:</strong> ${order.customer.notes}</p>` : ''}
                </div>
            </div>
        </div>
    `;

    modal.classList.add('open');
}

/**
 * Close tracking modal
 */
function closeTrackingModal() {
    const modal = document.getElementById('tracking-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// Make function available globally
window.closeTrackingModal = closeTrackingModal;

/**
 * Display agreement dates
 */
function displayAgreementDates() {
    if (!partnerData || !partnerData.agreementsAccepted) return;

    const acceptedDate = partnerData.agreementsAccepted.acceptedDate;
    if (!acceptedDate) return;

    const formattedDate = new Date(acceptedDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const dateElements = [
        document.getElementById('agreement-date'),
        document.getElementById('agreement-date-2'),
        document.getElementById('agreement-date-3')
    ];

    dateElements.forEach(el => {
        if (el) {
            el.textContent = formattedDate;
        }
    });
}

// ============================================
// MODAL FUNCTIONS
// ============================================

/**
 * Open agreements modal
 */
function openAgreementsModal() {
    const modal = document.getElementById('agreements-modal');
    if (modal) {
        modal.classList.add('open');
        displayAgreementDates();
    }
}

/**
 * Close agreements modal
 */
function closeAgreementsModal() {
    const modal = document.getElementById('agreements-modal');
    if (modal) {
        modal.classList.remove('open');
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Initialize event listeners
 */
function initEventListeners() {
    // Logout link
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logoutPartner();
        });
    }

    // Edit info button
    const editInfoBtn = document.getElementById('edit-info-btn');
    if (editInfoBtn) {
        editInfoBtn.addEventListener('click', () => {
            showToast('Contact support to update your information', 'info');
        });
    }

    // Close modal button
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAgreementsModal);
    }

    // Close modal on outside click
    const modal = document.getElementById('agreements-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeAgreementsModal();
            }
        });
    }

    // Quick actions
    const buyMoreBtn = document.getElementById('buy-more-btn');
    if (buyMoreBtn) {
        buyMoreBtn.addEventListener('click', () => {
            window.location.href = 'shop-landing.html';
        });
    }

    const manageSubscriptionBtn = document.getElementById('manage-subscription-btn');
    if (manageSubscriptionBtn) {
        manageSubscriptionBtn.addEventListener('click', () => {
            showToast('Subscription management will be available in-app soon. For now, contact your Love Brands rep to update your plan.', 'info');
        });
    }

    const manageSubscriptionInline = document.getElementById('manage-subscription-inline');
    if (manageSubscriptionInline) {
        manageSubscriptionInline.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Subscription management will be available in-app soon. For now, contact your Love Brands rep to update your plan.', 'info');
        });
    }

    // Add data-label attributes for mobile responsiveness
    const orderCells = document.querySelectorAll('.order-row:not(.order-header) .order-cell');
    const headers = ['Order #', 'Date', 'Total', 'Status'];
    orderCells.forEach((cell, index) => {
        cell.setAttribute('data-label', headers[index % 4]);
    });
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize dashboard
 */
function init() {
    console.log('🚀 Partner Dashboard - Initializing...');

    // Check partner access
    if (!checkPartnerAccess()) {
        return;
    }

    // Load partner data
    partnerData = getPartnerData();

    if (!partnerData) {
        console.error('No partner data found');
        window.location.href = 'partner-signup.html';
        return;
    }

    // Display data
    displayPartnerName();
    displayCompanyInfo();
    displayOrderTracking(); // Display real order from checkout

    // Initialize event listeners
    initEventListeners();

    // Show welcome message
    setTimeout(() => {
        showToast(`Welcome back, ${partnerData.mainContact || 'Partner'}!`, 'success');
    }, 500);

    console.log('✅ Partner Dashboard - Ready!');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
