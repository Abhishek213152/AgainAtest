const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51PcBzhD8vdk9FbZFvLQw57iFR23ZC6RaDt2eQibCe0Ny8u9jH02X1GWfFL0mzc3C9aQqXDEvpzAOEKcq2ywW0Ymm00pF3sElvn"
);
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const PORT = process.env.PORT || 3000;

app.get("/success", (req, res) => {
  res.send("Payment successfully completed");
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/payment", async (req, res) => {
  const { amount } = req.body;
  const product = await stripe.products.create({
    name: "T-Shirt",
  });

  if (product) {
    var price = await stripe.prices.create({
      product: `${product.id}`,
      unit_amount: amount * 100,
      currency: "inr",
    });
  }

  if (price.id) {
    var session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: `${price.id}`,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_URL}/success`,
      cancel_url: `${FRONTEND_URL}/cancel`,
      customer_email: "demo@gmail.com",
    });
  }

  res.json(session);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});