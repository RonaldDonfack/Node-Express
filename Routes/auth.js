const express = require('express');
const { check, body } = require('express-validator');

const router = express.Router();

const authController = require('../Controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);

router.post('/login', [
    check('email')
        .isEmail()
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (!user) {
                        return Promise.reject('This E-mail is not valide');
                    }
                })
        }),
    body('password')
        .isLength({ min: 3 })
        .withMessage('The password does not respect the normes')
], authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup', [
    check('email')
        .isEmail()
        .withMessage('please enter valide email ')
        .custom((value, { req }) => {
            return User.findOne({ email: value })
                .then(user => {
                    if (user) {
                        return Promise.reject('E-mail existe already, please pick a different one.')
                    }
                })
        }),
    body('password', `password doesn't respect the normes`)
        .isLength({ min: 3 }),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('password have to match');
            }
            return true;
        })], authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPasswrod);

router.post('/reset', authController.postReset);

router.post('/newpass', authController.postNewPassword);

module.exports = router;
