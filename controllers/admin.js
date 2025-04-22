const Product = require('../models/product');

const { validationResult } = require('express-validator');

// getAddProduct() is the middleware function to handle the GET request to respond when admin tries to add a admin managed product to the list of products.
// navigation -> clicked on "Add Product" in the menu to redirect to view "add-product".
exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    errorFields: {
      title: '',
      imageUrl: '',
      price: '',
      description: ''
    },
    errorMessage: null,
    hasErrors: false,
    errorArray: []
  });
};

// postAddProduct() is the middleware function to handle the POST request to respond when admin adds a admin managed product after clicking on "ADD PRODUCT" button.
// navigation -> clicked on "Add Product" in the menu to redirect to view "add-product" -> clicked on "ADD PRODUCT" -> save the product to the database.
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;

  const errors = validationResult(req);
  console.log(errors.array());
  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      hasErrors: true,
        product: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description
        },
      errorMessage: errors.array()[0].msg,
      errorArray: errors.array(),
      errorFields: {
          title: title,
          imageUrl: imageUrl,
          price: price,
          description: description
        },
      });
    }
  const product = new Product({title: title, price: price, imageUrl: imageUrl, description: description, userId: req.user});
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
  Product.findById({_id:prodId, userId: req.user_id})
    .then(product => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMessage: null,
        hasErrors: false,
        errorArray: [],
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

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        // prod_Id: prodId 
      },
      errorFields: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
      },
      hasErrors: true,
      errorMessage: errors.array()[0].msg,
      errorArray: errors.array(),
    });
  }
  // Adding the filter to check for the right user with admin access only to edit the products he/she is created.
  Product.findById(prodId).then(product => {
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.imageUrl = updatedImageUrl;
    product.description = updatedDesc;
    return product.save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
  }
)};

exports.getProducts = (req, res, next) => {
  // Adding the filter check to provide access only the user who is an admin and who has created the product to see only the products he/she added and displaying only his/her products under his account login.
  Product.find({userId: req.user._id})
  // .select('title price -_id') // select() -> It is a mongoose provided method which can help to fetch only the mentioned fields from the document also has the provision to leave the fields which are unnecessary.
  // .populate('userId', 'name') // populate() -> It is a mongoose provided method which is used to fetch the fields from the collection.
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch(err => console.log(err));
};

// postDeleteProduct() is the middleware function to handle the POST request to respond when admin deletes an admin managed product after clicking on "DELETE" button.
// navigation -> clicked on "Admin Products" in the menu to redirect to view "products" -> clicked on "DELETE" button ->  deleted it in the database.
exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Adding the filter to allow the access to the user to delete the product if he/she has proper userId and he/she only added that same product which he/she is trying to delete. 
  Product.deleteOne({_id : prodId, userId: req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(err => console.log(err));
};
