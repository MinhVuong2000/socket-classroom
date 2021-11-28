const express = require('express');
const router = express.Router();
const assignments = require('./assignments')
const classes_db = require('../../../models/classes')


router.get('/', async function(req, res) {
    const item = await classes_db.one(req.id_class, req.jwtDecoded.data.id);
    console.log(item);
    res.json(item);
});

router.use('/assignments', assignments);


module.exports = router;