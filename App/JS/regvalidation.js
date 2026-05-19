document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!validateRegistration()) return;
    const username = document.getElementById('r_username').value.trim();
    const email = document.getElementById('r_email').value.trim();
    const password = document.getElementById('r_password').value.trim();
    const result = registerUser({ username, email, password });
    const bothError = document.getElementById('both-error');
    if (result.success) {
        bothError.style.color = 'green';
        bothError.innerHTML = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
            window.location.href = 'loginpage.html';
        }, 800);
        return;
    }
    bothError.style.color = 'red';
    bothError.innerHTML = result.message || 'Registration failed.';
});

function validateRegistration() {
    const username = document.getElementById('r_username').value.trim();
    const email = document.getElementById('r_email').value.trim();
    const password = document.getElementById('r_password').value.trim();
    const password2 = document.getElementById('r_password2').value.trim();
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const bothError = document.getElementById('both-error');

    let valid = true;   
    if (username === '') {
        nameError.innerHTML = 'Please enter a username.';
        valid = false;
    } else {
        nameError.innerHTML = '';
    }   
    if (email === '') {
        emailError.innerHTML = 'Please enter an email.';
        valid = false;
    }
    else if (!/\S+@\S+\.\S+/.test(email)) {
        emailError.innerHTML = 'Please enter a valid email.';
        valid = false;
    }
    else {
        emailError.innerHTML = '';
    }
    if (password === '') {
        passwordError.innerHTML = 'Please enter a password.';
        valid = false;
    } else {
        passwordError.innerHTML = '';
    }
    if (password2 === '') {
        bothError.innerHTML = 'Please confirm your password.';
        valid = false;
    } else if (password !== password2) {
        bothError.innerHTML = 'Passwords do not match.';
        valid = false;
    } else {
        bothError.innerHTML = '';
    }
    return valid;
}