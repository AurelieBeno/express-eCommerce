require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");

const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const MongoStrore = require("connect-mongo");
const passport = require("passport");

require("./config/passport-setup.js");
mongoose
  .connect("mongodb://localhost/express-ecommmerce", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    // receive cookies
    credentials: true,
    // only there domains/origins can access
    originin: ["http://localhost:3000"]
  })
);

app.use(
  session({
    //default setting
    resave: true,
    saveUninitialized: true,

    // session secret
    secret: process.env.SESSION_SECRET,
    store: new MongoStrore({ mongooseConnection: mongoose.connection })
  })
);

// Activate some of the passport methods in our routes
app.use(passport.initialize());

// Load the logged-in user's information once we are logged-in
app.use(passport.session());

const auth = require("./routes/auth-router.js");
// All routes in the auth router will start with "/api"
// (example: "/logout -> "/api/logout")
app.use("/api", auth);

module.exports = app;
