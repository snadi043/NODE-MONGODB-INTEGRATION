const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

const {body} = require('express-validator');

// GET -> HTTP GET method to handle the Login request from the navigation page in the app.
router.get('/login', authController.getLogin);

// POST -> HTTP POST method to handle the Login request after the "login" button is clicked from the navigation page in the app.
router.post('/login', 
    [
        body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
        body('password', 'Please enter a alpha-numeric password with atleast 6 charecters.')
        .isLength({min: 6})
        .isAlphanumeric(),
    ],
    authController.postLogin);

// POST -> HTTP POST method to handle the Logout request after the "logout" button is clicked from the navigation page in the app.
router.post('/logout', authController.postLogout);

module.exports = router;