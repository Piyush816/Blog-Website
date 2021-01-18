const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("not connected..");
  });

