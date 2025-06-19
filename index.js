const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL connection config
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'devops',
  password: 'nope',
  port: 5432,
});

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files like index.html
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Fetch messages
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT text FROM messages ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages from DB:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Insert message to DB
app.post('/items', async (req, res) => {
  const text = req.body.text;

  try {
    await pool.query('INSERT INTO messages (text) VALUES ($1)', [text]);
    res.redirect('/');
  } catch (err) {
    console.error('Error inserting into DB:', err);
    res.status(500).send('Failed to insert');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
