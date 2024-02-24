const MatchModel = require('../models/match.js')

let MatchController = {

  create: async (req, res) => {
    let newMatch = new MatchModel(req.body);
    let match = await newMatch.save();
    res.json(match);
  }
}

module.exports = MatchController;
