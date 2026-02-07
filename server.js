require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json());
app.use(express.static('.'));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const cart = req.body.cart;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: cart.map(item => ({
        price_data: {
          currency: 'inr',
          product_data: { name: item.name },
          unit_amount: item.price * 100
        },
        quantity: 1
      })),
      mode: 'payment',
      success_url: 'http://localhost:4242/success.html',
      cancel_url: 'http://localhost:4242/cancel.html'
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(4242, () => {
  console.log('Demokart running on http://localhost:4242');
});
