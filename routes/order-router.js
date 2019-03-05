const express = require("express");

const Product = require("../models/product-model");
const User = require("../models/user-model");

const Order = require("../models/order-model");

const router = express.Router();

// Set up for email confirmation to user
// const { sendConfirmationMail } = require("../config/nodemailer-setup.js");

// result of user input -- Departure city
// router.get("/order/:orderId", (req, res, next) => {
//   City.find()
//     .then(resaDoc => {
//       res.locals.cityItem = resaDoc;
//       res.render("resa-views/resa-result.hbs");
//     })
//     .catch(err => next(err));
// });

// user need to sign up before continue to add product to order
// router.get("/order/:orderId/product/:productId", (req, res, next) => {
//   // req.user comes from Passport's deserializeUser()
//   // (it's the document from the database of the logged-in user)
//   const { orderId, productId } = req.params;

//   if (req.user) {
//     // AUTHORIZATION: only add the product to order if you are logged-in
//     Product.find({ "products.productItem": orderId })
//       .then(lines => {
//         console.log(lines, "wahahahha");

//         res.locals.lineArray = lines;
//         res.render("resa-views/resa-option.hbs");
//       })
//       .catch(err => next(err));
//   } else {
//     req.session.orderId = productItem;

//     // redirect to the sign up page if you ARE NOT logged-in
//     req.flash("error", "Signup to create your itinerary");
//     res.redirect("/signup");
//   }
// });

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

// Product.find({ "products._id": { $in: purchase } })
//   .then(order => {
//     res.json(order);

//     order.forEach(oneOrder => {
//       oneOrder.products = oneOrder.products.filter(oneProduct => {
//         // convert ID to string because its not really string
//         return purchase.includes(oneProduct._id.toString());
//       });
//     });

module.exports = router;
