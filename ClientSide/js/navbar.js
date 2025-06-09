// ClientSide/js/navbar.js
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res  = await fetch('/api/check-auth');
    const data = await res.json();

    if (data.loggedIn && data.user.role === 'manager') {
      // find your navLinks container
      const navLinks = document.querySelector('.navLinks');
      if (!navLinks) return;

      // build the new link
      const div = document.createElement('div');
      div.classList.add('managementLink');
      div.innerHTML = `<a href="management.html">Management</a>`;

      // insert it where you like (e.g. before “Login”)
      const loginLink = navLinks.querySelector('.loginLink');
      navLinks.insertBefore(div, loginLink);
    }
  } catch (err) {
    console.error('Navbar auth check failed:', err);
  }
});
