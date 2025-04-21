const express = require('express');

const {query} = require('express-validator'); // Importing the express validator package to integrate the validation into the application.

const signUpController = require('../controllers/signup');

const router = express.Router();

// GET -> HTTP GET method to handle the SignUp request from the navigation menu in the app.
router.get('/signup', signUpController.getSignUpPage);

// POST -> HTTP POST method to handle the SignUp request from the navigation menu in the app.
router.post('/signup', 
    [
        query('email').isEmail().withMessage('Please enter a valid email.'),
        query('password', 'Please enter a password with atleast 6 charecters including letters and numbers.').isAlphanumeric().isLength({min: 6}),
        query('cpassword').custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('Passwords should match. Please enter passwords correctly again.');
            }
            return true;
        }),
    ],
    signUpController.postSignUpPage);

// GET -> HTTP GET method to handle the "PASSWORD RESET" request from the navigation menu -> LOGIN PAGE "RESET PASSWORD" link in the app.
router.get('/reset', signUpController.getResetPage);

// POST -> HTTP POST method to handle the "PASSWORD RESET" request from the navigation menu -> LOGIN PAGE "RESET PASSWORD" link in the app.
router.post('/reset', signUpController.postResetPage);

// GET -> HTTP GET method to handle the "NEW PASSWORD" request from the navigation menu -> RESET PAGE "SEND VERIFICATION LINK" button in the app.
router.get('/reset/:token', signUpController.getNewPassword);

// POST -> HTTP POST method to handle the "NEW PASSWORD" request from the navigation menu -> RESET PAGE "SEND VERIFICATION LINK" button in the app.
router.post('/new-password/', signUpController.postNewPassword);

module.exports = router;
