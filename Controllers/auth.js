const crypto = require('crypto');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: message
    })
}
exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup'
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'invalide email or password');
                return res.redirect('/login')
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (!doMatch)
                        return res.redirect('/login')
                    req.session.isLoggedIn = true
                    req.session.user = user;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/')
                    })
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
exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmedPassword = req.body.signup;

    User.findOne({ email: email }).
        then(user => {
            if (user) {
                return res.redirect('/signup')
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {
                            items: []
                        }
                    })
                    return user.save()
                })
                .then(result => {
                    res.redirect('/login')
                })
        })
        .catch(err => console.log(err))

}
exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset',
        errorMessage: message
    })
}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    req.flash('error', 'No acount with this mail found.');
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExpirationDate = Date.now() + 3600000;
                return user.save()
            })
            .then(result => {
                res.redirect(`/reset/${token}`)
                // the mail sending code would have been writen here
            })
            .catch(err => console.log(err))
    })
}

exports.getNewPasswrod = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpirationDate: { $gt: Date.now() } })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0];
            } else {
                message = null;
            }
            res.render('auth/new-password', {
                path: '/newpass',
                pageTitle: 'new-Password',
                errorMessage: message,
                userId: user._id.toString(),
                token: token
            })
        })
        .catch(err => console.log(err))

}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken,
        resetTokenExpirationDate: { $gt: Date.now() },
        _id: userId
    })
        .then(user => {
            resetUser = user;
            return bcrypt.hash(newPassword, 12)
        })
        .then(hashedPassword => {
        
            resetUser.password = hashedPassword;
            resetUser.resetToken = undefined;
            resetUser.resetTokenExpirationDate = undefined
            return resetUser.save()
        })
        .then(result => {
            res.redirect('/login')
        })

        .catch(err => console.log(err))

}