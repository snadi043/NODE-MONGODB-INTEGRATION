const Product = require('../models/product');
const Order = require('../models/order');

const path = require('path');
const fs = require('fs');

// Importing the PDFKit package in the file and configuring it to use it in the controller.
const PDFDocument = require('pdfkit');
const doc = new PDFDocument(); 

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
  .populate('cart.items.productId') // populate() is the mongoose provided method which gets all the fields from the collection that is specified in the method.
  // .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
  .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
  .then(product => {
    return req.user.addToCart(product);
    })
  .then(result => {
    res.redirect('/cart');
    console.log(result);
    })
  .catch(err => {console.log(err)});
  }

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteCartProduct(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  // From the new OrderSchema, orders has two fields which are products (this is an object with all the product details) and
  // the second one is users (that is also an object with all the user details).
  
  //Fetching the product details
  const prod = req.user.populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items.map(i => {
      return{
        quantity: i.quantity,
        product: {...i.productId._doc} // _doc is the extension provided by mongoose to get access to the complete document.
      };
    });
    const order = new Order({
      user: {
        email: req.user.email,
        userId: req.user
      },
      products: products
    });
    order.save();
  }).
  then(result => {
   return req.user.clearCart();
  })
  .then(() => {
    res.redirect('/orders');
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getOrders = (req, res, next) => {
  Order.find({'user.userId': req.user_id})
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch(err => console.log(err));
};

// Configuring the invoice HTTP GET request to handle the invoice generation in the pdf format in the application.
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  // Adding the validation check where to filter the user if he/she has the access to order a product by verifying their user id.
  Order.findById(orderId).then(order => {
    if(!order){
      return next (new Error(err, 'Something went wrong.' ));
    }
    if(order.user.userId.toString() !== req.user._id.toString()){
      return next(new Error(err, 'UnAuthorized. You do not have the access to make the orders.'));
    }
    const filename = 'invoice-' + orderId + '.pdf';
    const filepath = path.join('data', 'invoices', filename);

    // -- reading the entire file in a single go -- //

    // fs.readFile(filepath, (err, data) => {
    //   if(err){
    //     return next(err);
    //   }
    //   res.setHeader('Content-Type', 'application/pdf');
    //   res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"'); // Setting the appropriate filename to the pdf document while downloading the file.
    //   res.send(data);
    // });
    
    // -- reading the file as a stream of data. -- //

    // const file = fs.createReadStream(filepath); // Reading the file in the form of the stream to avoid easy memory outages when dealing with large volume of file/files.
    // res.setHeader('Content-Type', 'application/pdf');
    // res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"'); // Setting the appropriate filename to the pdf document while downloading the file.
    // file.pipe(res); // Pipe() is the method to be used to handle the large files to do a write action of the files.
    
    // -- Configuring the PDFKit package through "doc" to write the data into the file of PDF format on the fly when reading the document.
    doc.pipe(fs.createWriteStream(filepath));
    doc.fontSize(24).text('Invoice');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"'); // Setting the appropriate filename to the pdf document while downloading the file.
    doc.pipe(res); // Pipe() is the method to be used to handle the large files to do a write action of the files.

    doc.end();

  }).catch(err => {
      next(err);
  })
}