const express = require('express');
const router = express.Router();
const admins_db = require('../../../models/admins');

router.get('/', async function(req, res){
    const all = await admins_db.all();
    return res.json(all);
});

router.post('/add', async function(req, res){
    const new_admin = req.body.new_admin;
    await admins_db.add(new_admin);
    return res.json(true);
});
<<<<<<< Updated upstream

module.exports = router;
=======
module.exports = router;
>>>>>>> Stashed changes
