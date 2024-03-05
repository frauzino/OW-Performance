const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv')

dotenv.config()

app.use(express.json());
app.use(cors());

// Connect to Server
  // Development
// app.listen(3001, () => console.log('server started port 3001'));

  // Production
  app.listen(process.env.PORT || 3001, () => console.log('server Started'))

// Connect to DB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
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

// get season

app.get('/getseason', async(req, res) => {
  const result = await fetch('https://overwatch.blizzard.com/en-us/season/')
  const html = await result.text()
  // console.log(html)

  const dom = new JSDOM(html)
  const document = dom.window.document

  const title = document.querySelector('title')?.textContent
  const season = parseInt(title.slice(-1))
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

// Production Middleware - disable for development

// app.use(express.static(path.join(__dirname, "/client/build")));

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '/client/build', 'index.html'));
// });
