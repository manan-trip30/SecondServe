// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function() {
      mobileMenu.classList.toggle('active');
      
      // Toggle icon between bars and times
      const icon = mobileMenuBtn.querySelector('i');
      if (icon.classList.contains('fa-bars')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  }
  
  // Form validation
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(event) {
      let isValid = true;
      
      // Check required fields
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('is-invalid');
          
          // Create error message if it doesn't exist
          let errorMessage = field.parentElement.querySelector('.error-message');
          if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'var(--danger-color)';
            errorMessage.style.fontSize = '0.875rem';
            errorMessage.style.marginTop = '0.25rem';
            field.parentElement.appendChild(errorMessage);
          }
          errorMessage.textContent = 'This field is required';
        } else {
          field.classList.remove('is-invalid');
          const errorMessage = field.parentElement.querySelector('.error-message');
          if (errorMessage) {
            errorMessage.remove();
          }
        }
      });
      
      // Check email format
      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach(field => {
        if (field.value.trim() && !isValidEmail(field.value.trim())) {
          isValid = false;
          field.classList.add('is-invalid');
          
          // Create error message if it doesn't exist
          let errorMessage = field.parentElement.querySelector('.error-message');
          if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'var(--danger-color)';
            errorMessage.style.fontSize = '0.875rem';
            errorMessage.style.marginTop = '0.25rem';
            field.parentElement.appendChild(errorMessage);
          }
          errorMessage.textContent = 'Please enter a valid email address';
        }
      });
      
      // Check password match in signup form
      const passwordField = form.querySelector('#password');
      const confirmPasswordField = form.querySelector('#confirm-password');
      if (passwordField && confirmPasswordField) {
        if (passwordField.value !== confirmPasswordField.value) {
          isValid = false;
          confirmPasswordField.classList.add('is-invalid');
          
          // Create error message if it doesn't exist
          let errorMessage = confirmPasswordField.parentElement.querySelector('.error-message');
          if (!errorMessage) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            errorMessage.style.color = 'var(--danger-color)';
            errorMessage.style.fontSize = '0.875rem';
            errorMessage.style.marginTop = '0.25rem';
            confirmPasswordField.parentElement.appendChild(errorMessage);
          }
          errorMessage.textContent = 'Passwords do not match';
        }
      }
      
      // Prevent form submission if validation fails
      if (!isValid) {
        event.preventDefault();
      }
    });
    
    // Clear validation errors on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', function() {
        field.classList.remove('is-invalid');
        const errorMessage = field.parentElement.querySelector('.error-message');
        if (errorMessage) {
          errorMessage.remove();
        }
      });
    });
  });
  
  // Add custom styles for form validation
  const style = document.createElement('style');
  style.textContent = `
    .is-invalid {
      border-color: var(--danger-color) !important;
    }
    
    .form-control:focus.is-invalid {
      box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
    }
  `;
  document.head.appendChild(style);
});

// Helper function to validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId !== '#') {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: 'smooth'
        });
      }
    }
  });
}); 