import { auth } from './firebase.js';
import { initSidebar } from './sidebar.js';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the sidebar for authenticated users
    setupAuthenticationState();
    
    // Initialize map if the map element exists
    if (document.getElementById('map')) {
        initMap();
    }

    // Toggle filter checkboxes
    const filterOptions = document.querySelectorAll('.filter-option');
    if (filterOptions) {
        filterOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                // Don't toggle if the click was directly on the checkbox
                if (e.target.type !== 'checkbox') {
                    const checkbox = this.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                }
                
                // Apply filters
                applyFilters();
            });
        });
    }

    // Initialize reserve buttons
    const reserveButtons = document.querySelectorAll('.food-card .btn-primary');
    if (reserveButtons) {
        reserveButtons.forEach(button => {
            button.addEventListener('click', function() {
                const foodName = this.closest('.food-info').querySelector('h3').textContent;
                alert(`You've successfully reserved ${foodName}! The food provider will be notified.`);
                this.textContent = 'Reserved';
                this.disabled = true;
                this.style.backgroundColor = '#4ECDC4';
            });
        });
    }
});

// Set up authentication state and UI
function setupAuthenticationState() {
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            handleAuthenticatedUser(user);
        } else {
            // User is signed out
            handleUnauthenticatedUser();
        }
    });
}

// Handle authenticated user
function handleAuthenticatedUser(user) {
    const headerRight = document.querySelector('.header-right');
    
    if (headerRight) {
        // Hide sign-up and sign-in buttons
        const signUpBtn = headerRight.querySelector('a[href="signup.html"]');
        const signInBtn = headerRight.querySelector('a[href="login.html"]');
        
        if (signUpBtn) signUpBtn.style.display = 'none';
        if (signInBtn) signInBtn.style.display = 'none';
        
        // Show user profile
        const userProfile = headerRight.querySelector('.user-profile');
        if (userProfile) {
            userProfile.style.display = 'flex';
            
            // Add a span with user email if it doesn't exist
            if (!userProfile.querySelector('span')) {
                const userNameSpan = document.createElement('span');
                userNameSpan.textContent = user.displayName || user.email;
                userProfile.appendChild(userNameSpan);
            }
        }
        
        // Initialize sidebar
        initSidebar();
    }
}

// Handle unauthenticated user
function handleUnauthenticatedUser() {
    const headerRight = document.querySelector('.header-right');
    
    if (headerRight) {
        // Show sign-up and sign-in buttons
        const signUpBtn = headerRight.querySelector('a[href="signup.html"]');
        const signInBtn = headerRight.querySelector('a[href="login.html"]');
        
        if (signUpBtn) signUpBtn.style.display = 'inline-flex';
        if (signInBtn) signInBtn.style.display = 'inline-flex';
        
        // Hide user profile
        const userProfile = headerRight.querySelector('.user-profile');
        if (userProfile) {
            userProfile.style.display = 'none';
        }
    }
}

// Map initialization (placeholder using a basic map style)
function initMap() {
    // Display a placeholder map - in a real environment, we would integrate Google Maps API
    const mapElement = document.getElementById('map');
    
    // Create a simple placeholder for the map
    mapElement.innerHTML = `
        <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; background-color: #e0e0e0; color: #666;">
            <div style="font-size: 2rem; margin-bottom: 1rem;"><i class="fas fa-map-marker-alt"></i></div>
            <p style="font-size: 1.2rem; font-weight: 500;">Map will appear here</p>
            <p style="font-size: 0.9rem;">In a real environment, this would be integrated with Google Maps API.</p>
        </div>
    `;

    // When integrated with Google Maps API, the code would look something like:
    /*
    const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 13,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{"color": "#444444"}]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{"color": "#f2f2f2"}]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [{"saturation": -100}, {"lightness": 45}]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [{"visibility": "simplified"}]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [{"visibility": "off"}]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{"color": "#4ECDC4"}, {"visibility": "on"}]
            }
        ]
    });

    // Add food markers to the map
    addFoodMarkers(map);
    */
}

// Function to filter food cards
function applyFilters() {
    const filters = {
        vegetarian: document.getElementById('filter-vegetarian').checked,
        vegan: document.getElementById('filter-vegan').checked,
        glutenFree: document.getElementById('filter-gluten-free').checked,
        dairyFree: document.getElementById('filter-dairy-free').checked,
        nutsFree: document.getElementById('filter-nuts-free').checked
    };

    // For demo purposes, we'll just log the current filter state
    console.log('Filters applied:', filters);
    
    // In a real application, we would filter the food cards based on the selected filters
    // This is just a placeholder showing what would happen
    const foodCards = document.querySelectorAll('.food-card');
    
    // Simulate filtering based on random attributes for demo purposes
    foodCards.forEach(card => {
        // Generate random attributes for each card (for demo only)
        const hasAttributes = {
            vegetarian: Math.random() > 0.5,
            vegan: Math.random() > 0.7,
            glutenFree: Math.random() > 0.4,
            dairyFree: Math.random() > 0.6,
            nutsFree: Math.random() > 0.3
        };
        
        // Check if the card should be displayed
        let shouldDisplay = true;
        for (const [filter, isActive] of Object.entries(filters)) {
            if (isActive && !hasAttributes[filter]) {
                shouldDisplay = false;
                break;
            }
        }
        
        // Apply visible/hidden state with a transition effect
        if (shouldDisplay) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 10);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
} 