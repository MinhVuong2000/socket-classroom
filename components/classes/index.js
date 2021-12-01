const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const AuthMiddleWare = require('../../middlewares/auth_middleware.mdw')
const classed_db = require('../../models/classes');
const class_user_db = require('../../models/class_user');
const detail_class = require('./detail_class')
// const BASEURL = 'http://localhost:3001/classes/inviteclass/'
const BASEURL = 'https://classroom-assigment-fe.herokuapp.com/classes/inviteclass/'

/* GET home page. */
router.get('/', async function(req, res, next) {
    if(req.jwtDecoded){
        //console.log(req.jwtDecoded.data.id);
        const allData = await classed_db.all(req.jwtDecoded.data.id);
        res.json(allData);
    }
    else{
        return res.json(null);
    }
});

router.post('/', async function(req, res, next){
    //const randomstr = randomstring(8);
    //link = link + randomstr;
    console.log(req.jwtDecoded);
    if(req.jwtDecoded){
        let enlink = encodeURI(req.body.class_name);
        console.log("vao add class");
        console.log("encode", enlink)
        const new_class = {
            class_name: req.body.class_name,
            description: req.body.description,
            id_admin: req.jwtDecoded.data.id,
            invitation_link: enlink
        };
        console.log("new class", new_class);
        await classed_db.add(new_class);
        const allclassed_db = await classed_db.all(req.jwtDecoded.data.id);
        res.json(allclassed_db);
    }
    else{
        res.json(false);
    }
    
}),

router.use('/detail/:id', AuthMiddleWare.isAuthen, detail_class)

router.get('/inviteclass/:link', async function(req, res, next) {
    if(req.jwtDecoded){
        const linkclass = await encodeURI(req.params.link);
        console.log("link class",linkclass);
        console.log("idusser: ",req.jwtDecoded.data.id);

        const itemid = await classed_db.findIDClassByLink(linkclass);
        console.log("item:" + itemid);
        if(itemid == null){
            return res.json(null);
        }
        let flag = await class_user_db.checkIsExistUserOnClass(itemid, req.jwtDecoded.data.id)
        if(!flag){
            await class_user_db.addUserToClass(itemid, req.jwtDecoded.data.id);
        }
        const items = await classed_db.one(itemid, req.jwtDecoded.data.id);
        res.json(items);
    }
    else{
        return res.json(null);
    }
});

router.post('/sendinvite/:classlink', async function(req, res, next){
    //TODO: get email from form
    //let email = req.body.email;
    let email = req.body.email;
    console.log(email);
    let classlink = encodeURI(req.params.classlink);
    classlink = BASEURL + classlink;
    console.log(classlink);
    let transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
              user: 'classroom.webnangcao@gmail.com',
              pass: 'thangtrinhvuong'
            },
    });
    
    var mailOptions={
        from: "classroom.webnangcao@gmail.com",
        to: email,
       subject: "Invite link to Classroom",
       html: `<p>Dear you,${email}</p>`+
       "<h3>This is an invitation link to classroom </h3>"  + 
       "<h1 style='font-weight:bold;'>" + classlink +"</h1>" +
       "<p>Thank you</p>",
    };
     
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.json(false);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
    });
    return res.json(true);
}),

router.get('/isExistedClassName', async function(req, res, next){
    const checked_name = req.query.checked_name;
    const isExisted = await classed_db.isExisted(checked_name);
    console.log("isExistedName:",isExisted)
    res.json(isExisted);
});

module.exports = router;
