const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  season: {
    type: Number,
    required: true
  },
  hero: {
    type: String,
    required: true
  },
  map: {
    type: String,
    require: true
  },
  role: {
    type: String,
    require: true
  },
  gameMode: {
    type: String,
    require: true
  },
  outcome: {
    type: String,
    require: true
  },
  timestamp: {
    type: String,
    default: Date.now()
  },
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User"
  // }
  user: {
    type: String,
    require: true
  }
})

const Match = mongoose.model("Match", MatchSchema)

module.exports = Match;
