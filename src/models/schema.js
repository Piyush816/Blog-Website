const mongoose = require("mongoose");
const passportlocalmongoose = require("passport-local-mongoose");
const passport = require("passport");

let date = new Date();
const options = { day: "numeric", year: "numeric", month: "short" };
date = date.toLocaleDateString("en-IN", options);

// userSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  joinedAt: {
    type: String,
    default: date,
  },
});

userSchema.plugin(passportlocalmongoose);

const User = new mongoose.model("user", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;
