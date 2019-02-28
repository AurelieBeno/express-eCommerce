const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // Signup name
    lastName: { type: String, required: true, minlength: 2 },
    firstName: { type: String, required: true, minlength: 2 },
    email: { type: String, required: true, unique: true, match: /^.+@.+\..+$/ },
    phoneNumber: { type: Number, min: 10 }, // unique : true
    cartId: { type: Number },
    encryptedPassword: { type: String, required: true, minlength: 5 },
    passwordConfirmation: { type: String }
  },
  {
    // Additional settings for the Scema class defined here
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
