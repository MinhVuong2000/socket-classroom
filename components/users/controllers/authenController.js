const class_db = require('../models/class.model');
const user_db = require('../models/user.model');
const class_user_db = require('../models/class_user.model')
const bcrypt = require('bcryptjs');
const moment = require('moment');
const nodemailer = require('nodemailer');
const jwtHelper = require("../../../utils/jwt.helper");

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


exports.passport_google = async (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const all_user = await user_db.all();
    let min = 0;
    all_user.forEach(character => {
        if (character.id < min) {
            min = character.id;
        }
    });
    //get the user data from google 
    const newUser = {
        full_name: profile.displayName,
        email: profile.emails[0].value,
        username: profile.emails[0].value,
        password: bcrypt.hashSync(profile.id,10),
        id_uni: min-1,
        otp:-1,
    }
    console.log(newUser)
    try {
        //find the user in our database 
        let user = await user_db.findUserByEmail(newUser.email);

        if (user) {
            //If user present in our database.
            console.log("Da ton tai google account")
            done(null, user)
        } else {
            // if user is not preset in our database save user data to database.
            console.log("Chua ton tai google account")
            let userID = await user_db.addNewUser(newUser);
            user = user_db.findUserByID(userID);
            done(null, user);
        }
    } catch (err) {
        console.error("Error login", err)
    }
}

exports.register = async function(req, res) {
    //Get infor from form at FE (username/password/email/phone/mssv/fullname/address)
    
    console.log(req.body);
    
    const hash = bcrypt.hashSync(req.body.password, 10);

    const user = {
        username: req.body.username,
        password: hash,
        full_name: req.body.fullname,
        id_uni: req.body.mssv,
        email: req.body.email,
        address: req.body.address,
        phone: req.body.phone,
        otp: -1
    }

    let flag = await user_db.addNewUser(user);
    console.log("add user", flag);
    if (flag){
        /*let transporter = nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
                    user: 'classroom.webnangcao@gmail.com',
                    pass: 'thangtrinhvuong'
                },
        });
        
        var mailOptions={
            from: "classroom.webnangcao@gmail.com",
            to: req.body.email,
            subject: "Notice create account successfully",
            html: `<p>Dear you,${req.body.email}</p>`+
            "<h3>This is a email to notice create account successfully </h3>"  + 
            "<p>Thank you</p>",
        };
         
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);   
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });*/
        return res.json(true);
    }
    return res.json(false);
}

exports.is_available = async (req, res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const mssv = req.body.mssv;
    if(username == '')
        return res.json ({message: 'Username không được trống'});
    if(email == '')
        return res.json ({message: 'Email không được trống'});
    if(mssv == '')
        return res.json ({message: 'MSSV không được trống'});
    const rowsUsername = await user_db.findUserByUsername(username);
    const rowsEmail = await user_db.findUserByEmail(email);
    const rowsMssv = await user_db.findUserByMSSV(mssv, true);
    if (rowsUsername !== null)  
        return res.json({message: 'Invalid Username!'});
    if (rowsEmail !== null)  
        return res.json({message: 'Invalid Email!'});
    if (rowsMssv !== null)  
        return res.json({message: 'Invalid MSSV!'});
    return res.json(true);
}

exports.is_available_email = async (req, res)=>{
    const email = req.query.email;
    const rowsUser = await user_db.findUserByEmail(email);
    if (rowsUser === null)  
        return res.json(true);
    return res.json(false);
}

exports.is_available_mssv = async (req, res)=>{
    const mssv = req.query.mssv;
    const rowsUser = await user_db.checkAvailableMSSV(mssv);
    if (rowsUser === null)  
        return res.json(true);
    return res.json(false);
}

exports.is_exist_email = async (req, res)=>{
    const email = req.query.email;
    console.log(email);
    const rowUsers = await reader.findUserByEmail(email);
    if (rowUsers === null) 
        return res.json(false);
    return res.json(rowUsers.UserName);
    
}

exports.signin = async (req, res) => {
    console.log("signin:", req.body)
    const row_user = await user_db.findUserByUsername(req.body.username);
    if (row_user != null) {
        return checkPassword(row_user, req, res);
    }
    console.log("Username không tồn tại!")
    return res.json({'access_token':'error_username'});
}

exports.google_signin = async (req, res) => {
    console.log("signin:", req.body);
    let row_user = await user_db.findUserByUsername(req.body.username);
    console.log("row_user:",row_user);
    if (row_user == null) {
        const new_user = req.body;
        new_user.password = bcrypt.hashSync(req.body.password, 10);
        await user_db.addNewUser(new_user);
    }
    row_user = await user_db.findUserByUsername(req.body.username);
    return handle_login_successfully(row_user, req, res, true);
}

async function checkPassword(rows, req, res) {
  const ret = bcrypt.compareSync(req.body.password, rows.password);
  if (ret===false){
    console.log("Password không đúng")
    return res.json({'access_token':'error_password'});
  }
  else{
    console.log("lgin thanh cong")
    return handle_login_successfully(rows, req, res, false);
  }
}

exports.login_successfully = handle_login_successfully;

async function handle_login_successfully(rows, req, res, loggedBySocial) {
    // dang nhap thanh cong thi luu thong tin bang JWT
    try{
        //This is JWT
        const accessToken = await jwtHelper.generateToken(rows, accessTokenSecret, accessTokenLife, loggedBySocial);
        let data = {};
        data.access_token = accessToken;
        return res.json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
}
