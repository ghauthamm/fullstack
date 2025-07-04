const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Handlebars setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Route: Show form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// Route: Handle form submission
app.post('/submit', (req, res) => {
  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  data.push(req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.redirect('/data');
});

// Route: Display stored data
app.get('/data', (req, res) => {
  let data = [];
  if (fs.existsSync(DATA_FILE)) {
    data = JSON.parse(fs.readFileSync(DATA_FILE));
  }
  res.render('data', { entries: data });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
}); 