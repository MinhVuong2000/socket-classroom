const express = require('express');
const router = express.Router();

const classed_db = require('./models/classes');


/* GET home page. */
router.get('/', async function(req, res, next) {
    const allData = await classed_db.all();
    res.json(allData);
});

/* GET a id. */
router.get('/detail/:id', async function(req, res, next) {
    const id = parseInt(req.params.id);
    const item = await classed_db.one(id);
    res.json(item);
});

router.post('/', async function(req, res, next){
    const new_class = {
        class_name: req.body.class_name,
        description: req.body.description,
        id_admin: req.body.id_admin
    };
    await classed_db.add(new_class);
    const allclassed_db = await classed_db.all();
    res.json(allclassed_db);
});

router.get('/isExistedClassName', async function(req, res, next){
    const checked_name = req.query.checked_name;
    const isExisted = await classed_db.isExisted(checked_name);
    res.json(isExisted);
});

module.exports = router;