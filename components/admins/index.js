const express = require('express');
const router = express.Router();
const AuthMiddleWare = require('../../middlewares/auth_middleware.mdw');

const admins_db = require('../../models/admins');
const manage_admins = require('./manage_admins')
const manage_users = require('./manage_users')
const manage_classes = require('./manage_classes')

router.get('/', async function(req, res){
    const id = req.jwtDecoded.data.id;
    profile = await admins_db.one(id);
    return res.json(profile);
});

router.use('/manage-admins', manage_admins);
router.use('/manage-users', manage_users);
router.use('/manage-classes', manage_classes);

module.exports = router;

module.exports = router;

