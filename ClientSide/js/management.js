/*
Our website supports two types of users:
    -Normal users, who can browse and filter the menu and make reservations.
    -Managers, who have elevated privileges to edit menu items (e.g., prices), manage reservations, and update restaurant hours.

Session management helps us:
    -Create sessions upon user login, storing their role (normal user or manager).
    -Maintain the session so user identity and permissions persist as they navigate the site.
    -Control access to restricted pages (e.g., menu editing and hours management) by checking the session role.
    -Terminate sessions on logout to protect security.

This way, the website remembers who is logged in and what they’re allowed to do.
*/

const express = require('express'); // Import express framework
const session = require('express-session'); // Import session middleware
const bodyParser = require('body-parser'); // Import body-parser middleware, to parse incoming request bodies, so you can easily read form data sent via POST requests. 

const app = express(); // Tells the Express app to use body-parser to parse URL-encoded form data (like from login forms).
app.use(bodyParser.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
  secret: 'restaurant-secret-key',   // Secret key to sign the session ID cookie
  resave: false,                     // Don't save session if unmodified
  saveUninitialized: true,           // Save new sessions
  cookie: { maxAge: 30 * 60 * 1000 } // Session expires after 30 minutes
}));

// Mock user database with passwords and roles - must encrypt passwords
const users = {
  alice: { password: 'pass123', role: 'user' },     // Normal user
  bob: { password: 'admin456', role: 'manager' }   // Manager user
};

// Login endpoint: verify user and create session
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && user.password === password) {
    req.session.user = { username, role: user.role };
    // Redirect based on role
    if(user.role === 'manager') {
      res.redirect('/management.html');  // manager dashboard page
    } else {
      res.redirect('/menu.html');        // normal user menu page
    }
  } else {
    res.status(401).send('Invalid username or password');
  }
});

// Middleware to allow only managers to access certain routes
function requireManager(req, res, next) {
  if (req.session.user && req.session.user.role === 'manager') {
    next(); // User is manager, allow access
  } else {
    res.status(403).send('Access denied. Managers only.');
  }
}

// Serve management.html only if user is manager
app.get('/management.html', requireManager, (req, res) => {
  res.sendFile(__dirname + '/public/management.html');
});

// Public menu browsing page for all users
app.get('/menu.html', (req, res) => {
  res.sendFile(__dirname + '/public/menu.html');
});

// Logout endpoint: destroy the session to log out
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) return res.status(500).send('Logout failed');
    res.redirect('/home.html');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
