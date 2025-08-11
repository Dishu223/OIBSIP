const forgotForm = document.getElementById('forgot-form');
const emailInput = document.getElementById('email');
const message = document.getElementById('message');
const resultContainer = document.getElementById('result-container');
const recoveredPasswordDisplay = document.getElementById('recovered-password');

forgotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email);

    message.textContent = '';
    resultContainer.style.display = 'none';

    if (user) {
        const password = user.password.split('').reverse().join('');
        recoveredPasswordDisplay.textContent = password;
        resultContainer.style.display = 'block';
    } else {
        message.textContent = 'No account found with that email.';
        message.className = 'message error';
    }
});