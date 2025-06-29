document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  try {
    const res = await fetch('http://localhost:3000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password, confirmPassword }), //Capture form submission
    });

    const data = await res.json();

    if (data.success) {
      alert('Signup successful! Please log in.');
      window.location.href = '../html/login.html'; // Redirect to login page
    } else {
      alert(data.message || 'Signup failed');
    }
  } catch (err) {
    alert('Error connecting to server.');
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