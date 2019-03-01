const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // Signup name
    lastName: { type: String, required: true, minlength: 2 },
    firstName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    encryptedPassword: { type: String, required: true }
  },
  {
    // Additional settings for the Scema class defined here
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
