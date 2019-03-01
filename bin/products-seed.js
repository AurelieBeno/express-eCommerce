//node bin/products-seed.js Commande terminal

require("dotenv").config();

const mongoose = require("mongoose");

const Product = require("../models/product-model.js");
const allProduct = require("./products.json");

mongoose
  .connect("mongodb://localhost/express-ecommmerce", {
    useNewUrlParser: true
  })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

Product.insertMany(allProduct)
  .then(productResult => {
    console.log(`Inserted ${productResult.length} product`);
  })
  .catch(err => {
    console.log("PRODUCT insert error 💩", err);
  });
