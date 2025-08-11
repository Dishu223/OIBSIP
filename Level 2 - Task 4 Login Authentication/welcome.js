const usernameDisplay = document.getElementById('username-display');
const logoutButton = document.getElementById('logout-button');

const loggedInUser = sessionStorage.getItem('loggedInUser') || localStorage.getItem('loggedInUser');

if (!loggedInUser) {
    window.location.href = 'index.html';
} else {
    usernameDisplay.textContent = loggedInUser;
}

logoutButton.addEventListener('click', () => {
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
});