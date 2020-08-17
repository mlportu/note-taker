const express = require('express');
const {notes} = require('./db/db.json');
const fs = require('fs');
const path = require('path');
const short = require('short-uuid');
const { allowedNodeEnvironmentFlags } = require('process');

const PORT = process.env.PORT || 3000;
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({extend:true}));
//parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

function createNewNote(body){
    // console.log(body);
    //functions main code
    const note = body;
    let currentNotes = fs.readFileSync('./db/db.json');
        currentNotes = JSON.parse(currentNotes);
        // console.log(currentNotes);
    currentNotes.push(note);
    // console.log(currentNotes)
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(currentNotes, null, 2)
    );
    //return finished conde to post route for response
    return note;
}

function validateNote(note){
    // console.log(note);
    if(!note.title || typeof note.title !== 'string'){
       return false;
    }
    if(!note.text || typeof note.text !== 'string'){
        return false;
    }
    return true;
}

app.get('/api/notes', (req, res) => {
    let results = fs.readFileSync('./db/db.json');
    results = JSON.parse(results);
    res.json(results);
});

app.post('/api/notes', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = short.uuid();
    // console.log(req.body.id);
    // console.log(req.body);
    //if any data in req.body is incorrect, send 400 error back
    if(!validateNote(req.body)){
        res.status(400).send('The note is not properly formatted');
    } else{
        // add note to json file and notes array in this function
        const note = createNewNote(req.body);
        res.json(note); 
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});