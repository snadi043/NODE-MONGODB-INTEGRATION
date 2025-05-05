const stripe = require('stripe')('');

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