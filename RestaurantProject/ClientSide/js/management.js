const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'restaurant-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

// Mock user database
const users = {
  alice: { password: 'pass123', role: 'user' },     // normal user
  bob: { password: 'admin456', role: 'manager' }   // manager
};

// Login route: create session with user role
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (user && user.password === password) {
    req.session.user = { username, role: user.role };
    res.send(`Login successful. Role: ${user.role}`);
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware to protect manager-only routes
function requireManager(req, res, next) {
  if (req.session.user && req.session.user.role === 'manager') {
    next();
  } else {
    res.status(403).send('Access denied. Managers only.');
  }
}

// Route for managers to edit menu (protected)
app.get('/manager/menu-edit', requireManager, (req, res) => {
  res.send('Menu editing page (managers only)');
});

// Route for normal users to browse menu
app.get('/menu', (req, res) => {
  res.send('Menu browsing page (all users)');
});

// Logout: destroy session
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Logout failed');
    res.send('Logged out, session ended');
  });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
