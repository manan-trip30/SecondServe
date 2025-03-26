import { registerWithEmailAndPassword, signInWithGoogle, signInWithFacebook } from './firebase.js';
import { redirectIfAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    redirectIfAuthenticated();
    
    // Role selection toggle
    const providerRole = document.getElementById('provider-role');
    const receiverRole = document.getElementById('receiver-role');
    const businessFields = document.querySelectorAll('.form-group:has(#businessName), .form-group:has(#businessType)');
    
    let userRole = 'provider'; // Default role
    
    if (providerRole && receiverRole) {
        providerRole.addEventListener('click', function() {
            providerRole.classList.add('active');
            receiverRole.classList.remove('active');
            userRole = 'provider';
            
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
            userRole = 'receiver';
            
            // Hide business fields if receiver role is selected
            if (businessFields) {
                businessFields.forEach(field => {
                    field.style.display = 'none';
                });
            }
        });
    }
    
    // Form validation and submission
    const signupForm = document.querySelector('.signup-form');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const businessName = document.getElementById('businessName')?.value || '';
            const businessType = document.getElementById('businessType')?.value || '';
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const agreeTerms = document.getElementById('agreeTerms').checked;
            
            // Form validation
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }
            
            if (!agreeTerms) {
                alert('Please agree to the Terms of Service and Privacy Policy');
                return;
            }
            
            // Create user data object
            const userData = {
                fullName,
                email,
                phone,
                role: userRole,
                createdAt: new Date().toISOString()
            };
            
            // Add business fields if provider role is selected
            if (userRole === 'provider') {
                userData.businessName = businessName;
                userData.businessType = businessType;
            }
            
            try {
                // Show loading state
                const submitButton = document.querySelector('.create-account-btn');
                submitButton.textContent = 'Creating Account...';
                submitButton.disabled = true;
                
                // Register user with Firebase
                const result = await registerWithEmailAndPassword(email, password, userData);
                
                if (result.success) {
                    alert('Account created successfully! Redirecting to login page...');
                    // Redirect to dashboard or home
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    alert(`Error: ${result.error}`);
                    submitButton.textContent = 'Create Account';
                    submitButton.disabled = false;
                }
            } catch (error) {
                alert(`An unexpected error occurred: ${error.message}`);
                const submitButton = document.querySelector('.create-account-btn');
                submitButton.textContent = 'Create Account';
                submitButton.disabled = false;
            }
        });
    }
    
    // Social login functionality
    const googleSignup = document.querySelector('.google-signup');
    const facebookSignup = document.querySelector('.facebook-signup');
    
    if (googleSignup) {
        googleSignup.addEventListener('click', async function() {
            try {
                const result = await signInWithGoogle();
                if (result.success) {
                    alert('Google sign-up successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                alert(`An unexpected error occurred: ${error.message}`);
            }
        });
    }
    
    if (facebookSignup) {
        facebookSignup.addEventListener('click', async function() {
            try {
                const result = await signInWithFacebook();
                if (result.success) {
                    alert('Facebook sign-up successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1500);
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                alert(`An unexpected error occurred: ${error.message}`);
            }
        });
    }
}); 