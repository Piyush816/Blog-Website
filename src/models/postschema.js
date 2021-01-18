const mongoose = require("mongoose");

let date = new Date();
const options = { day: "numeric", year: "numeric", month: "short" };
date = date.toLocaleDateString("en-IN", options);

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  post: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: String,
    default: date,
  },
  userid: {
    type: String,
    trim: true,
  },
  author: {
    type: String,
    trim: true,
  },
});

const Post = new mongoose.model("post", postSchema);

module.exports = Post;
