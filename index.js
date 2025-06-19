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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Get all messages
app.get('/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, subject, body FROM messages ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Create new message
app.post('/items', async (req, res) => {
  const { subject, body } = req.body;
  try {
    await pool.query('INSERT INTO messages (subject, body) VALUES ($1, $2)', [subject, body]);
    res.status(201).json({ message: 'Message created' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to insert message' });
  }
});

// Update message
app.put('/items/:id', async (req, res) => {
  const { subject, body } = req.body;
  const id = req.params.id;
  try {
    await pool.query('UPDATE messages SET subject=$1, body=$2 WHERE id=$3', [subject, body, id]);
    res.json({ message: 'Message updated' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

// Delete message
app.delete('/items/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM messages WHERE id=$1', [id]);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
