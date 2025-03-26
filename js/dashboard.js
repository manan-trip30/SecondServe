import { protectPage, getCurrentUser } from './auth.js';
import { auth } from './firebase.js';
import { initSidebar } from './sidebar.js';

document.addEventListener('DOMContentLoaded', function() {
    // Protect this page from unauthenticated users
    protectPage();
    
    // Update user information in the header
    updateUserProfile();
    
    // Initialize the sidebar
    initSidebar();
    
    // Initialize the impact chart
    initImpactChart();
    
    // Handle action buttons
    const actionButtons = document.querySelectorAll('.action-button');
    actionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.querySelector('span').textContent.trim();
            
            switch(action) {
                case 'Add New Listing':
                    window.location.href = '#add-listing';
                    break;
                case 'View History':
                    window.location.href = '#history';
                    break;
                case 'Analytics':
                    window.location.href = '#analytics';
                    break;
                case 'Settings':
                    window.location.href = '#settings';
                    break;
            }
        });
    });
    
    // Add New Food button in header
    const addNewFoodBtn = document.querySelector('.header-right .btn-primary');
    if (addNewFoodBtn) {
        addNewFoodBtn.addEventListener('click', function() {
            window.location.href = '#add-listing';
        });
    }
    
    // Add logout functionality
    setupLogoutHandler();
});

// Update user profile information based on Firebase auth
function updateUserProfile() {
    const user = getCurrentUser();
    const userProfileElement = document.querySelector('.user-profile span');
    
    if (user && userProfileElement) {
        // If we have user data in Firestore, we could retrieve more details here
        // For now, just use the email as display name
        userProfileElement.textContent = user.displayName || user.email;
        
        // Create a dropdown menu for user profile
        const userProfile = document.querySelector('.user-profile');
        if (userProfile) {
            createUserDropdown(userProfile);
        }
    }
}

// Create user dropdown menu
function createUserDropdown(userProfile) {
    // Create dropdown if it doesn't exist
    if (!document.querySelector('.user-dropdown')) {
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <ul>
                <li><a href="#profile"><i class="fas fa-user"></i> My Profile</a></li>
                <li><a href="#settings"><i class="fas fa-cog"></i> Settings</a></li>
                <li><a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
            </ul>
        `;
        
        userProfile.appendChild(dropdown);
        
        // Toggle dropdown visibility on click
        userProfile.addEventListener('click', function() {
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!userProfile.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Setup logout handler
function setupLogoutHandler() {
    // Use event delegation to handle the logout button click
    document.body.addEventListener('click', async function(e) {
        if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
            e.preventDefault();
            
            try {
                await auth.signOut();
                // Redirect to login page
                window.location.href = 'login.html';
            } catch (error) {
                console.error('Logout error:', error);
                alert('An error occurred while trying to log out.');
            }
        }
    });
}

// Initialize the impact chart with the line graph
function initImpactChart() {
    const ctx = document.getElementById('impactChart');
    
    if (!ctx) return;
    
    // Sample data for the chart
    const data = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Impact (kg)',
            data: [100, 120, 115, 115, 118, 125, 135],
            borderColor: '#FF8A00',
            backgroundColor: 'rgba(255, 138, 0, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#FF8A00',
            pointBorderWidth: 2,
            pointRadius: 4
        }]
    };
    
    // Chart configuration
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    titleColor: '#333',
                    bodyColor: '#666',
                    borderColor: '#ddd',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            return context.parsed.y + ' kg';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#999'
                    }
                },
                y: {
                    beginAtZero: true,
                    max: 300,
                    grid: {
                        color: '#f0f0f0'
                    },
                    ticks: {
                        stepSize: 100,
                        color: '#999'
                    }
                }
            }
        }
    };
    
    // Create the chart
    new Chart(ctx, config);
} 