const jwtHelper = require("../utils/jwt.helper");
const class_user_db = require('../models/class_user')
const classes_db = require('../models/classes')
const assignments_db = require('../models/assignments')
 
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

 
let isAuthor = async (req, res, next) => {
    const tokenFromClient = req.headers["x-access-token"];
    console.log(tokenFromClient);
    if (tokenFromClient) {
        try {
            const decoded = await jwtHelper.verifyToken(tokenFromClient, accessTokenSecret);
            req.jwtDecoded = decoded;
            next();
        } catch (error) {
            return res.status(400).json('400');
        }
    } else {
        return res.status(401).json('401');
    };
}

let isAuthen = async (req, res, next) => {
    const idclass = parseInt(req.params.id);
    const isExistUserOnClass = await class_user_db.checkIsExistUserOnClass(idclass, req.jwtDecoded.data.id)
    if (isExistUserOnClass==false)
        return res.status(403);//.json(403)
    req.id_class = req.params.id;
    next();
}

let isOwnerClass = async (req, res, next) => {
    const id_class = parseInt(req.id_class);
    const id_user = req.jwtDecoded.data.id;
    const isOwnerClass = await classes_db.isOwnerClass(id_class, id_user)
    if (isOwnerClass==false){
        return res.status(403).json({
            msg:'You are not admin of the class'
        });
    }
    next();
}

let isAssignmentinClass = async (req, res, next) => {
    const id_class = parseInt(req.id_class);
    const id_assignment = req.params.id
    const isOwnerClass = await assignments_db.isAssignmentinClass(id_assignment, id_class);
    if (isOwnerClass==false){
        return res.status(403).json({
            msg:'This assignment is not in the class'
        });
    }
    next();
}

module.exports = {
    isAuthor: isAuthor,
    isAuthen: isAuthen,
    isOwnerClass: isOwnerClass,
    isAssignmentinClass: isAssignmentinClass
};