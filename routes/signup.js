const express = require('express');

const signUpController = require('../controllers/signup');

const router = express.Router();

router.get('/signup', signUpController.getSignUpPage);

router.post('/signup', signUpController.postSignUpPage);

router.get('/reset', signUpController.getResetPage);

router.get('/reset', signUpController.postResetPage);

module.exports = router;
