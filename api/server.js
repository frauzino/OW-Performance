const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

// Connect to Server
app.listen(3001, () => console.log('server started port 3001'));

// Connect to DB
mongoose.connect("mongodb://127.0.0.1:27017/overwatch-performance-tracker", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('connected to DB')).catch(console.error);

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
  // const userId = req.body.user
  const newMatch = new Match(req.body);
  const savedMatch = await newMatch.save();
  // await User.findByIdAndUpdate(userId, {
  //   $push: {matches: savedMatch._id}
  // })
  res.json(savedMatch);
});


// delete match
app.delete('/match/delete/:id', async (req, res) => {
  const match = await Match.findByIdAndDelete(req.params.id);

  res.json(match);
});

  // Matches

// const MatchControls = require('./controllers/matchController.js')

// app.post('match/new', MatchControls.create)

  // Users

const UserControls = require('./controllers/userController.js')

app.post('/users/create', UserControls.create)
app.get('/users', UserControls.all)
app.get('/users/:id', UserControls.find)
app.get('/users/:id/matches', UserControls.getAllMatches)
