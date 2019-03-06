const express = require("express");

const Product = require("../models/product-model");
const User = require("../models/user-model");

const Order = require("../models/order-model");

const router = express.Router();

// Set up for email confirmation to user
// const { sendConfirmationMail } = require("../config/nodemailer-setup.js");

router.post("/add-product/:productId", (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(product => {
      let promise;
      if (req.session.userOrder) {
        // update the existing order
        promise = Order.findByIdAndUpdate(
          req.session.userOrder,
          {
            $push: { cart: productId },
            $inc: { totalPrice: product.price }
          },
          { runValidators: true, new: true }
        );
      } else {
        // create the order
        promise = Order.create({
          cart: [productId],
          totalPrice: product.price
        });
      }
      promise
        .then(order => {
          // saving the session
          req.session.userOrder = order._id;
          res.json(order);
        })
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

router.get("/check-out", (req, res, next) => {
  const { userOrder } = req.session;
  console.log("find total price", userOrder);
  Order.findById(userOrder)
    .populate("cart")
    // send the DB query result document as a JSON response to the client
    .then(orderDoc => res.json(orderDoc))
    .catch(err => next(err));
});

// Remove a product
router.delete("/check-out/:cartId/delete", (req, res, next) => {
  const { cartId } = req.params;
  console.log(Order.findById);
  Order.findByIdAndRemove(cartId)
    .then(cartDoc => {
      console.log("product REMOVED! ", cartId);
      res.json(cartDoc);
    })
    .catch(err => {
      console.log("fail, nothing deleted--", err);
    });
});

module.exports = router;
