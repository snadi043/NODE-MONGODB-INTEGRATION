const path = require('path');

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

// GET -> HTTP GET method to handle the Login request from the navigation page in the app.
router.get('/login', authController.getLogin);

module.exports = router;