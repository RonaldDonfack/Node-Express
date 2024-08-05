const User = require('../models/user')

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        isAuthenticated: false
    })
}

exports.postLogin = (req, res, next) => {
    User.findById('66ab5973d18f927682655ff5')
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user;
            req.session.save(err => {
                console.log();
                res.redirect('/')
            })
        })
        .catch(err => console.log(err))
}

exports.postLogout = (req, res, next) => {

    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/')
    })


}