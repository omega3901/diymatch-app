const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, service_type, customer_email } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { 
            name: `DIYMatch - ${service_type}`,
            description: 'Professional DIY service booking'
          },
          unit_amount: Math.round(amount * 100), // Convert pounds to pence
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin || 'https://yourapp.vercel.app'}/?payment=success`,
      cancel_url: `${req.headers.origin || 'https://yourapp.vercel.app'}/?payment=cancelled`,
      customer_email: customer_email,
      metadata: {
        service_type: service_type,
        platform: 'DIYMatch'
      }
    });
    
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
}
