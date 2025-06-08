document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (data.success) {
      // Redirect based on user role
      if (data.role === 'manager') {
        window.location.href = '../html/management.html';
      } else {
        window.location.href = '../html/menu.html';
      }
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Failed to connect to server');
  }
});
const passwordInput = document.getElementById('password');
const togglePassword = document.getElementById('togglePassword');
const eyeOpen = document.getElementById('eyeOpen');
const eyeClosed = document.getElementById('eyeClosed');

togglePassword.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';

  // Toggle icons
  eyeOpen.style.display = isPassword ? 'inline' : 'none';
  eyeClosed.style.display = isPassword ? 'none' : 'inline';
});