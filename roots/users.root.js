const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const user_db = require('../models/user.model');
const BASEURL = 'http://localhost:3000/classes/inviteclass/'

/* GET a id. */
router.get('/profile/:id', async function(req, res, next) {
    const id = parseInt(req.params.id);
    const item = await user_db.findUserByID(id, true);
    res.json(item);
});

module.exports = router;