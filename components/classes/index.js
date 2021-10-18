const express = require('express');
const router = express.Router();

const db = require('./db');

/* GET home page. */
router.get('/', async function(req, res, next) {
    const allData = await db.all();
    res.json(allData);
});

/* GET a id. */
router.get('/detail/:id', async function(req, res, next) {
    const id = parseInt(req.params.id);
    const item = await db.one(id);
    console.log(item);
    res.json(item);
});

router.post('/', async function(req, res, next){
    console.log('post api')
    const new_class = {className: req.body.className};
    console.log(new_class);
    await db.add(new_class);
    const allDB = await db.all();
    res.json(allDB);
});

router.get('/isExistedClassName', async function(req, res, next){
    console.log('isExistedClassName api')
    const checked_name = req.query.checked_name;
    const isExisted = await db.isExisted(checked_name);
    res.json(isExisted);
});

module.exports = router;