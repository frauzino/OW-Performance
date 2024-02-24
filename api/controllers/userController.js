const UserModel = require('../models/user.js')

let UserController = {

  find: async (req, res) => {
    let found = await UserModel.findById(req.params.id);
    res.json(found);
  },

  all: async (req, res) => {
    let allUsers = await UserModel.find();
    res.json(allUsers);
  },

  create: async (req, res) => {
    let newUser = new UserModel(req.body);
    let savedUser = await newUser.save()
    res.json(savedUser);
  },

  getAllMatches: async (req, res) => {
    let foundUser = await UserModel.findById(req.params.id).populate("matches");
    res.json(foundUser);
  }
}

module.exports = UserController;
