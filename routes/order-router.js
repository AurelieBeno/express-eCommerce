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
router.get("/order/:orderId/product/:productId", (req, res, next) => {
  // req.user comes from Passport's deserializeUser()
  // (it's the document from the database of the logged-in user)
  const { orderId, productId } = req.params;

  if (req.user) {
    // AUTHORIZATION: only show the order if you are logged-in
    Product.find({ "cities.startingCity": productId })
      .then(lines => {
        console.log(lines, "wahahahha");

        res.locals.lineArray = lines;
        res.render("resa-views/resa-option.hbs");
      })
      .catch(err => next(err));
  } else {
    req.session.reservationId = orderId;
    req.session.city = productId;
    // redirect to the sign up page if you ARE NOT logged-in
    req.flash("error", "Signup to create your itinerary");
    res.redirect("/signup");
  }
});

// Summary of user order
router.get("/summary", (req, res, next) => {
  res.render("resa-views/resa-summary.hbs");
});

router.post("/process-summary", (req, res, next) => {
  const { itineraries } = req.body;
  Busline.find({ "cities._id": { $in: itineraries } })
    .then(lines => {
      // res.json(lines);

      lines.forEach(oneLine => {
        oneLine.cities = oneLine.cities.filter(oneCity => {
          // convert ID to string because its not really string
          return itineraries.includes(oneCity._id.toString());
        });
      });

      // Creating calculation Total Price of the trip
      var tripLength = lines[0].cities.length;
      var tripCost = tripLength * 99;

      res.locals.cost = tripCost;
      res.locals.lineArray = lines;
      res.render("resa-views/resa-summary.hbs");
      // res.json(lines);
    })
    .catch(err => next(err));
});

router.get("/resa-views/registration-form.hbs", (req, res, next) => {
  res.render("resa-views/registration-form.hbs");
});

// submit registration and payment form (last form)

router.get("/registration", (req, res, next) => {
  res.render("resa-views/registration-form.hbs");
});
router.post("/process-registration", (req, res, next) => {
  // const { }
  res.render("resa-views/final-page.hbs");
});

module.exports = router;
