// Controller for the Login functionality to handle all the related requests for the authentication in the application.
 
exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: req.isAuthenticated
    });
}

exports.postLogin = (req, res, next) => {
    req.isAuthenticated = true; // While handling the action that is after login button is clicked, we plan to pass the isAuthenticated value through the request to display the reamining two routes conditionally.
    res.redirect('/');
}