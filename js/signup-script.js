document.querySelector('.signup--form').addEventListener('submit', function (e) {
    e.preventDefault();     

    const username = document.getElementById('signup--username').value.trim();
    const email = document.getElementById('signup--email').value.trim();
    const password = document.getElementById('signup--password').value;
    const confirmPassword = document.getElementById('signup--conf-password').value;

    document.getElementById('usernameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('passwordError').textContent = '';
    document.getElementById('confirmPasswordError').textContent = '';
    document.getElementById('successMessage').textContent = '';
  
    let hasError = false;

    if (!username) {
        document.getElementById('usernameError').textContent = 'Username is required.';
        hasError = true;
    }
    if (!email || !email.includes('@')) {
        document.getElementById('emailError').textContent = 'Valid email is required.';
        hasError = true;
    }
    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password must be at least 6 characters.';
        hasError = true;
    }
    if (confirmPassword !== password) {
        document.getElementById('confirmPasswordError').textContent = 'Passwords do not match.';
        hasError = true;
    }
    if (!hasError) {
        const userData = {
            username,
            email,
            password
        };
        document.getElementById('successMessage').textContent = 'Account successfully created!';
        e.target.reset();
    }
  });