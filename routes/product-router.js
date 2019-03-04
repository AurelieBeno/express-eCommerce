const express = require("express");

const Product = require("../models/product-model.js");

const router = express.Router();

router.get("/product", (req, res, next) => {
  Product.find()
    .sort({ createdAt: -1 })
    .limit(20)
    // Send the DB query results array as a JSON response to the client
    .then(productResult => res.json(productResult))
    .catch(err => next(err));
});

router.get("/product/:productId", (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(
      productDoc => res.json(productDoc)
      //console.log("ONE PRODUCT", productDoc)
    )

    .catch(err => next(err));
});

router.post("/product", (req, res, next) => {
  const {
    gender,
    baseImageUrl,
    brandName,
    colour,
    size,
    productId,
    name,
    price,
    productType,
    url
  } = req.body;
  Product.create({
    gender,
    baseImageUrl,
    brandName,
    colour,
    size,
    productId,
    name,
    price,
    productType,
    url
  })

    // send the DB query result document as a JSON response to the client
    .then(productDoc => res.json(productDoc))
    .catch(err => next(err));
});
module.exports = router;
