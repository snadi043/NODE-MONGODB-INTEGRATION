const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

const {body} = require('express-validator');

// /admin/add-product => GET
router.get('/add-product', isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get('/products',  isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product',
    [
        body('title').isString().isLength({min: 5}).withMessage('Please enter title which is a string and has atleast 5 charecters.'),
        body('price').isFloat().withMessage('Please enter an decimal number to confirm the price.'),
        body('description').isString().trim().isLength({min: 5, max: 250}).withMessage('Please enter the description within the range of 5-250 charecters.'),
    ], 
      isAuth, 
      adminController.postAddProduct
    );

// /admin/edit-product/productId => GET
router.get('/edit-product/:productId',  isAuth, adminController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product',
    [
        body('title').isString().isLength({min: 5}).trim().withMessage('Please enter title which is a string and has atleast 5 charecters.'),
        body('price').isFloat().withMessage('Please enter an decimal number to confirm the price.'),
        body('description').isString().trim().isLength({min: 5, max: 250}).withMessage('Please enter the description within the range of 5-250 charecters.'),
    ],   
    isAuth, 
    adminController.postEditProduct
);

// /admin/delete-product => POST
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
