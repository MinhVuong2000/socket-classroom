const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const user_db = require('../../models/users')
const classes_db = require('../../models/classes')
const assignments_db = require('../../models/assignments')
const notis_db = require('../../models/notifications')


router.get('/profile', async function(req, res) {
    console.log(req.jwtDecoded.data);
    const profile = await user_db.one(req.jwtDecoded.data.id, true);
    return res.json(profile);
});

router.get('/notifications', async (req, res) => {
    console.log("Get notifications");
    const notis = await notis_db.allInUser(req.jwtDecoded.data.id_uni);
    return res.json(notis);
})

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

router.patch('/update-password', async function(req, res) {
    console.log("New password: ", req.body.new_password)
    id_user = req.jwtDecoded.data.id;
    const hash = bcrypt.hashSync(req.body.new_password, 10);
    await user_db.updateProfile(id_user, {password: hash});
    return res.status(200).json(true);
});

module.exports = router;