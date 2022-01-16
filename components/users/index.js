const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const user_db = require('../../models/users')


router.get('/profile', async function(req, res) {
    console.log(req.jwtDecoded.data);
    //const profile = await user_db.one(req.jwtDecoded.data.id, true);
    const profile = await req.jwtDecoded.data;
    
    return res.json(profile);
});

router.post('/check-password', async function (req, res){
    user_id = req.jwtDecoded.data.id;
    const user = await user_db.one(user_id, true);
    console.log("user", user);
    const password = req.body.password;
    console.log("password", password);
    const ret = bcrypt.compareSync(password, user.password);
    return res.json(ret);
});

router.patch('/update-profile', async function(req, res) {
    updated_profile = req.body.updated_profile;
    console.log("Update profile:", updated_profile);
    id_user = req.jwtDecoded.data.id;
    await user_db.updateProfile(id_user, updated_profile);
    return res.status(200).json(true);
});
router.patch('/admin-update-profile', async function(req, res) {
    let newstuid = req.body.id_uni;let id_user = req.body.id;
    console.log("Update admin profile:", newstuid, "   ", id_user);
    await user_db.adminUpdateProfile(id_user, newstuid);
    return res.status(200).json(true);
});

router.patch('/unmapstudentid', async function(req, res) {
    let id_user = req.body.id;
    console.log("Unmap admin profile:",  id_user);
    await user_db.updateStudentID(id_user, null);
    return res.status(200).json(true);
});

router.patch('/update-password', async function(req, res) {
    console.log("New password: ", req.body.new_password)
    id_user = req.jwtDecoded.data.id;
    const hash = bcrypt.hashSync(req.body.new_password, 10);
    await user_db.updateProfile(id_user, {password: hash});
    return res.status(200).json(true);
});

module.exports = router;