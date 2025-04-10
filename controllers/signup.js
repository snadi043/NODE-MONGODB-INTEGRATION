// Importing the User Model to use it to create a new user in the post signup request.
// Importing the "bcryptjs" package to implement the hash password in the user creation for security.

const User = require('../models/user');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const nodemailertransporter = require('nodemailer-sendgrid-transport');

const mailTransport = nodemailer.createTransport(nodemailertransporter({
    api_key: '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',
}));

// getSignUpPage() is the middleware function to handle the GET request to respond when user tries to singup to the applicaton.
// navigation -> clicked on "Signup" in the menu to redirect to view "signup" page.
exports.getSignUpPage = (req, res, next) => {
    let message = req.flash('error');
        if(message > 0){
            message = message[0];
        }
        else{
            message = null;
        }
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false,
        errorMessage: message,
    });
}

// postSignUpPage() is the middleware function to handle the POST request to respond when user clicked on "singup" button in the Signup page.
// navigation -> clicked on "Signup" button.
exports.postSignUpPage = (req, res, next) => {
    // Collecting the user details like email and password.
    const email = req.body.email;
    const password = req.body.password;
    // Checking if the user already exists in the database. if yes -> redirect to singup page.
    User.findOne({email: email}).then(user => {
        if(user){
            req.flash('error', 'E-mail already exists, Please try with a new email');
            return res.redirect('/signup');
        }
    // If not an existing user -> before creating a new user the password is hashed for security and then creating a new user with the User model.
        return bcrypt.hash(password, 12).then(hasedPassword => {
            const user = new User({
                email: email,
                password: hasedPassword,
                cart: {items: []}
            });
            return user.save();
            }).then(result => {
                res.redirect('/login');
            }).catch(err => {console.log(err)});
    });
}