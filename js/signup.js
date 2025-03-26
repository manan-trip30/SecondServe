document.addEventListener('DOMContentLoaded', function() {
    // Role selection toggle
    const providerRole = document.getElementById('provider-role');
    const receiverRole = document.getElementById('receiver-role');
    const businessFields = document.querySelectorAll('.form-group:has(#businessName), .form-group:has(#businessType)');
    
    if (providerRole && receiverRole) {
        providerRole.addEventListener('click', function() {
            providerRole.classList.add('active');
            receiverRole.classList.remove('active');
            
            // Show business fields if provider role is selected
            if (businessFields) {
                businessFields.forEach(field => {
                    field.style.display = 'flex';
                });
            }
        });
        
        receiverRole.addEventListener('click', function() {
            receiverRole.classList.add('active');
            providerRole.classList.remove('active');
            
            // Hide business fields if receiver role is selected
            if (businessFields) {
                businessFields.forEach(field => {
                    field.style.display = 'none';
                });
            }
        });
    }
    
    // Form validation
    const signupForm = document.querySelector('.signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!agreeTerms) {
                alert('Please agree to the Terms of Service and Privacy Policy');
                return;
            }
            
            // In a real app, we would submit the form data to the server here
            alert('Account created successfully! Redirecting to login page...');
            // Simulate redirection
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Social login functionality (placeholder)
    const googleSignup = document.querySelector('.google-signup');
    const facebookSignup = document.querySelector('.facebook-signup');
    
    if (googleSignup) {
        googleSignup.addEventListener('click', function() {
            alert('Google sign up would be initiated here');
        });
    }
    
    if (facebookSignup) {
        facebookSignup.addEventListener('click', function() {
            alert('Facebook sign up would be initiated here');
        });
    }
}); 