const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user-model.js");

const router = express.Router();

router.post("/process-signup", (req, res, next) => {
  const { firstName, lastName, email, originalPassword } = req.body;

  // enforce password rules (can't be empty and MUST have a digit)
  if (!originalPassword || !originalPassword.match(/[0-9]/)) {
    // This is like next(err) but we are creating our own error object
    next(new Error("Password can't be blank ad must contain a number"));
    // use return to STOP the function here if the password is BAD
    return;
  }

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ firstName, lastName, email, encryptedPassword })
    .then(userDoc => {
      // Log in the user automatically when they create their account
      req.logIn(userDoc, () => {
        //hide encryptedPassword before sending the JSON (It's a security risk)
        userDoc.encryptedPassword = undefined;
        res.json(userDoc);
      });
    })
    .catch(err => next(err));
});
router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  // validate the email by searching the database for an account with that email
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      // User.findOne() will give us NULL in userDoc if it found nothing
      if (!userDoc) {
        next(new Error("Email is incorrect. 🤦‍♂️"));
        // use return to STOP the function here if the EMAIL is BAD
        return;
      }

      const { encryptedPassword } = userDoc;

      // validate the password by using bcrypt.compareSync()
      // (bcrypt.compareSync() will return FALSE if the passwords don't match)
      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        // req.flash() sends a feedback message before a redirect
        // (it's defined by the "connect-flash" npm package)
        next(new Error("Password is incorrect. 🤦‍♀️"));
        // use return to STOP the function here if the PASSWORD is BAD
        return;
      }

      // email & password are CORRECT!
      // if we MANUALLY managed the user session
      // req.session.userId = userDoc._id;

      // instead we'll use PASSPORT – an npm package for managing user sessions
      // req.logIn() is a Passport method that calls serializeUser()
      // (that saves the USER ID in the session which means we are logged-in)
      req.logIn(userDoc, () => {
        userDoc.encryptedPassword = undefined;
        res.json(userDoc);
      });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  // req.logOut() is a Passport method that removes the USER ID from the session
  req.logOut();
  // send some JSON to the client
  res.json({ message: "Logged out successfully! 🙋‍♀️" });
});

module.exports = router;
