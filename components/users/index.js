const express = require('express');
const router = express.Router();
const authentication = require('./controllers/authenController.js');


router.get('/profile', async function(req, res, next) {
    console.log(req.jwtDecoded.data);
    return res.json(req.jwtDecoded.data);
});

module.exports = router;