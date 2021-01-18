const express = require("express");
const app = new express.Router();
const passport = require("passport");
const User = require("../models/schema");
const Post = require("../models/postschema");

// home page route
app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    const data = await Post.find();
    res.render("index", {
      posts: data,
      Authenticated: true,
      name: req.user.name,
    });
  } else {
    const data = await Post.find();
    res.render("index", { posts: data, Authenticated: false });
  }
});

// dashboard page route
app.get("/dashboard", async (req, res) => {
  if (req.isAuthenticated()) {
    const posts = await Post.find({ userid: req.user._id });
    res.render("dashboard", {
      Authenticated: true,
      name: req.user.name,
      posts: posts,
    });
  } else {
    res.redirect("login");
  }
});

// login page routes
app.get("/login", (req, res) => {
  res.render("login");
});

// register page routes
app.get("/register", (req, res) => {
  res.render("register");
});

// user registeration routes
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username, name: req.body.name },
    req.body.password,
    (err, data) => {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/");
        });
      }
    }
  );
});

// user login routes
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.passport,
  });

  req.login(user, (err) => {
    if (err) {
      res.redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  });
});

// user logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// user add page route
app.get("/add", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addblog", { Authenticated: true, name: req.user.name });
  } else {
    res.redirect("/login");
  }
});

// user app post route
app.post("/addblog", async (req, res) => {
  try {
    const newpost = new Post({
      title: req.body.title,
      post: req.body.post,
      userid: req.user._id,
      author: req.user.name,
    });
    await newpost.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

// post view route
app.get("/post/:postid", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const postid = req.params.postid;
      const post = await Post.findById(postid);
      res.render("post", {
        post: post,
        Authenticated: true,
        name: req.user.name,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    try {
      const postid = req.params.postid;
      const post = await Post.findById(postid);
      const morepost = await Post.find();
      res.render("post", {
        post: post,
        more: morepost,
        Authenticated: false,
      });
    } catch (err) {
      console.log(err);
    }
  }
});

// edit post route
app.get("/edit/:id", async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const post = await Post.findById(req.params.id);
      console.log(post);
      res.render("edit", {
        post: post,
        Authenticated: true,
        name: req.user.name,
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.redirect("/");
  }
});

// update post
app.post("/editblog/:id", async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

// delete post
app.get("/delete/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
});

app.post("/search", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const searchquery = req.body.query;
      const posts = await Post.find();

      const data = posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(searchquery.toLowerCase()) ||
          post.post.toLowerCase().includes(searchquery.toLowerCase())
        );
      });
      if (data.length > 0) {
        res.render("search", {
          posts: data,
          Authenticated: true,
          name: req.user.name,
        });
      } else {
        res.send("no result found!");
      }
    } else {
      const searchquery = req.body.query;
      const posts = await Post.find();

      const data = posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(searchquery.toLowerCase()) ||
          post.post.toLowerCase().includes(searchquery.toLowerCase())
        );
      });
      if (data.length > 0) {
        res.render("search", { posts: data, Authenticated: false });
      } else {
        res.render("search", { posts: [], Authenticated: false });
      }
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

app.get("*", (req, res) => {
  res.render("notfound");
});

module.exports = app;
