const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn, validateUser } = require('../middleware');

router.route('/register')
	.get(users.renderRegister)
	.post(validateUser, catchAsync(users.register));

router.route('/login')
	.get(users.renderLogin)
	.post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

router.route('/userdetails')
	.get(isLoggedIn, users.renderUserDetails)
	.patch(isLoggedIn, catchAsync(users.updateRisk))

router.patch('/userdetails/email', isLoggedIn, catchAsync(users.updateEmail))

router.route('/forgot')
	.get(users.renderForgot)
	.post(users.forgot)

router.route('/reset/:token')
	.get(users.renderReset)
	.post(users.reset)


module.exports = router;
