import { auth, db } from './firebase.js';
import { doc, getDoc } from 'firebase/firestore';

// Create sidebar HTML structure
function createSidebar() {
    const sidebarHTML = `
        <div class="sidebar-overlay" id="sidebar-overlay"></div>
        <div class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <h2>Profile</h2>
                <button class="close-sidebar" id="close-sidebar">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="user-info">
                <img src="images/user-profile.jpg" alt="User Avatar" class="user-avatar" id="user-avatar">
                <h3 class="user-name" id="user-name">Loading...</h3>
                <span class="user-role" id="user-role">Loading...</span>
                <div class="user-stats">
                    <div class="stat-item">
                        <p class="stat-value" id="donations-count">0</p>
                        <p class="stat-label">Donations</p>
                    </div>
                    <div class="stat-item">
                        <p class="stat-value" id="impact-value">0</p>
                        <p class="stat-label">kg Saved</p>
                    </div>
                </div>
            </div>
            
            <!-- Provider-specific sections -->
            <div class="sidebar-section provider-section">
                <h3>My Donations</h3>
                <ul class="sidebar-menu">
                    <li>
                        <a href="dashboard.html">
                            <i class="fas fa-chart-pie"></i>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="donate.html">
                            <i class="fas fa-plus-circle"></i>
                            Add New Donation
                        </a>
                    </li>
                    <li>
                        <a href="#donation-history">
                            <i class="fas fa-history"></i>
                            Donation History
                        </a>
                    </li>
                </ul>
            </div>
            
            <!-- Receiver-specific sections -->
            <div class="sidebar-section receiver-section">
                <h3>Find Food</h3>
                <ul class="sidebar-menu">
                    <li>
                        <a href="dashboard.html">
                            <i class="fas fa-chart-pie"></i>
                            Dashboard
                        </a>
                    </li>
                    <li>
                        <a href="#find-food">
                            <i class="fas fa-search"></i>
                            Find Food
                        </a>
                    </li>
                    <li>
                        <a href="#reservations">
                            <i class="fas fa-calendar-check"></i>
                            My Reservations
                        </a>
                    </li>
                </ul>
            </div>
            
            <!-- Common sections -->
            <div class="sidebar-section">
                <h3>Account</h3>
                <ul class="sidebar-menu">
                    <li>
                        <a href="#profile-settings">
                            <i class="fas fa-user-cog"></i>
                            Profile Settings
                        </a>
                    </li>
                    <li>
                        <a href="#notifications">
                            <i class="fas fa-bell"></i>
                            Notifications
                        </a>
                    </li>
                    <li>
                        <a href="#preferences">
                            <i class="fas fa-sliders-h"></i>
                            Preferences
                        </a>
                    </li>
                </ul>
            </div>
            
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span class="contact-label">Email:</span>
                    <span id="user-email">loading@example.com</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span class="contact-label">Phone:</span>
                    <span id="user-phone">Loading...</span>
                </div>
                <div class="contact-item provider-section">
                    <i class="fas fa-building"></i>
                    <span class="contact-label">Business:</span>
                    <span id="user-business">Loading...</span>
                </div>
            </div>
            
            <div class="sidebar-footer">
                <button class="logout-btn" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>
    `;
    
    // Add sidebar to body
    document.body.insertAdjacentHTML('beforeend', sidebarHTML);
}

// Initialize sidebar
export function initSidebar() {
    // Create sidebar HTML
    createSidebar();
    
    // Get DOM elements
    const userProfileBtn = document.querySelector('.user-profile');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const logoutBtn = document.getElementById('logout-btn');
    
    // If user profile button exists, add event listener
    if (userProfileBtn) {
        userProfileBtn.addEventListener('click', openSidebar);
    }
    
    // Close sidebar on overlay click
    sidebarOverlay.addEventListener('click', closeSidebar);
    
    // Close sidebar on close button click
    closeSidebarBtn.addEventListener('click', closeSidebar);
    
    // Handle logout button click
    logoutBtn.addEventListener('click', async () => {
        try {
            // Using auth.signOut() directly
            await auth.signOut();
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Logout error:', error);
            alert(`Error logging out: ${error.message}`);
        }
    });
    
    // Subscribe to auth state changes
    auth.onAuthStateChanged(user => {
        if (user) {
            loadUserData(user.uid);
        } else {
            console.log('User not logged in');
        }
    });
}

// Open sidebar
function openSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.add('active');
    sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Close sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Allow scrolling again
}

// Load user data from Firestore
async function loadUserData(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        
        if (userDoc.exists()) {
            const userData = userDoc.data();
            updateSidebarWithUserData(userData);
            
            // Fetch user's stats
            await loadUserStats(userId, userData.role);
        } else {
            console.error('User document not found');
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update sidebar with user data
function updateSidebarWithUserData(userData) {
    // Update user name
    const userNameElement = document.getElementById('user-name');
    userNameElement.textContent = userData.fullName || 'User';
    
    // Update user role
    const userRoleElement = document.getElementById('user-role');
    const sidebarElement = document.getElementById('sidebar');
    
    if (userData.role === 'provider') {
        userRoleElement.textContent = 'Food Provider';
        sidebarElement.classList.add('user-role-provider');
        sidebarElement.classList.remove('user-role-receiver');
    } else {
        userRoleElement.textContent = 'Food Receiver';
        sidebarElement.classList.add('user-role-receiver');
        sidebarElement.classList.remove('user-role-provider');
    }
    
    // Update contact info
    const userEmailElement = document.getElementById('user-email');
    userEmailElement.textContent = userData.email || 'No email provided';
    
    const userPhoneElement = document.getElementById('user-phone');
    userPhoneElement.textContent = userData.phone || 'No phone provided';
    
    const userBusinessElement = document.getElementById('user-business');
    if (userBusinessElement) {
        userBusinessElement.textContent = userData.businessName || 'N/A';
    }
}

// Load user statistics
async function loadUserStats(userId, role) {
    // For this example, we're using placeholder values
    // In a real app, you would fetch these from your database
    
    const donationsCountElement = document.getElementById('donations-count');
    const impactValueElement = document.getElementById('impact-value');
    
    if (role === 'provider') {
        // Simulate fetching donation count for providers
        donationsCountElement.textContent = Math.floor(Math.random() * 10);
        impactValueElement.textContent = Math.floor(Math.random() * 100);
    } else {
        // For receivers, show different stats
        donationsCountElement.textContent = Math.floor(Math.random() * 5);
        impactValueElement.textContent = Math.floor(Math.random() * 50);
    }
    
    // In a real app, you would fetch actual stats from Firestore
    // Example:
    // const donationsQuery = query(
    //     collection(db, 'donations'),
    //     where('userId', '==', userId)
    // );
    // const querySnapshot = await getDocs(donationsQuery);
    // donationsCountElement.textContent = querySnapshot.size;
}

// Export functions
export { openSidebar, closeSidebar }; 