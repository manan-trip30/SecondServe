import { protectPage, getCurrentUser } from './auth.js';
import { auth } from './firebase.js';
import { createDonation } from './firestore.js';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { initSidebar } from './sidebar.js';

document.addEventListener('DOMContentLoaded', function() {
    // Protect this page - require authentication
    protectPage();
    
    // Update user display name
    updateUserDisplay();
    
    // Initialize the sidebar
    initSidebar();
    
    // Initialize the donation form functionality
    initImageUpload();
    setupFormValidation();
    setupFormSubmission();
    initMap();
    setupTimeInputs();
});

// Update the user display name
function updateUserDisplay() {
    const user = getCurrentUser();
    const userNameElement = document.getElementById('user-name');
    
    if (user && userNameElement) {
        userNameElement.textContent = user.displayName || user.email;
    }
}

// Handle image upload functionality
function initImageUpload() {
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-upload');
    const previewContainer = document.getElementById('image-preview');
    
    // Handle drag and drop events
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        const files = e.dataTransfer.files;
        if (files.length) {
            handleFiles(files);
        }
    });
    
    // Handle file input change
    fileInput.addEventListener('change', function() {
        if (this.files.length) {
            handleFiles(this.files);
        }
    });
    
    // Click on upload button triggers file input
    document.querySelector('.upload-btn').addEventListener('click', function(e) {
        e.stopPropagation();
        fileInput.click();
    });
    
    // Handle the selected files
    function handleFiles(files) {
        // Clear existing previews if any
        previewContainer.innerHTML = '';
        
        // Show preview container
        previewContainer.style.display = 'flex';
        
        // Create previews for each file
        Array.from(files).forEach(file => {
            if (!file.type.match('image.*')) {
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                
                const img = document.createElement('img');
                img.src = e.target.result;
                img.alt = file.name;
                
                const removeBtn = document.createElement('button');
                removeBtn.className = 'remove-image';
                removeBtn.innerHTML = '&times;';
                removeBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    preview.remove();
                    
                    // Hide preview container if no more previews
                    if (previewContainer.childElementCount === 0) {
                        previewContainer.style.display = 'none';
                    }
                });
                
                preview.appendChild(img);
                preview.appendChild(removeBtn);
                previewContainer.appendChild(preview);
            };
            
            reader.readAsDataURL(file);
        });
    }
}

// Handle form validation
function setupFormValidation() {
    const form = document.querySelector('.donation-form');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Add validation styles to each required field
    requiredFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (!field.value.trim()) {
                field.classList.add('invalid');
                
                // Create or update error message
                let errorMsg = field.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('p');
                    errorMsg.className = 'error-message';
                    field.parentElement.appendChild(errorMsg);
                }
                errorMsg.textContent = 'This field is required';
            } else {
                field.classList.remove('invalid');
                const errorMsg = field.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
        
        // Clear validation on input
        field.addEventListener('input', function() {
            field.classList.remove('invalid');
            const errorMsg = field.parentElement.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        });
    });
    
    // Additional validation for date fields
    const dateFields = form.querySelectorAll('input[type="date"]');
    dateFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (field.value) {
                const selectedDate = new Date(field.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today && field.id === 'bestBefore') {
                    field.classList.add('invalid');
                    let errorMsg = field.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('p');
                        errorMsg.className = 'error-message';
                        field.parentElement.appendChild(errorMsg);
                    }
                    errorMsg.textContent = 'Date cannot be in the past';
                }
                
                if (selectedDate < today && field.id === 'pickupDate') {
                    field.classList.add('invalid');
                    let errorMsg = field.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('p');
                        errorMsg.className = 'error-message';
                        field.parentElement.appendChild(errorMsg);
                    }
                    errorMsg.textContent = 'Pickup date cannot be in the past';
                }
            }
        });
    });
}

