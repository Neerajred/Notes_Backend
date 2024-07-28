const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5500;

app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('notes-project.db');

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)");
});

//Server Checking API

app.get("/",(req,res)=>{
    res.send("Server Running using NodeJS")
})

// Fetch all notes
app.get('/api/notes', (req, res) => {
  db.all("SELECT * FROM notes", [], (err, rows) => {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "notes": rows });
  });
});

// Create a new note
app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  db.run("INSERT INTO notes (content) VALUES (?)", [content], function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "note": { id: this.lastID, content } });
  });
});

// Delete a note
app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM notes WHERE id = ?", id, function(err) {
    if (err) {
      res.status(400).json({ "error": err.message });
      return;
    }
    res.json({ "message": "Deleted", id });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
