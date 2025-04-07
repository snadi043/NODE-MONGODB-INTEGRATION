const express = require('express');

const signUpController = require('../controllers/signup');

const router = express.Router();

router.get('/signup', signUpController.getSignUpPage);

router.post('/signup', signUpController.postSignUpPage);

module.exports = router;