// Handle form submission with Firebase
async function setupFormSubmission() {
    const form = document.getElementById('donation-form');
    const donateBtn = document.getElementById('donate-btn');
    const draftBtn = document.getElementById('save-draft-btn');
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Basic form validation
        if (!validateForm()) {
            return;
        }
        
        // Get the current user
        const user = getCurrentUser();
        if (!user) {
            alert('You must be logged in to donate food');
            window.location.href = 'login.html';
            return;
        }
        
        // Show loading state
        donateBtn.disabled = true;
        donateBtn.textContent = 'Submitting...';
        
        try {
            // Get form data
            const formData = new FormData(form);
            const donationData = {
                foodName: formData.get('foodName'),
                description: formData.get('description'),
                quantity: formData.get('quantity'),
                quantityUnit: formData.get('quantityUnit'),
                bestBefore: formData.get('bestBefore'),
                category: formData.get('category'),
                pickupLocation: formData.get('pickupLocation'),
                availableFrom: formData.get('availableFrom'),
                availableUntil: formData.get('availableUntil'),
                canDeliver: formData.get('canDeliver') === 'on',
                pickupInstructions: formData.get('pickupInstructions') || '',
                userId: user.uid,
                userEmail: user.email,
                status: 'available'
            };
            
            // Upload images first (if any)
            const fileInput = document.getElementById('file-upload');
            const imageUrls = [];
            
            if (fileInput.files.length > 0) {
                const storage = getStorage();
                
                for (let i = 0; i < fileInput.files.length; i++) {
                    const file = fileInput.files[i];
                    const fileExtension = file.name.split('.').pop();
                    const fileName = `donations/${user.uid}/${Date.now()}-${i}.${fileExtension}`;
                    const storageRef = ref(storage, fileName);
                    
                    // Upload the file
                    const uploadTask = uploadBytesResumable(storageRef, file);
                    
                    // Get the download URL after upload completes
                    const downloadURL = await new Promise((resolve, reject) => {
                        uploadTask.on('state_changed',
                            (snapshot) => {
                                // Handle progress
                                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                console.log('Upload is ' + progress + '% done');
                            },
                            (error) => {
                                // Handle error
                                reject(error);
                            },
                            async () => {
                                // Upload completed successfully, get download URL
                                const url = await getDownloadURL(uploadTask.snapshot.ref);
                                resolve(url);
                            }
                        );
                    });
                    
                    imageUrls.push(downloadURL);
                }
            }
            
            // Add image URLs to donation data
            donationData.images = imageUrls;
            
            // Submit donation to Firestore
            const result = await createDonation(donationData);
            
            if (result.success) {
                // Show success message
                showSuccessMessage('Your donation has been submitted successfully!');
                
                // Reset form
                form.reset();
                const previewContainer = document.getElementById('image-preview');
                previewContainer.innerHTML = '';
                previewContainer.style.display = 'none';
                
                // Redirect to dashboard after a delay
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 2000);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            // Show error message
            showErrorMessage(`Error submitting donation: ${error.message}`);
        } finally {
            // Reset button state
            donateBtn.disabled = false;
            donateBtn.textContent = 'Donate Now';
        }
    });
    
    // Save as draft functionality
    draftBtn.addEventListener('click', function() {
        // Implement draft saving logic here
        alert('This feature is coming soon!');
    });
    
    // Form validation helper
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('invalid');
                
                // Create error message if it doesn't exist
                let errorMsg = field.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('p');
                    errorMsg.className = 'error-message';
                    field.parentElement.appendChild(errorMsg);
                    errorMsg.textContent = 'This field is required';
                }
                
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Success message helper
    function showSuccessMessage(message) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = message;
        
        // Add to the page
        document.querySelector('.donation-form-container').appendChild(successMsg);
        
        // Remove after 5 seconds
        setTimeout(() => {
            successMsg.remove();
        }, 5000);
    }
    
    // Error message helper
    function showErrorMessage(message) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message global-error';
        errorMsg.textContent = message;
        
        // Add to the page
        document.querySelector('.donation-form-container').appendChild(errorMsg);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorMsg.remove();
        }, 5000);
    }
}

// Handle category selection
document.addEventListener('DOMContentLoaded', function() {
    const categoryOptions = document.querySelectorAll('.category-option');
    
    categoryOptions.forEach(option => {
        option.addEventListener('click', function() {
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Remove 'selected' class from all options
            categoryOptions.forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add 'selected' class to the clicked option
            this.classList.add('selected');
        });
    });
});

