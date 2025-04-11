const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

app.use(express.static('public'));
app.use(express.json());

let words;
let meanings;

fs.readFile(path.join(__dirname, 'words.json'), 'utf8', (err, data) => {
    if (err) throw err;
    words = JSON.parse(data);
});

fs.readFile(path.join(__dirname, 'meanings.json'), 'utf8', (err, data) => {
    if (err) throw err;
    meanings = JSON.parse(data);
});

app.get('/api/words/:level', (req, res) => {
    const level = req.params.level;
    res.json(words[level] || []);
});

app.get('/api/meanings/:word', (req, res) => {
    const word = req.params.word;
    res.json(meanings[word].data || { meanings: [], readings: [] });
});

app.post('/api/update-answers', (req, res) => {
    const { level, word, isCorrect } = req.body;
    const wordObj = words[level].find(w => w.word === word);
    if (wordObj) {
        wordObj.answers.push(isCorrect ? 1 : 0);
        fs.writeFile(path.join(__dirname, 'words.json'), JSON.stringify(words, null, 2), err => {
            if (err) return res.status(500).json({ error: 'Failed to update answers' });
            res.json({ success: true });
        });
    } else {
        res.status(404).json({ error: 'Word not found' });
    }
});

app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
