document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".signup--form");
    const username = document.getElementById("signup--username");
    const email = document.getElementById("signup--email");
    const password = document.getElementById("signup--password");
    const confirmPassword = document.getElementById("signup--conf-password");
    const usernameError = document.getElementById("usernameError");
    const emailError = document.getElementById("emailError");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    const successMessage = document.getElementById("successMessage");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        usernameError.style.display = "none";
        emailError.style.display = "none";
        passwordError.style.display = "none";
        confirmPasswordError.style.display = "none";
        successMessage.innerText = "";

        let valid = true;

        if (username.value.trim().length < 3) {
            usernameError.innerText = "Username must be at least 3 characters.";
            usernameError.style.display = "block";
            valid = false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value.trim())) {
            emailError.innerText = "Please enter a valid email address.";
            emailError.style.display = "block";
            valid = false;
        }
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password.value)) {
            passwordError.innerText = "Password must be at least 6 characters, with a capital letter and a number.";
            passwordError.style.display = "block";
            valid = false;
        }
        if (password.value !== confirmPassword.value) {
            confirmPasswordError.innerText = "Passwords do not match.";
            confirmPasswordError.style.display = "block";
            valid = false;
        }
        if (valid) {
            successMessage.innerText = "You've successfully signed up!";
            form.reset();
        }
    });
});
