const express = require('express');
const session = require('express-session');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'http://127.0.0.1:5500',  // your frontend origin
  credentials: true                 // allow cookies/session
}));

app.use(express.json());

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutes
}));

// Mock users
const users = {
  alice: { password: 'pass123', role: 'user' },
  bob: { password: 'admin456', role: 'manager' }
};

app.post('/api/signup', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Basic validation
  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }
  if (users[username]) {
    return res.status(400).json({ success: false, message: 'Username already taken' });
  }

  // Save new user (role default to 'user')
  users[username] = { email, password, role: 'user' };

  res.json({ success: true, message: 'User registered successfully' });
});


// Login route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }

  req.session.user = { username, role: users[username].role };

  res.json({ success: true, role: users[username].role });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
