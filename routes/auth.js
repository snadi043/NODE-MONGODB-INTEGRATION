const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// GET -> HTTP GET method to handle the Login request from the navigation page in the app.
router.get('/login', authController.getLogin);

// POST -> HTTP POST method to handle the Login request after the "login" button is clicked from the navigation page in the app.
router.post('/login', authController.postLogin);

// POST -> HTTP POST method to handle the Logout request after the "logout" button is clicked from the navigation page in the app.
router.post('/logout', authController.postLogout);

module.exports = router;