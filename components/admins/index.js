const router = express.Router();
const AuthMiddleWare = require('../../middlewares/auth_middleware.mdw');

const admins_db = require('../../models/admins');
const manage_admins = require('./manage_admins/index')
const manage_users = require('./manage_users/index')
const manage_classes = require('./manage_classes/index')

router.get('/', async function(req, res){
    const id = req.jwtDecoded.data.id;
    profile = await admins_db.one(id);
    return res.json(profile);
});

router.post('/manage-admins', AuthMiddleWare.isSuperAdmin, manage_admins);
router.post('/manage-users', manage_users);
router.post('/manage-classes', manage_classes);


