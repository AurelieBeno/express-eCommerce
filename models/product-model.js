const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    gender: { type: String, enum: ["Male", "Female"] },
    baseImageUrl: { type: String },
    brandName: { type: String },
    colour: { type: String },
    size: { type: Array },
    productId: { type: Number },
    name: { type: String },
    price: { type: Number },
    productType: { type: String },
    url: { type: String }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
