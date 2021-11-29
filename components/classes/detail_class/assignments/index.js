const express = require('express');
const router = express.Router();
const authMiddleWare = require('../../../../middlewares/auth_middleware.mdw');
const { updateOrderByIdAssignment } = require('../../../../models/assignments');
const assignments_db = require('../../../../models/assignments')

//url: /detail/:id/assigments

router.get('/', async function(req, res, next) {
    //show list assignments
    //name, point
    const id_class = req.id_class;
    const items = await assignments_db.allInClass(id_class);
    await items.sort((firstItem, secondItem) => firstItem.orders - secondItem.orders);
    res.status(200).json(items)
});

router.post("/", authMiddleWare.isOwnerClass, async function(req, res){
    console.log(req.body)
    console.log(req.id_class);
    
    const item = await assignments_db.findMaxOrderByIdclass(req.id_class);
    let maxOrder = 0;
    if(item != false){
        maxOrder = item.orders + 1;
    }
    new_assignment = {
        name: req.body.name,
        point: req.body.point,
        id_class: req.id_class,
        orders: maxOrder
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
router.post('/updateorder', authMiddleWare.isOwnerClass, async function(req, res){
    // authMiddleWare.isOwnerClass(req, res, next);
    console.log("req.body.idclass:",req.body.idclass);
    console.log("Source and Destination: ", req.body.source,"; ", req.body.destination);
    const source = req.body.source;
    const des = req.body.destination;
    let minSourceDes = 0;
    let maxSourceDes = 0;
    const listitem = await assignments_db.allInClass(req.body.idclass);
    console.log(listitem);
    let mul = 1;
    if (source < des) {
        mul = -1;
        minSourceDes = source;
        maxSourceDes = des;
    }
    else{
        minSourceDes = des;
        maxSourceDes = source;
    }
    for(i = 0; i<listitem.length; i++){
        if(listitem[i].orders == source){
            await updateOrderByIdAssignment(listitem[i].id, des);
        }
        else
        if(listitem[i].orders >= minSourceDes && listitem[i].orders <= maxSourceDes){
            await updateOrderByIdAssignment(listitem[i].id, listitem[i].orders + mul);
        }
    }
    const listitem2 = await assignments_db.allInClass(req.body.idclass);
    console.log(listitem2);
    return res.status(200).json(listitem2);
});
router.post('/edit', authMiddleWare.isOwnerClass, async function(req, res){
    console.log("req.body edit:",req.body);
    const edititem = await assignments_db.editAssignment(req.body.idassignment, req.body.name, req.body.point);
    
    const listitem2 = await assignments_db.allInClass(req.body.idclass);
    await listitem2.sort((firstItem, secondItem) => firstItem.orders - secondItem.orders);
    console.log(listitem2);
    return res.status(200).json(listitem2);
});

module.exports = router;