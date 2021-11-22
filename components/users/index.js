const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const user_db = require('./models/user.model');

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

/* GET a id. */
router.get('/profile/:id', async function(req, res, next) {
    const id = parseInt(req.params.id);
    const item = await user_db.findUserByID(id, false);
    res.json(item);
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
        let role = "subcriber";
        authentication.login_successfully(role, rows, req, res,true);
    }
);
router.get('/register',(req, res) => {
    //res.render('account/register');
})

router.get('/is-available',authentication.is_available);
router.get('/is-available-email',authentication.is_available_email);
router.get('/is-available-mssv',authentication.is_available_mssv);
router.get('/check-exist-email',authentication.is_exist_email);

router.post('/register',authentication.register);

router.get('/login', (req, res) => {
    after_register = req.query.register || null;
    res.render('account/login',{ 
        after_register: after_register
    })
});

router.post('/login', authentication.signin);

router.get('/signout', authentication.signout);

module.exports = router;