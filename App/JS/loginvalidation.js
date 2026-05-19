document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    if (!validateLogin()) return;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Try to authenticate against registered users
    const users = JSON.parse(localStorage.getItem('cc_users') || '[]');
    const found = users.find(u => u.username === username && u.password === password);
    if (found) {
        const user = { username: found.username, role: found.role || 'user' };
        localStorage.setItem('cc_user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
        return;
    }

    // Fallback: allow admin/admin for first-time demo
    if (username === 'admin' && password === 'admin'){
        const user = { username: 'admin', role: 'admin' };
        localStorage.setItem('cc_user', JSON.stringify(user));
        window.location.href = 'dashboard.html';
        return;
    }

    alert('Invalid username or password. Please register first.');
});

function validateLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const nameError = document.getElementById('name-error');
    const passwordError = document.getElementById('password-error');

    if (username === '') {
        nameError.innerHTML = 'Please enter a username.';
        return false;
    } else {
        nameError.innerHTML = '';
    }

    if (password === '') {
        passwordError.innerHTML = 'Please enter a password.';
        return false;
    } else {
        passwordError.innerHTML = '';
    }
    return true;
}