const express = require('express');
const {notes} = require('./db/db.json');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000
const app = express();

//parse incoming string or array data
app.use(express.urlencoded({extend:true}));
//parse incoming JSON data
app.use(express.json());

function createNewNote(body, notesArray){
    console.log(body);
    //functions main code
    const note = body;
    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify({notes: notesArray}, null, 2)
    );
    //return finished conde to post route for response
    return note;
}

function validateNote(note){
    if(!note.title || typeof note.title !== 'string'){
       return false;
    }
    if(!note.text || typeof note.text !== 'string'){
        return false;
    }
}

app.get('/api/notes', (req, res) => {
    res.json(notes);
});

app.post('/api/notes', (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = notes.length.toString();

    //if any data in req.body is incorrect, send 400 error back
    if(!validateNote(req.body)){
        res.status(400).send('The note is not properly formatted');
    } else{
        // add note to json file and notes array in this function
        const note = createNewNote(req.body, notes);
        res.json(note); 
    }
});

app.listen(3000, () => {
    console.log(`API server now on port ${PORT}`);
});