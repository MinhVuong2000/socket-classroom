const express = require('express');
const router = express.Router();
const classes_db = require('../../../models/classes');

router.get('/', async function(req, res){
    const all = await classes_db.allOfAll();
    return res.json(all);
});

router.get('/detail/:id', async function(req, res){
    const id_class = req.params.id;
    const _class = await classes_db.one(id_class);
    return res.json(_class);
});

module.exports = router;