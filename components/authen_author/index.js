const express = require('express');
const router = express.Router();
const authentication = require('./controllers/authenController.js');


router.post('/is-available',authentication.is_available);
router.post('/is-available-admin',authentication.is_available_admin);
router.get('/is-available-email',authentication.is_available_email);
router.get('/is-available-mssv',authentication.is_available_mssv);
router.get('/check-exist-email',authentication.is_exist_email);
router.patch('/check-otp', authentication.check_otp);
router.post('/register',authentication.register);
router.post('/registeradmin',authentication.registeradmin);
router.patch('/get-otp', authentication.get_otp);
router.patch('/renew-password', authentication.change_password);
router.post('/login', authentication.signin);
router.post('/google-login', authentication.google_signin);
module.exports = router;