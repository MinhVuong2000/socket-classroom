const authentication = require('../components/users/controllers/authenController.js');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const keys = require('../config/const.config');

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
}));

app.get('/auth/google/callback', 
    passport.authenticate('google',{ 
    failureRedirect: '/failed',
    session: false }),async (req, res) => {
        const rows = await req.user;
        let role = "subcriber";
        authentication.login_successfully(role, rows, req, res,true);
    }
);

app.get('/is-available',authentication.is_available);
app.get('/is-available-email',authentication.is_available_email);
app.get('/check-exist-email',authentication.is_exist_email);

app.post('/register',authentication.register);

app.get('/login', authorMdw.checkAlreadyLoggedIn, (req, res) => {
    after_register = req.query.register || null;
    res.render('account/login',{ 
        after_register: after_register
    })
});

app.post('/login', authentication.signin);