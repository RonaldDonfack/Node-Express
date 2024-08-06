const express = require('express')

const router = express.Router();

const authController = require('../Controllers/auth');

router.get('/login', authController.getLogin);

router.post('/login',authController.postLogin);

router.get('/signup', authController.getSignup);

router.post('/signup',authController.postSignup);

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);

router.get('/reset/:token', authController.getNewPasswrod);

router.post('/reset', authController.postReset);

router.post('/newpass', authController.postNewPassword);

module.exports = router;