// Initialize map functionality
function initMap() {
    const locationInput = document.getElementById('pickupLocation');
    
    // Use browser geolocation to get current location
    if (navigator.geolocation) {
        // Add a "Use my location" button
        const useLocationBtn = document.createElement('button');
        useLocationBtn.type = 'button';
        useLocationBtn.className = 'btn use-location-btn';
        useLocationBtn.textContent = 'Use my location';
        useLocationBtn.style.fontSize = '0.85rem';
        useLocationBtn.style.padding = '0.5rem 0.75rem';
        useLocationBtn.style.marginTop = '0.5rem';
        
        locationInput.parentElement.insertBefore(useLocationBtn, locationInput.nextSibling);
        
        useLocationBtn.addEventListener('click', function() {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    // In a real application, we would reverse geocode these coordinates
                    // to get an actual address and update the map with the user's position
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    locationInput.value = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
                    
                    // Simulate updating the map with a message
                    showMapMessage('Location updated! In a real app, the map would show your current position.');
                },
                function(error) {
                    showMapMessage('Could not get your location. Please enter it manually.', true);
                }
            );
        });
    }
    
    // Simulate map interaction when address is entered
    locationInput.addEventListener('blur', function() {
        if (locationInput.value.trim() !== '') {
            showMapMessage('Address received! In a real app, the map would update to show this location.');
        }
    });
    
    // Helper function to show map messages
    function showMapMessage(message, isError = false) {
        const mapContainer = document.querySelector('.location-map');
        const existingMsg = mapContainer.querySelector('.map-message');
        
        if (existingMsg) {
            mapContainer.removeChild(existingMsg);
        }
        
        const messageElement = document.createElement('div');
        messageElement.className = `map-message ${isError ? 'map-error' : ''}`;
        messageElement.textContent = message;
        messageElement.style.position = 'absolute';
        messageElement.style.bottom = '10px';
        messageElement.style.left = '10px';
        messageElement.style.right = '10px';
        messageElement.style.background = isError ? 'rgba(255,59,48,0.8)' : 'rgba(0,0,0,0.7)';
        messageElement.style.color = 'white';
        messageElement.style.padding = '8px 12px';
        messageElement.style.borderRadius = '4px';
        messageElement.style.fontSize = '0.9rem';
        
        // Make the map container position relative for absolute positioning of the message
        mapContainer.style.position = 'relative';
        
        mapContainer.appendChild(messageElement);
        
        // Auto-hide the message after 5 seconds
        setTimeout(function() {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }
}

// Handle time input controls
function setupTimeInputs() {
    const timeInputs = document.querySelectorAll('.time-input input[type="time"]');
    const timeToggles = document.querySelectorAll('.time-toggle');
    
    // Set up time picker buttons
    timeToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', function() {
            // This would typically open a custom time picker
            // For now, we'll just focus the associated input to open the browser's time picker
            const timeInput = this.closest('.time-input').querySelector('input[type="time"]');
            timeInput.focus();
        });
    });
    
    // Set default times if not already set
    if (timeInputs[0] && !timeInputs[0].value) {
        // Set "Available From" to current hour
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        timeInputs[0].value = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    }
    
    if (timeInputs[1] && !timeInputs[1].value) {
        // Set "Available Until" to current hour + 2 hours
        const now = new Date();
        now.setHours(now.getHours() + 2);
        const laterHour = now.getHours();
        const currentMinute = now.getMinutes();
        timeInputs[1].value = `${String(laterHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    }
    
    // Validate that "Available Until" is after "Available From"
    if (timeInputs[0] && timeInputs[1]) {
        timeInputs[1].addEventListener('change', function() {
            const fromTime = timeInputs[0].value;
            const untilTime = timeInputs[1].value;
            
            if (fromTime && untilTime && fromTime >= untilTime) {
                timeInputs[1].classList.add('invalid');
                let errorMsg = timeInputs[1].parentElement.parentElement.querySelector('.error-message');
                if (!errorMsg) {
                    errorMsg = document.createElement('p');
                    errorMsg.className = 'error-message';
                    timeInputs[1].parentElement.parentElement.appendChild(errorMsg);
                }
                errorMsg.textContent = 'End time must be after start time';
            } else {
                timeInputs[1].classList.remove('invalid');
                const errorMsg = timeInputs[1].parentElement.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.remove();
                }
            }
        });
    }
}