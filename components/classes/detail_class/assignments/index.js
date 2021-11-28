const express = require('express');
const router = express.Router();
const authMiddleWare = require('../../../../middlewares/auth_middleware.mdw')
const assignments_db = require('../../../../models/assignments')

//url: /detail/:id/assigments

router.get('/', async function(req, res, next) {
    //show list assignments
    //name, point
    const id_class = req.id_class;
    const items = await assignments_db.allInClass(id_class);
    res.status(200).json(items)
});

router.post("/", authMiddleWare.isOwnerClass, async function(req, res){
    console.log(req.body)
    console.log(req.id_class);
    new_assignment = {
        name: req.body.name,
        point: req.body.point,
        id_class: req.id_class
    }
    await assignments_db.add(new_assignment);
    new_assignments = await assignments_db.allInClass(req.id_class)
    return res.status(200).json(new_assignments);
});

router.get('/detail/:id', async function(req, res) {
    //show detail of a assignment
    //name, point
    const id_assignment = req.params.id;
    const item = await assignments_db.one(id_assignment);
    res.status(200).json(item)
});

router.delete('/detail/:id', authMiddleWare.isOwnerClass, authMiddleWare.isAssignmentinClass, async function(req, res){
    // authMiddleWare.isOwnerClass(req, res, next);
    console.log("req.params.id:",req.params.id);
    await assignments_db.del(req.params.id);
    return res.status(200).json(true);
});


module.exports = router;