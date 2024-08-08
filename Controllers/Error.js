exports.notFound = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'page not found',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    });
}
exports.serverError = (req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Server Error',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    });
}