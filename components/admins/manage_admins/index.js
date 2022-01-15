const express = require('express');
const router = express.Router();
const admins_db = require('../../../models/admins');

router.post('/', async function(req, res){
    const all = await admins_db.all();
    let is_super = false;
    console.log("Admin: ", all);
    if(req.jwtDecoded.data.is_super == 1){
        is_super = true;
    }
    return res.json({
        list_admin: all,
        is_super: is_super,
    });
});

router.post('/add', async function(req, res){
    const new_admin = req.body.new_admin;
    await admins_db.add(new_admin);
    return res.json(true);
});

module.exports = router;
