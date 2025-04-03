// Controller for the Login functionality to handle all the related requests for the authentication in the application.
 
exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.get('Cookie');
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: isLoggedIn
    });
}

exports.postLogin = (req, res, next) => {
    // // While handling the action that is after login button is clicked, we plan to pass the isAuthenticated value through the request to display the reamining two routes conditionally.
    // req.isAuthenticated = true; 
    res.setHeader('Set-Cookie', 'isLoggedIn=true');
    res.redirect('/');
}

// When storing the value like in line 12 to use it to help during the handling of HTTP request it is not stored and helpful for every single request because once the request is processed it is ended there and everytime 
// a new request is made in between the server and the client this value doesnt persist. So, it doesnot help to handle the user requirements to navigate the user based on their loggedIn status. So, the alternative to this is COOKIE.

// Cookies -> Cookies are basically the system/procedure which helps to store the user information in the browser and use it while handling the HTTP request in between the client and the server.
// Cookies are configured/enabled by using the setHeader() method in the request where it is required to store the value.