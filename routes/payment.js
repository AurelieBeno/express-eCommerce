const express = require("express");
const stripe = require("stripe")(
  "sk_test_N9FTEwEZ4zUDCi2L343vyn6800zBdJSefA"
);
const router = express.Router();

router.post("/checkout", async (req, res) => {
  // console.log("Request :", req.body);
  // console.log("amount", req.body.totalPrice);
  let error;
  let status;
  try {
    const token = req.body.source;
    console.log("TOKEN  BACKEND", token);

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id
    });
    console.log(" CUSTOMER", customer);

    const charge = await stripe.charges.create({
      amount: req.body.totalPrice * 100,
      currency: "usd",
      customer: customer.id,
      receipt_email: token.email,
      // description: `Purchased the ${cart}`,
      shipping: {
        name: token.card.name,
        address: {
          line1: token.card.address_line1,
          line2: token.card.address_line2,
          city: token.card.address_city,
          country: token.card.address_country,
          postal_code: token.card.address_zip
        }
      }
    });

    console.log("Charge:", { charge });
    status = "success";
  } catch (error) {
    console.error("Error:", error);
    status = "failure";
  }

  res.json({ error, status });
});

module.exports = router;
