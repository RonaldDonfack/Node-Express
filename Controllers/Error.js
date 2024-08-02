exports.notFound = (req , res , next ) => {
    res.status(404).render('404' , {pageTitle : 'page not found' , path : '',
        isAuthenticated :  req.isLoggedIn });
}