document.addEventListener('DOMContentLoaded', function() {
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
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simple validation
            if (!email || !password) {
                alert('Please fill in all required fields');
                return;
            }
            
            // In a real app, we would send this data to a server for authentication
            console.log('Login attempt:', { email, password, rememberMe });
            
            // Simulate successful login
            document.querySelector('.sign-in-btn').textContent = 'Signing in...';
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        });
    }
    
    // Social login functionality (placeholder)
    const googleLogin = document.querySelector('.google-login');
    const facebookLogin = document.querySelector('.facebook-login');
    
    if (googleLogin) {
        googleLogin.addEventListener('click', function() {
            alert('Google sign in would be initiated here');
        });
    }
    
    if (facebookLogin) {
        facebookLogin.addEventListener('click', function() {
            alert('Facebook sign in would be initiated here');
        });
    }
}); 