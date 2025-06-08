
const express = require('express');
const session = require('express-session');
const cors = require('cors');



const app = express();

// CORS middleware: allow frontend origin and credentials
app.use(cors({
  origin: 'http://127.0.0.1:5500',  // your frontend origin (Live Server)
  credentials: 'include',
  credentials: true
}));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(session({
  secret: 'your-secret-key',       // replace with a strong secret in production
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 30 * 60 * 1000 }  // 30 minutes
}));

// Mock menu data
const menu = [
  { id: 1, category: 'Food', name: 'Classic Schnitzel', description: 'Crispy veal schnitzel with lemon', price: 15.99 },
  { id: 2, category: 'Food', name: 'Schnitzel with Mushroom Sauce', description: 'Topped with creamy mushroom sauce', price: 17.99 },
  { id: 3, category: 'Food', name: 'Vegetarian Schnitzel', description: 'Made with soy and spices', price: 13.99 },

  { id: 4, category: 'Salad', name: 'Austrian Potato Salad', description: 'Traditional Austrian potato salad with herbs', price: 5.99 },
  { id: 5, category: 'Salad', name: 'Mixed Green Salad', description: 'Fresh greens with house dressing', price: 6.99 },
  { id: 6, category: 'Salad', name: 'Caesar Salad', description: 'Romaine lettuce with Caesar dressing and croutons', price: 7.99 },

  { id: 7, category: 'Soup', name: 'Goulash Soup', description: 'Rich beef stew soup with paprika', price: 7.99 },
  { id: 8, category: 'Soup', name: 'Creamy Mushroom Soup', description: 'Smooth mushroom soup with fresh herbs', price: 6.99 },
  { id: 9, category: 'Soup', name: 'Chicken Noodle Soup', description: 'Classic chicken soup with noodles and vegetables', price: 7.49 },

  { id: 10, category: 'Drink', name: 'Austrian White Wine', description: 'Glass of local Grüner Veltliner', price: 8.50 },
  { id: 11, category: 'Drink', name: 'Apple Spritzer', description: 'Refreshing apple juice with sparkling water', price: 4.50 },
  { id: 12, category: 'Drink', name: 'Viennese Coffee', description: 'Traditional coffee with whipped cream', price: 3.99 },

  { id: 13, category: 'Dessert', name: 'Apple Strudel', description: 'Traditional Austrian apple pastry', price: 5.99 },
  { id: 14, category: 'Dessert', name: 'Sachertorte', description: 'Famous chocolate cake with apricot jam', price: 6.99 },
  { id: 15, category: 'Dessert', name: 'Kaiserschmarrn', description: 'Fluffy shredded pancake with powdered sugar', price: 6.49 }
];

// Mock users store (in-memory)
const users = {
  alice: { password: 'pass123', role: 'user' },
  bob: { password: 'admin456', role: 'manager' }
};

// Menu GET endpoint
app.get('/api/menu', (req, res) => {
  res.json(menu);
});

// Signup endpoint
app.post('/api/signup', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || !email || !password || !confirmPassword) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }
  if (users[username]) {
    return res.status(400).json({ success: false, message: 'Username already taken' });
  }

  users[username] = { email, password, role: 'user' };
  res.json({ success: true, message: 'User registered successfully' });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!users[username] || users[username].password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }

  req.session.user = { username, role: users[username].role };
  res.json({ success: true, role: users[username].role });
});

app.get('/api/check-auth', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// reservation.js
//const router = express.Router();

// Temporäre Speicherung (In-Memory)
let reservations = [];
let nextReservationId = 1;

// POST – Neue Reservierung
app.post('/submit', (req, res) => {
  const { date, time, name, email, guests } = req.body;

  const newReservation = {
    id: nextReservationId++,
    date,
    time,
    name,
    email,
    guests
  };

  reservations.push(newReservation);
  res.status(201).json(reservations);
});
// GET – Alle Reservierungen (Für Manager)
app.get('/reservations', (req, res) => {
  res.status(200).json(reservations);
});

// PUT – Reservierung aktualisieren (Für Manager)
app.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { date, time, name, email, guests } = req.body;

  const reservation = reservations.find(r => r.id === id);
  if (!reservation) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  reservation.date = date || reservation.date;
  reservation.time = time || reservation.time;
  reservation.name = name || reservation.name;
  reservation.email = email || reservation.email;
  reservation.guests = guests || reservation.guests;

  res.json({ message: 'Reservation updated', reservation });
});

// DELETE – Reservierung löschen
app.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = reservations.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Reservation not found' });
  }

  const deleted = reservations.splice(index, 1);
  res.json({ message: 'Reservation deleted', deleted });
});

//module.exports = router;



//app.use('/api/reservations', reservationRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

