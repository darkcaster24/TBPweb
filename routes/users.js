var express = require('express');
const multer = require('multer');
var router = express.Router();
var User = require('../models/users');
const { response } = require('express');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware');
const dotenv = require('dotenv')
dotenv.config()

const upload = multer();
router.use(upload.any());

//Login
router.post('/test', async (req, res) => {
  const email = req.body.email;
  const password = req.body.pass;

  console.log(email);
});

router.post('/register', async (req, res, next) => {
    // Ambil data yang akan ditambahkan
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.pass;
    let jabatan = req.body.jabatan;
    let signature = req.files.find(file => file.fieldname === 'signature').buffer; 
    let avatar = req.files.find(file => file.fieldname === 'avatar').buffer;

    console.log(name);
    // Tambahkan data ke dalam database
    await User.create({
      name: name,
      email: email,
      pass: pass,
      jabatan: jabatan,
      signature: signature,
      avatar: avatar

    }).then((result) => {
      // let response = {
      //   message: "Registration Succes",
      // };
      // res.json(response);
      res.redirect('/');
    }).catch((err) => {
      console.log(err);
    })
    
});

//Reset Password (Confirm Email)
router.post('/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'User with this email does not exist.' });
    }

    const resetToken = Math.random().toString(36).substring(7);
    const resetTokenExpiration = new Date(Date.now() + 36000000);
    // TODO: send reset password email to user

    await User.update({
      resetToken,
      resetTokenExpiration
    }, { where: { email } });

    res.render('pass_token')
    // return res.status(200).json({ message: 'Reset password token sent to your email.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

//Reset Token
router.post('/reset-password/token',async(req,res)=>{
  let resetToken = req.body.token;
  try {
    const user = await User.findOne({ where: { resetToken } });
    // const user = await sequelize.query(`SELECT * FROM user WHERE resetToken = '${resetToken}' AND resetTokenExpiration > '${new Date().toISOString()}'`, { type: Sequelize.QueryTypes.SELECT });
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset password token' });
    }
    if(new Date(user.resetTokenExpiration) < new Date()){
      return res.status(400).json({ message: 'reset password token has expired.' });
    }

    const userEmail = user.email;
    // resetToken = null;
    // const resetTokenExpiration = null;
    res.render('new_pass',{userEmail});
    // return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
})

//Reset Password
router.post('/reset-password/new-password/:email', async (req, res) => {
  let pass = req.body.password;
  let email = req.params.email;
  try {
    const user = await User.findOne({ where: { email} });
    // const user = await sequelize.query(`SELECT * FROM user WHERE resetToken = '${resetToken}' AND resetTokenExpiration > '${new Date().toISOString()}'`, { type: Sequelize.QueryTypes.SELECT });

    const resetToken = null;
    const resetTokenExpiration = null;
    await User.update({
      pass,
      resetToken,
      resetTokenExpiration
    }, { where: { email } });

    //await sequelize.query(`UPDATE users SET password = '${password}', resetToken = null, resetTokenExpiration = null WHERE id = ${user[0].id}`);
    // res.redirect('/');
    return res.send("<script>window.location.href = '/';alert('Ubah Password Berhasil');</script>");
    // return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

//Profil
router.get('/profil', authMiddleware, async (req, res) => {
  //const { id } = req.params;
  const token = req.cookies.token;
  // const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findByPk(decodedToken.userId, {
    attributes: ['name', 'jabatan', 'signature' ,'avatar']
  });
  console.log(user.signature);
  const avatarBuffer = Buffer.from(user.avatar, 'binary');
  const signatureBuffer = Buffer.from(user.signature, 'binary');
  const name = user.name;
  const jabatan = user.jabatan;
  res.render('profil',{ name,jabatan,signatureBuffer,avatarBuffer});
});

//Update Profil
router.post('/profil',authMiddleware, async (req, res) => {
  
  // const token = req.headers.authorization.split(' ')[1]
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const id = decodedToken.userId;
  let name = req.body.name;
  let jabatan = req.body.jabatan;
  console.log(name);
  // let avatar = req.body.avatar;
  let signature = req.files.find(file => file.fieldname === 'signature'); 
  let avatar = req.files.find(file => file.fieldname === 'avatar');

  // const user = await User.findByPk(id);
  const user = await User.findByPk(decodedToken.userId, {
    attributes: ['name', 'jabatan', 'signature' ,'avatar']
  });
  const avatarBuffer = Buffer.from(user.avatar, 'binary');
  const signatureBuffer = Buffer.from(user.signature, 'binary');

  if(!signature){
    signature=signatureBuffer;
  }else{
    signature=signature.buffer;
  }
  if(!avatar){
    avatar=avatarBuffer;
  }else{
    avatar=avatar.buffer;
  }

  try{
    
    await User.update({
      name: name,
      jabatan:jabatan,
      signature:signature,
      avatar: avatar
    }, { where: { id } });

    return res.status(200).json({ message: 'Change profil successfully.' });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

//Change Password
router.post('/change-pass', authMiddleware,  async (req, res) => {
  // const token = req.headers.authorization.split(' ')[1]
  const token = req.cookies.token;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const id = decodedToken.userId;
  let pass = req.body.password;
  let newPass = req.body.newPass;
  let repeatNewPass = req.body.confirmPassword;

  try{
    const user = await User.findByPk(id);
    if(pass !== user.pass){
      return res.status(200).json({ message: 'Wrong Password' });
    }
    if(newPass !== repeatNewPass){
      return res.status(200).json({ message: 'Password baru berbeda' });
    }

    await User.update({
      pass: newPass
    }, { where: { id } });

    return res.status(200).json({ message: 'Password change successfully.' });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
