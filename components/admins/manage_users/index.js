const express = require('express');
const router = express.Router();
const users_db = require('../../../models/users');

router.get('/', async function(req, res){
    const all = await users_db.all();
    return res.json(all);
});

router.get('/detail/:id', async function(req, res){
    const id_user = req.params.id;
    const user = await users_db.one(id_user);
    return res.json(user);
});
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
module.exports = router;