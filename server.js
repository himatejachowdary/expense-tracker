const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

const db = new sqlite3.Database(':memory:');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

db.serialize(() => {
    db.run("CREATE TABLE expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, amount REAL)");
});

app.get('/api/expenses', (req, res) => {
    db.all("SELECT * FROM expenses", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/api/expenses', (req, res) => {
    const { description, amount } = req.body;
    db.run("INSERT INTO expenses (description, amount) VALUES (?, ?)", [description, amount], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID, description, amount });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
