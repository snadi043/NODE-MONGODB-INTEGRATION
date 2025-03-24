const Product = require('../models/product');

// getAddProduct() is the middleware function to handle the GET request to respond when admin tries to add a admin managed product to the list of products.
// navigation -> clicked on "Add Product" in the menu to redirect to view "add-product".
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

// postAddProduct() is the middleware function to handle the POST request to respond when admin adds a admin managed product after clicking on "ADD PRODUCT" button.
// navigation -> clicked on "Add Product" in the menu to redirect to view "add-product" -> clicked on "ADD PRODUCT" -> save the product to the database.
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  // const userId = req.user._id;
  const product = new Product({title: title, price: price, imageUrl: imageUrl, description: description});
    product.save().then(result => {
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch(err => {
      console.log(err);
    });
};

// getEditProduct() is the middleware function to handle the GET request to respond when admin tries to edit an admin managed product.
// navigation -> clicked on "Admin Products" in the menu to redirect to view "products" -> clicked on "EDIT" button -> edit the product.
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product
      });
    })
    .catch(err => console.log(err));
};

// postditProduct() is the middleware function to handle the POST request to respond when admin edited an admin managed product after clicking on "EDIT" button.
// navigation -> clicked on "Admin Products" in the menu to redirect to view "products" -> clicked on "EDIT" button -> edited the product -> clicked on "UPDATE" button to update it in the database.
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  const product = new Product(updatedTitle, updatedPrice, updatedImageUrl, updatedDesc, prodId);
    product.save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products'
      });
    })
    .catch(err => console.log(err));
};

// postDeleteProduct() is the middleware function to handle the POST request to respond when admin deletes an admin managed product after clicking on "DELETE" button.
// navigation -> clicked on "Admin Products" in the menu to redirect to view "products" -> clicked on "DELETE" button ->  deleted it in the database.
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
