const express = require('express');
const router = express.Router();
const users_db = require('../../../models/users');

router.post('/', async function(req, res){
    const all = await users_db.all();
    return res.json(all);
});

router.get('/detail/:id', async function(req, res){
    const id_user = req.params.id;
    const user = await users_db.one(id_user);
    return res.json(user);
});
router.post('/updateotp', async function(req, res){
    const id_user = req.body.id;
    const newotp = req.body.otp
    const user = await users_db.updateOTPByIDUser(id_user, newotp);
    return res.json(user);
});
module.exports = router;