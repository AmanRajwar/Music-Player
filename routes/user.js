const express = require('express');
const passport = require('passport');
const router = express.Router();

const loginController = require('../controllers/login_controller');
const homeController = require('../controllers/home_controller');

router.use('/home',require('./home'));
router.post('/signup', loginController.signup);
router.post('/signin', passport.authenticate('local', { failureRedirect: '/' }), loginController.signin);
router.get('/sign-out',loginController.destroySession);


router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
 router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/'}), loginController.signin);

module.exports = router;