const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()

// Middleware
const app = express();

// app.use((req, res, next) => {
//   if (req.headers.host.slice(0, 4) === 'www.') {
//     var newHost = req.headers.host.slice(4);
//     return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
//   } else {
//     next();
//   }
// });

const path = require('path');

app.use(express.json());
app.use(cors());

// Connect to Server

app.listen(process.env.PORT || 3001, () => console.log('server Started'))

console.log('mongoUrl:', process.env.MONGO_URL)

const mongoUrl = "mongodb+srv://richarddfyoung:RrxI7xOqjc2QnAHO@overwise.b12itby.mongodb.net/overwise?retryWrites=true&w=majority&appName=overwise"

// Connect to DB
mongoose.connect(mongoUrl, { //local
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5
}).then(() => console.log('connected to MongoDB')).catch(console.error);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 5
}).then(() => console.log('connected to MongoDB')).catch(console.error);

// Require DB models
const User = require('./models/user')
const Match = require("./models/match");

// Routes

  // Get all matches
app.get('/matches', async (req, res) => {
  const matches = await Match.find(req.query);

  res.json(matches);
});

  // create new match
app.post('/match/new', async (req, res) => {
  const newMatch = new Match(req.body);
  const savedMatch = await newMatch.save();
  res.json(savedMatch);
});


// delete match
app.delete('/match/delete/:id', async (req, res) => {
  const match = await Match.findByIdAndDelete(req.params.id);

  res.json(match);
});

// get season

app.get('/getseason', async(req, res) => {
  const html = await fetch('https://overwatch.blizzard.com/en-us/season/')
  .then(response => response.text())
  const dom = new JSDOM(html)
  const document = dom.window.document

  const title = document.querySelector('title')?.textContent
  const seasonSubstring = title.match(/Season \d+/)[0]
  console.log('seasonSubstring', seasonSubstring)
  const season = parseInt(seasonSubstring.replace('Season', ''))
  console.log('season', season)
  res.status(200).json(season)
})

  // Matches

// const MatchControls = require('./controllers/matchController.js')

// app.post('match/new', MatchControls.create)

  // Users

const UserControls = require('./controllers/userController.js')

app.post('/users/create', UserControls.create)
app.get('/users', UserControls.all)
app.get('/users/:id', UserControls.find)
app.get('/users/:id/matches', UserControls.getAllMatches)

// Production Middleware
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.headers.host}${req.url}`);
  } else {
    next();
  }
}, express.static(path.join(__dirname, "/client/build")));

// app.use(express.static(path.join(__dirname, "/client/build")));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
});
