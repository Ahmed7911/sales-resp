// Function to handle registration form submission
async function handleRegistration(event) {
    event.preventDefault();

    // Get form values and trim spaces
    const username = document.getElementById('username')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const password = document.getElementById('password')?.value.trim();

    // Validate required fields
    if (!username || !email || !password) {
        alert('Please fill in all required fields');
        return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Prepare registration data
    const registrationData = {
        username,
        email,
        password
    };

    try {
        // Send POST request to registration API endpoint
        const response = await fetch('http://ahmedvbasic.runasp.net/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });

        if (!response.ok) {
            throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Registration successful:', result);
        
        // Clear form
        document.getElementById('registrationForm').reset();
        
        // Show success message to user
        alert('Registration successful! Redirecting to login...');

        // Redirect to login page after a short delay
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);

    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    if (form) {
        form.addEventListener('submit', handleRegistration);
    } else {
        console.error('Registration form not found!');
    }
});
