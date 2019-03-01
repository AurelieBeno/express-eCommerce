const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    cart: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    randomId: { type: Number },
    totalPrice: { type: Number },
    email: { type: String },
    dateOrdered: { type: Date },
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    isCart: { type: Boolean },
    isPaid: { type: Boolean }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
