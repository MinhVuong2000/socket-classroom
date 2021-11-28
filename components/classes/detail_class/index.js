const express = require('express');
const router = express.Router();
const assignments = require('./assignments')
const classes_db = require('../../../models/classes')
const authMiddleWare = require('../../../middlewares/auth_middleware.mdw')


router.get('/', async function(req, res) {
    const item = await classes_db.one(req.id_class, req.jwtDecoded.data.id);
    console.log(item);
    res.json(item);
});

router.delete('/', authMiddleWare.isOwnerClass, async function(req, res){
    await classes_db.del(req.id_class);
    const items = await classes_db.all(req.jwtDecoded.data.id);
    res.status(200).json(items);
})

router.use('/assignments', assignments);


module.exports = router;