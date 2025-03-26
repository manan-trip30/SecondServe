document.addEventListener('DOMContentLoaded', function() {
    initImageUpload();
    setupFormValidation();
    setupFormSubmission();
    initMap();
    setupTimeInputs();
});

// Handle image upload functionality
function initImageUpload() {
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-upload');
    
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
    
    // Click on upload area triggers file input
    uploadArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // Handle the selected files
    function handleFiles(files) {
        const imagePreviewContainer = document.createElement('div');
        imagePreviewContainer.className = 'image-preview-container';
        
        // Clear existing previews if any
        const existingPreviews = uploadArea.querySelector('.image-preview-container');
        if (existingPreviews) {
            uploadArea.removeChild(existingPreviews);
        }
        
        // Hide upload placeholder
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        placeholder.style.display = 'none';
        
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
                    
                    // Show placeholder if no more previews
                    if (imagePreviewContainer.childElementCount === 0) {
                        placeholder.style.display = 'flex';
                        uploadArea.removeChild(imagePreviewContainer);
                    }
                });
                
                preview.appendChild(img);
                preview.appendChild(removeBtn);
                imagePreviewContainer.appendChild(preview);
            };
            
            reader.readAsDataURL(file);
        });
        
        uploadArea.appendChild(imagePreviewContainer);
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

// Handle form submission
function setupFormSubmission() {
    const form = document.querySelector('.donation-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if all required fields are filled
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
        
        // Additional validation for date fields
        const dateFields = form.querySelectorAll('input[type="date"]');
        dateFields.forEach(field => {
            if (field.value) {
                const selectedDate = new Date(field.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if ((selectedDate < today) && (field.id === 'bestBefore' || field.id === 'pickupDate')) {
                    field.classList.add('invalid');
                    let errorMsg = field.parentElement.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('p');
                        errorMsg.className = 'error-message';
                        field.parentElement.appendChild(errorMsg);
                        errorMsg.textContent = 'Date cannot be in the past';
                    }
                    
                    isValid = false;
                }
            }
        });
        
        // Check that "Available Until" is after "Available From"
        const fromTime = document.getElementById('availableFrom').value;
        const untilTime = document.getElementById('availableUntil').value;
        
        if (fromTime && untilTime && fromTime >= untilTime) {
            document.getElementById('availableUntil').classList.add('invalid');
            let errorMsg = document.getElementById('availableUntil').parentElement.parentElement.querySelector('.error-message');
            if (!errorMsg) {
                errorMsg = document.createElement('p');
                errorMsg.className = 'error-message';
                document.getElementById('availableUntil').parentElement.parentElement.appendChild(errorMsg);
            }
            errorMsg.textContent = 'End time must be after start time';
            
            isValid = false;
            
            // Scroll to the error
            document.getElementById('availableUntil').parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        
        if (isValid) {
            // Simulate form submission with a success message
            const successMsg = document.createElement('div');
            successMsg.className = 'success-message';
            successMsg.innerHTML = `
                <div class="success-icon">✓</div>
                <h3>Thank you for your donation!</h3>
                <p>Your food donation has been successfully submitted. We will notify you when someone claims it.</p>
                <button class="btn btn-primary">Return to Dashboard</button>
            `;
            
            // Replace form with success message
            form.style.display = 'none';
            form.parentElement.appendChild(successMsg);
            
            // Add event listener to the return button
            const returnBtn = successMsg.querySelector('button');
            returnBtn.addEventListener('click', function() {
                window.location.href = 'dashboard.html';
            });
            
            // In a real app, you would submit the form data to your server here
            // const formData = new FormData(form);
            // fetch('/api/donate', {
            //     method: 'POST',
            //     body: formData
            // }).then(response => {
            //     // Handle response
            // }).catch(error => {
            //     // Handle error
            // });
        } else {
            // Scroll to the first error
            const firstError = form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
    
    // Handle cancel button
    const cancelBtn = document.querySelector('.btn-outline');
    cancelBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to cancel? Your donation information will not be saved.')) {
            window.location.href = 'dashboard.html';
        }
    });
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