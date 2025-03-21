// ------------ login page ------------//
// Function to get appropriate greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
        return 'صباح الخير';
    } else if (hour >= 12 && hour < 17) {
        return 'مساء الخير'; 
    } else {
        return 'ليلة سعيدة';
    }
}

// Check if visitor is coming from register page and update greeting
document.addEventListener('DOMContentLoaded', () => {
    const mainText = document.querySelector('.maintxt');
    if (!mainText) return;

    // Check if coming from register page
    if (document.referrer.includes('register.html')) {
        mainText.textContent = 'تم التسجيل بنجاح';
    } else {
        mainText.textContent = getGreeting();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch(' http://ahmedvbasic.runasp.net/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Log in succeeded', data);
                window.location.href = 'main.html';
            } else {
                const errorData = await response.json();
                alert(`Log in failed: ${errorData.message || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert("Log in failed due to a network error");
        }
    });
});