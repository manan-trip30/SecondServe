// DOM Elements
const modal = document.getElementById('registrationModal');
const modalTitle = document.getElementById('modalTitle');
const registrationForm = document.getElementById('registrationForm');

// Current user type (distributor or acceptor)
let currentUserType = '';

// Show registration form modal
function showRegistrationForm(userType) {
    currentUserType = userType;
    modalTitle.textContent = `Register as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`;
    modal.style.display = 'block';

    // Add description placeholder based on user type
    const descriptionField = document.getElementById('description');
    if (userType === 'distributor') {
        descriptionField.placeholder = 'Tell us about your business, typical food surplus, and frequency of availability';
    } else {
        descriptionField.placeholder = 'Tell us about your organization/needs and how many people you typically serve';
    }
}

// Close modal
function closeModal() {
    modal.style.display = 'none';
    registrationForm.reset();
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === modal) {
        closeModal();
    }
}

// Handle form submission
registrationForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // Get form data
    const formData = {
        userType: currentUserType,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        description: document.getElementById('description').value
    };

    // Here you would typically send this data to your backend
    console.log('Form submitted:', formData);

    // Show success message
    alert('Registration successful! We will contact you soon.');
    closeModal();
});

// Add phone number validation
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', function(e) {
    // Remove any non-numeric characters
    this.value = this.value.replace(/[^0-9+\-\s]/g, '');
});

// Add email validation
const emailInput = document.getElementById('email');
emailInput.addEventListener('input', function(e) {
    const email = this.value;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailPattern.test(email)) {
        this.setCustomValidity('Please enter a valid email address');
    } else {
        this.setCustomValidity('');
    }
}); 