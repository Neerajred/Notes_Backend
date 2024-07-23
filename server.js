const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();


const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = process.env.PORT || 3000;

const db = new sqlite3.Database('notes-project.db');

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `);
});


//create a new note
app.post('/notes', (req, res) => {
    const {content} = req.body;
    const query = `INSERT INTO notes ( content) VALUES (?)`;
    db.run(query, [content], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error creating note' });
        }
        res.status(201).json({ message: "Successfully Note Added"});
    });
});

//initial content sync 
app.get('/notes', (req, res) => {
    const query = `SELECT * FROM notes`;
    db.all(query, (err, notes) => {
        if (err) {
            return res.status(500).json({ error: 'Error fetching notes' });
        }
        res.json(notes);
    });
});

// delete note
app.delete('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const query = `DELETE FROM notes WHERE id = ?;`;
    db.run(query, [noteId, req.userId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error deleting note' });
        }
        res.status(200).json({ id: noteId });
    });
});


//to update a note
app.put('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const { content} = req.body;
    const query = `UPDATE notes SET content = ? WHERE id = ?`;
    db.run(query, [ content,noteId], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error updating note' });
        }
        res.status(200).json({ id: noteId });
    });
});

// get note by id
app.get('/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const query = `SELECT * FROM notes WHERE id = ?`;
    db.get(query, [noteId], (err, note) => {
        if (err || !note) {
            return res.status(500).json({ error: 'Error fetching note' });
        }
        res.json(note);
    });
});

app.listen(port,()=>{
    console.log(`server started at http://localhost:${port}`);
})