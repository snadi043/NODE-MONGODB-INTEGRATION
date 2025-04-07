// Importing the User Model to use it to create a new user in the post signup request.
// Importing the "bcryptjs" package to implement the hash password in the user creation for security.

const User = require('../models/user');
const bcrypt = require('bcryptjs');

// getSignUpPage() is the middleware function to handle the GET request to respond when user tries to singup to the applicaton.
// navigation -> clicked on "Signup" in the menu to redirect to view "signup" page.
exports.getSignUpPage = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false
    });
}

// postSignUpPage() is the middleware function to handle the POST request to respond when user clicked on "singup" button in the Signup page.
// navigation -> clicked on "Signup" button.
exports.postSignUpPage = (req, res, next) => {
    // Collecting the user details like email and password.
    const email = req.body.email;
    const password = req.body.password;
    // Checking if the user already exists in the database. if yes -> redirect to singup page.
    User.findOne({email: email}).then(user => { // 
        if(user){
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