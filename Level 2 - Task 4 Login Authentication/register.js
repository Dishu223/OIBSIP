const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const message = document.getElementById('message');
const passwordToggle = document.getElementById('password-toggle');
const strengthBar = document.querySelector('.strength-bar');
const strengthText = document.querySelector('.strength-text');

passwordToggle.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    passwordToggle.classList.toggle('bx-show');
    passwordToggle.classList.toggle('bx-hide');
});

passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    switch(strength) {
        case 0:
        case 1:
            strengthBar.style.width = '25%';
            strengthBar.style.backgroundColor = 'var(--strength-weak)';
            strengthText.textContent = 'Weak';
            break;
        case 2:
            strengthBar.style.width = '50%';
            strengthBar.style.backgroundColor = 'var(--strength-medium)';
            strengthText.textContent = 'Medium';
            break;
        case 3:
            strengthBar.style.width = '75%';
            strengthBar.style.backgroundColor = 'var(--strength-strong)';
            strengthText.textContent = 'Strong';
            break;
        case 4:
            strengthBar.style.width = '100%';
            strengthBar.style.backgroundColor = 'var(--strength-strong)';
            strengthText.textContent = 'Very Strong';
            break;
    }
});

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = usernameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.find(user => user.email === email);
    if (userExists) {
        message.textContent = 'Email is already registered.';
        message.className = 'message error';
        return;
    }
    
    const hashedPassword = password.split('').reverse().join('');
    const newUser = { username, email, password: hashedPassword };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    message.textContent = 'Registration successful! Redirecting to login...';
    message.className = 'message success';
    setTimeout(() => { window.location.href = 'index.html'; }, 2000);
});

document.querySelectorAll('.social-btn').forEach(button => {
    button.addEventListener('click', () => {
        alert('This is a just a UI demonstration');
    });
});