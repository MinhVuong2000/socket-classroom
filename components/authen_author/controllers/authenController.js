const class_db = require('../../../models/classes');
const user_db = require('../../../models/users');
const admin_db = require('../../../models/admins');
const class_user_db = require('../../../models/class_user')
const bcrypt = require('bcryptjs');
const jwtHelper = require("../../../utils/jwt.helper");
const nodemailer = require('nodemailer');

const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;


exports.register = async function(req, res) {
    //Get infor from form at FE (username/password/email/phone/mssv/fullname/address)
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
    if (flag){
        return res.json(true);
    }
    return res.json(false);
}

exports.registeradmin = async function(req, res) {
    //Get infor from form at FE (username/password/email/phone/mssv/fullname/address)
    const hash = bcrypt.hashSync(req.body.password, 10);

    const user = {
        username: req.body.username,
        password: hash,
        full_name: req.body.fullname,
        email: req.body.email,
        create_time: new Date().toISOString(),
        otp: -1
    }

    let flag = await admin_db.add(user);
    if (flag){
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
    const rowsAdmin = await admin_db.findAdminByUsername(username)
    const rowsEmail = await user_db.findUserByEmail(email);
    const rowsEmailAdmin = await admin_db.findAdminByEmail(email);
    const rowsMssv = await user_db.findUserByMSSV(mssv, true);
    if (rowsUsername !== null)  
        return res.json({message: 'Invalid Username!'});
    if (rowsAdmin !== null)  
        return res.json({message: 'Invalid Username!'});
    if (rowsEmail !== null)  
        return res.json({message: 'Invalid Email!'});
    if (rowsEmailAdmin !== null)  
        return res.json({message: 'Invalid Email!'});
    if (rowsMssv !== null)  
        return res.json({message: 'Invalid MSSV!'});
    return res.json(true);
}

exports.is_available_admin = async (req, res)=>{
    const username = req.body.username;
    const email = req.body.email;
    if(username == '')
        return res.json ({message: 'Username không được trống'});
    if(email == '')
        return res.json ({message: 'Email không được trống'});
    const rowsUsername = await user_db.findUserByUsername(username);
    const rowsAdmin = await admin_db.findAdminByUsername(username)
    const rowsEmail = await user_db.findUserByEmail(email);
    const rowsEmailAdmin = await admin_db.findAdminByEmail(email);
    if (rowsUsername !== null)  
        return res.json({message: 'Invalid Username!'});
    if (rowsAdmin !== null)  
        return res.json({message: 'Invalid Username!'});
    if (rowsEmail !== null)  
        return res.json({message: 'Invalid Email!'});
    if (rowsEmailAdmin !== null)  
        return res.json({message: 'Invalid Email!'});
    return res.json(true);
}

exports.is_available_mssv = async (req, res)=>{
    const mssv = req.query.mssv;
    const rowsUser = await user_db.checkAvailableMSSV(mssv);
    if (rowsUser === null)  
        return res.json(true);
    return res.json(false);
}

exports.is_available_email = async (req, res)=>{
    const email = req.query.email;
    const rowsUser = await user_db.findUserByEmail(email);
    const rowsEmailAdmin = await admin_db.findAdminByEmail(email);
    if (rowsEmailAdmin !== null)  
        return res.json(false);
    if (rowsUser === null)  
        return res.json(true);
    return res.json(false);
}

exports.is_exist_email = async (req, res)=>{
    const email = req.query.email;
    const rowUsers = await reader.findUserByEmail(email);
    const rowsEmailAdmin = await admin_db.findAdminByEmail(email);
    if (rowsEmailAdmin !== null)  
        return res.json(rowsEmailAdmin.username);
    if (rowUsers === null) 
        return res.json(false);
    return res.json(rowUsers.username);
    
}

exports.get_otp = async (req, res) => {
    const email = req.body.email;
    const rowsUser = await user_db.findUserByEmail(email);
    if (rowsUser === null)  
        return res.json(false);
    // send otp to email
    let otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log("email, otp to sendOTP:", email, otp);
    await user_db.updateOTP(email, otp);
    let transporter = nodemailer.createTransport(
        {
            service: 'gmail',
            auth: {
                user: 'newspaper.vuonghieutrinh@gmail.com',
                pass: 'vuongthangtrinh'
            },
    });
    
    var mailOptions={
        from: "newspaper.vuonghieutrinh@gmail.com",
        to: email,
        subject: "Classroom Clone: Mã OTP cho việc đặt lại mật khẩu",
        html: `<p>Chào bạn,${email}</p>`+
        "<h3>Hãy nhập OTP bên dưới để thiết lập lại mật khẩu </h3>"  + 
        "<h1 style='font-weight:bold;'>" + otp +"</h1>" +
        "<p>Cảm ơn</p>",
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        else{
            console.log('mail sent');
         } 
        console.log('Message sent: %s', info.messageId);   
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
    return res.json(true);
}

exports.check_otp = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log("check otp:", req.body);
    const row_user = await user_db.findUserByEmail(email);
    if (row_user === null || row_user.otp != otp)
        return res.json(false);
    await user_db.updateOTP(email, -1);
    return res.json(true);
}

exports.change_password = async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const email = req.body.email;
    await user_db.updatePassword(email, hash);
    return res.json(true);
}

exports.signin = async (req, res) => {
    const row_user = await user_db.findUserByUsername(req.body.username);
    const row_admin = await admin_db.findAdminByUsername(req.body.username);
    if (row_user != null) {
        return checkPassword(row_user, req, res);
    }
    if (row_admin != null) {
        return checkPasswordAdmin(row_admin, req, res);
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
    return handle_login_successfully(row_user, req, res, true, false);
}

async function checkPassword(rows, req, res) {
  const ret = bcrypt.compareSync(req.body.password, rows.password);
  if(rows.otp == -2){
    console.log("Tài khoản đã bị khóa")
    return res.json({'access_token':'error_password'});
  }
  if (ret===false){
    console.log("Password không đúng")
    return res.json({'access_token':'error_password'});
  }
  else{
    console.log("login thanh cong")
    return handle_login_successfully(rows, req, res, false, false);
  }
}
async function checkPasswordAdmin(rows, req, res) {
    const ret = bcrypt.compareSync(req.body.password, rows.password);
    if (ret===false){
      console.log("Password không đúng")
      return res.json({'access_token':'error_password'});
    }
    else{
      console.log("login admin thanh cong");
      return handle_login_successfully(rows, req, res, false, true);
    }
  }
exports.login_successfully = handle_login_successfully;

async function handle_login_successfully(rows, req, res, loggedBySocial, isadmin) {
    // dang nhap thanh cong thi luu thong tin bang JWT
    try{
        //This is JWT
        
        const accessToken = await jwtHelper.generateToken(rows, accessTokenSecret, accessTokenLife, loggedBySocial, isadmin);
        let data = {};
        data.isAdmin = isadmin;
        data.access_token = accessToken;
        return res.json(data);
    } catch (error) {
        return res.status(500).json(error);
    }
}
