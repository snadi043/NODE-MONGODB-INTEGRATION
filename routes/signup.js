const express = require('express');

const signUpController = require('../controllers/signup');

const router = express.Router();

// GET -> HTTP GET method to handle the SignUp request from the navigation menu in the app.
router.get('/signup', signUpController.getSignUpPage);

// POST -> HTTP POST method to handle the SignUp request from the navigation menu in the app.
router.post('/signup', signUpController.postSignUpPage);

// GET -> HTTP GET method to handle the "PASSWORD RESET" request from the navigation menu -> LOGIN PAGE "RESET PASSWORD" link in the app.
router.get('/reset', signUpController.getResetPage);

// POST -> HTTP POST method to handle the "PASSWORD RESET" request from the navigation menu -> LOGIN PAGE "RESET PASSWORD" link in the app.
router.post('/reset', signUpController.postResetPage);

// GET -> HTTP GET method to handle the "NEW PASSWORD" request from the navigation menu -> RESET PAGE "SEND VERIFICATION LINK" button in the app.
router.get('/new-password', signUpController.getNewPassword);

// POST -> HTTP POST method to handle the "NEW PASSWORD" request from the navigation menu -> RESET PAGE "SEND VERIFICATION LINK" button in the app.
router.post('/new-password/:token', signUpController.postNewPassword);

module.exports = router;
