document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  if (!form) {
    console.error("Form element not found! Check the ID.");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect form data
    const formData = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      phonenumber: document.getElementById("phonenumber").value,
      password: document.getElementById("password").value,
    };

    try {
      const response = await fetch(
        "http://storage432423.runasp.net/api/user/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Check if the response is OK (status code 200-299)
      if (response.ok) {
        const result = await response.json();
        alert(result.message || "Registration successful!");
        // Redirect or clear the form after successful registration
        window.location.href = login.html; // Example redirect
      } else {
        // Handle non-OK responses (e.g., 400, 500)
        const errorText = await response.text(); // Handle plain text or JSON errors
        console.error("Registration failed:", errorText);
        alert(`Registration failed: ${errorText}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to register due to a network or server error.");
    }
  });
});
