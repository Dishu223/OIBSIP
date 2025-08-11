const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');
const passwordToggle = document.getElementById('password-toggle');
const rememberMeCheckbox = document.getElementById('remember-me');

passwordToggle.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    passwordToggle.classList.toggle('bx-show');
    passwordToggle.classList.toggle('bx-hide');
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);
    
    if (!user) {
        message.textContent = 'No account found with that email.';
        message.className = 'message error';
        return;
    }

    const hashedPassword = password.split('').reverse().join('');
    if (user.password === hashedPassword) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('loggedInUser', user.username);
        window.location.href = 'welcome.html';
    } else {
        message.textContent = 'Incorrect password.';
        message.className = 'message error';
    }
});

document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', () => {
        alert('This is just a UI demonstration.');
    });
});