const express = require('express');
const {notes} = require('./db/db.json');

const PORT = process.env.PORT || 3000
const app = express();

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.listen(3000, () => {
    console.log(`API server now on port ${PORT}`);
});