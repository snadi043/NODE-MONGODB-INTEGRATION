const stripe = require('stripe')('sk_test_51RL2fHRtgdgPJkGggW2nFNJuIMAKqZuaHv3ovTX6nGLAlDEj6PBB1TVHLZXF0espqtg8IxdG7o70JfFohMtYI1AR00zq9EWYMp');

stripe.products.create({
  name: 'Online Purchase',
  description: 'Thank you for your business with us.',
}).then(product => {
  stripe.prices.create({
    unit_amount: total,
    currency: 'usd',
    product: product.id,
  }).then(price => {
    console.log('Success! Here is your starter subscription product id: ' + product.id);
    console.log('Success! Here is your starter subscription price id: ' + price.id);
  });
});