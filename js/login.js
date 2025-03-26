import { loginWithEmailAndPassword, signInWithGoogle } from './firebase.js';
import { redirectIfAuthenticated } from './auth.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    redirectIfAuthenticated();
    
    // Password visibility toggle
    const passwordField = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    
    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            
            // Change the eye icon
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    }
    
    // Form submission handling
    const loginForm = document.querySelector('.login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all required fields');
                return;
            }
            
            try {
                // Show loading state
                const signInBtn = document.querySelector('.sign-in-btn');
                signInBtn.textContent = 'Signing in...';
                signInBtn.disabled = true;
                
                // Authenticate with Firebase
                const result = await loginWithEmailAndPassword(email, password);
                
                if (result.success) {
                    // Save remember me preference
                    if (rememberMe) {
                        localStorage.setItem('rememberMe', 'true');
                    } else {
                        localStorage.removeItem('rememberMe');
                    }
                    
                    console.log('Login successful');
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    alert(`Error: ${result.error}`);
                    signInBtn.textContent = 'Sign in';
                    signInBtn.disabled = false;
                }
            } catch (error) {
                alert(`An unexpected error occurred: ${error.message}`);
                const signInBtn = document.querySelector('.sign-in-btn');
                signInBtn.textContent = 'Sign in';
                signInBtn.disabled = false;
            }
        });
    }
    
    // Social login functionality
    const googleLogin = document.querySelector('.google-login');
    
    if (googleLogin) {
        googleLogin.addEventListener('click', async function() {
            try {
                const result = await signInWithGoogle();
                if (result.success) {
                    console.log('Google sign-in successful');
                    // Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                alert(`An unexpected error occurred: ${error.message}`);
            }
        });
    }
});