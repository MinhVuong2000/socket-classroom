const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const user_db = require('../../models/users');

const authentication = require('./controllers/authenController.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../../config/const.config');
const BASEURL = 'http://localhost:3000/classes/inviteclass/'

passport.use(new GoogleStrategy({
    clientID: keys.googleClientID,
    clientSecret: keys.googleClientSecret,
    callbackURL: '/auth/google/callback'
    },
    authentication.passport_google
));


router.get('/profile', async function(req, res, next) {
    console.log(req.jwtDecoded.data);
    return res.json(req.jwtDecoded.data);
});


router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
}));

router.get('/auth/google/callback', 
    passport.authenticate('google',{ 
    failureRedirect: '/failed',
    session: false }),async (req, res) => {
        const rows = await req.user;
        authentication.login_successfully(rows, req, res,true);
    }
);

router.post('/is-available',authentication.is_available);
router.get('/is-available-email',authentication.is_available_email);
router.get('/is-available-mssv',authentication.is_available_mssv);
router.get('/check-exist-email',authentication.is_exist_email);

router.post('/register',authentication.register);

router.post('/login', authentication.signin);
router.post('/google-login', authentication.google_signin);

module.exports = router;