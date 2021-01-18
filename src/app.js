// modules
const express = require("express");
const path = require("path");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/schema");
const Post = require("./models/postschema");
const Router = require("./router/routes");
require("./db/conn");

// setting port and app
const port = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

// initialize session
app.use(
  session({
    secret: "hello world",
    resave: false,
    saveUninitialized: true,
  })
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

app.use(Router);

// listening the server
app.listen(port, () => {
  console.log("running on " + port);
});
