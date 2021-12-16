const express = require('express');
const router = express.Router();
const assignments = require('./assignments')
const classes_db = require('../../../models/classes')
const class_user_db = require('../../../models/class_user')
const authMiddleWare = require('../../../middlewares/auth_middleware.mdw')


router.get('/', async function(req, res) {
    console.log("Vao cai detail class ne",req.jwtDecoded.data.id_uni )
    const item = await classes_db.one(req.id_class, req.jwtDecoded.data.id_uni);
    console.log(item);
    res.json(item);
});

router.post('/add-students', async (req, res) => {
    // add a new student to class_user, 
    // full name displayed in member list to get full name in table class_user
    let new_students_list = req.body.new_students;
    const id_class = req.body.id_class;
    for (let i = 0; i < new_students_list.length; i++){
        new_students_list[i].id_class = id_class;
        new_students_list[i].is_teacher = false;
    }
    await class_user_db.add(new_students_list);
    const updated_student_list = await class_user_db.roleByClass(id_class, false);
    console.log("updated_student_list ADD: ", updated_student_list);
    res.json(updated_student_list);
});

router.patch('/update-students-name', async (req, res) => {
    // change full_name of existed students in class_user, 
    // full name displayed in member list to get full name in table class_user
    let repeat_students_list = req.body.repeat_students;
    // console.log(repeat_students_list);
    const id_class = req.body.id_class;
    for (let i = 0; i < repeat_students_list.length; i++){
        await class_user_db.modify_fullname(id_class, repeat_students_list[i].id_uni_user, repeat_students_list[i].full_name_user);
    }
    const updated_student_list = await class_user_db.roleByClass(id_class, false);
    console.log("updated_student_list Change fullname: ", updated_student_list);
    res.json(updated_student_list);
});

router.delete('/', authMiddleWare.isOwnerClass, async function(req, res){
    await classes_db.del(req.id_class);
    const items = await classes_db.all(req.jwtDecoded.data.id);
    res.status(200).json(items);
})

router.use('/assignments', assignments);


module.exports = router;