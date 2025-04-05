const User = require('../models/user');

// Controller for the Login functionality to handle all the related requests for the authentication in the application.
 
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false,
    });
}

exports.postLogin = (req, res, next) => {
    // // While handling the action that is after login button is clicked, we plan to pass the isAuthenticated value through the request to display the reamining two routes conditionally.
    // req.isAuthenticated = true; 
    // res.setHeader('Set-Cookie', 'isLoggedIn=true');
    User.findById('67e2bad2ede014c342373de4') // Fetching the user after logging in and storing the user value in the session.
    .then(user => {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save((err) => { // adding save() method on the session to render the coorect view when fetching the sessions from the database. 
            console.log(err);
            res.redirect('/');
        })
    })
    .catch(err => console.log(err));
}

// Destroying the session after the user clicks on logout button in the navigation in a clean way.
exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
}

// When storing the value like in line 12 to use it to help during the handling of HTTP request it is not stored and helpful for every single request because once the request is processed it is ended there and everytime 
// a new request is made in between the server and the client this value doesnt persist. So, it doesnot help to handle the user requirements to navigate the user based on their loggedIn status. So, the alternative to this is COOKIE.

// Cookies -> Cookies are basically the system/procedure which helps to store the user information in the browser and use it while handling the HTTP request in between the client and the server.
// Cookies are configured/enabled by using the setHeader() method in the request where it is required to store the value.

// In the cookie as we have seen in the earlier case that the value is stored in the clinet side (browser) which can be manipulated by the users.
// So, the alternative to avoid such a scenario is to use Sessions.

// Sessions -> Sessions are basically defined as a feature to store the value of a user to handle all the HTTP requeests of the same user, which is stored in the memory/database so it is not lost or expired or manipulated like in cookies.
// Sessions are basically stored in the backend of the application.
// Sessions work with cookies where cookies store the session ID which is hashed which adds additional layer of security.

// Though Sessions are useful and secured compared to cookies, the drawback with sessions is that they are stored in memory.
// So, when dealing with tons of users in the production environment it might not be scalable and can lead to memory lekages.
// So, the alternative to this is that, we use the procedure to store them (Sessions) in the database.
// In this application, since mongoDB is integrated with the project, implementing the session storage in mongoDB is viable.
// To implement this express-session package provides us with another store package which is "connect-mongodb-session".