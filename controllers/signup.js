exports.getSignUpPage = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'SignUp',
        isAuthenticated: false
    });
}

exports.postSignUpPage = (req, res, next) => {

}