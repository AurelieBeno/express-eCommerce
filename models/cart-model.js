const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
  productId: { type= Number },
  quantity: { type= Number },
  totalPrice: { type= Number }
}, {
  timestamps: true
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
