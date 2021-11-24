const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const classed_db = require('./models/classes');
const BASEURL = 'http://localhost:3000/classes/inviteclass/'

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

/* GET a id. */
router.get('/detail/:id', async function(req, res, next) {
    if(req.jwtDecoded){
        const idclass = parseInt(req.params.id);
        console.log(req.jwtDecoded.data.id);
        const item = await classed_db.one(idclass, req.jwtDecoded.data.id);
        res.json(item);
    }
    else{
        return res.json(null);
    }
    
});

router.get('/inviteclass/:link', async function(req, res, next) {
    const linkclass = encodeURI(req.params.link);
    console.log(linkclass);
    const item = await classed_db.findClassByLink(linkclass);
    res.json(item);
});

router.get('/sendinvite/:classlink', async function(req, res, next){
    //TODO: get email from form
    //let email = req.body.email;
    let email = "trinhlehcmus.172@gmail.com"
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
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  
        res.redirect(`/`);
    });
}),

router.post('/', async function(req, res, next){
    const link = req.body.class_name;
    //const randomstr = randomstring(8);
    //link = link + randomstr;
    console.log(link);
    let enlink = encodeURI(link);
    const new_class = {
        class_name: req.body.class_name,
        description: 'req.body.description',
        id_admin: 2,
        invitation_link: enlink
    };
    await classed_db.add(new_class);
    const allclassed_db = await classed_db.all();
    res.json(allclassed_db);
}),

router.get('/isExistedClassName', async function(req, res, next){
    const checked_name = req.query.checked_name;
    const isExisted = await classed_db.isExisted(checked_name);
    res.json(isExisted);
});

module.exports = router;