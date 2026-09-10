const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  const { items } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map(item => ({
        price_data: {
          currency: "gbp",
          product_data: { name: item.title },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity || 1,
      })),
      mode: "payment",
      success_url: "https://c-u-b-e-d.co.uk/order-success",
      cancel_url: "https://c-u-b-e-d.co.uk/checkout",
    });
    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server running on port " + PORT));
