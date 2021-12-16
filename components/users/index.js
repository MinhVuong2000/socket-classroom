const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const user_db = require('../../models/users')


router.get('/profile', async function(req, res) {
    console.log(req.jwtDecoded.data);
    const profile = await user_db.one(req.jwtDecoded.data.id, true);
    return res.json(profile);
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