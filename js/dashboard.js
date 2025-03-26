document.addEventListener('DOMContentLoaded', function() {
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
});

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