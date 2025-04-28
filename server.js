const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database('database.db');
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    priority TEXT,
    isComplete BOOLEAN,
    isFun BOOLEAN
  )
`);

app.get('/todos', (req, res) => {
  db.all('SELECT * FROM todos', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM todos WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(row);
  });
});

app.post('/todos', (req, res) => {
  const { name, priority, isComplete, isFun } = req.body;
  db.run(
    'INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, ?, ?)',
    [name, priority, isComplete ? 1 : 0, isFun ? 1 : 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, priority, isComplete, isFun });
    }
  );
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


app.post('/todos', (req, res) => {
  const { name, priority, isComplete, isFun } = req.body;
  db.run(
    'INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, ?, ?)',
    [name, priority, isComplete ? 1 : 0, isFun ? 1 : 0],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, priority, isComplete, isFun });
    }
  );
});

app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM todos WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
