var express = require('express');
var router = express.Router();
var User = require('../models/users');
const { response } = require('express');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware');
const dotenv = require('dotenv')
dotenv.config()

// Ragister
router.post('/registration', async (req, res, next) => {
    // Ambil data yang akan ditambahkan
    let name = req.body.name;
    let email = req.body.email;
    let pass = req.body.password;
    let avatar = req.body.avatar;
    let active = req.body.active;
    
    // Tambahkan data ke dalam database
    await User.create({
      name: name,
      email: email,
      pass: pass,
      avatar: avatar,
      active: active
    }).then((result) => {
      let response = {
        message: "Data berhasil ditambahkan",
      };
      res.json(response);
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

    return res.status(200).json({ message: 'Reset password token sent to your email.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

//Reset Password
router.post('/reset-password/:resetToken', async (req, res) => {
  var { resetToken } = req.params;
  const { pass } = req.body;

  try {
    const user = await User.findOne({ where: { resetToken } });
    // const user = await sequelize.query(`SELECT * FROM user WHERE resetToken = '${resetToken}' AND resetTokenExpiration > '${new Date().toISOString()}'`, { type: Sequelize.QueryTypes.SELECT });
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset password token' });
    }
    if(new Date(user.resetTokenExpiration) < new Date()){
      return res.status(400).json({ message: 'reset password token has expired.' });
    }

    const email = user.email;
    resetToken = null;
    const resetTokenExpiration = null;

    await User.update({
      pass,
      resetToken,
      resetTokenExpiration
    }, { where: { email } });

    //await sequelize.query(`UPDATE users SET password = '${password}', resetToken = null, resetTokenExpiration = null WHERE id = ${user[0].id}`);

    return res.status(200).json({ message: 'Password reset successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

//Profil
router.get('/profil', authMiddleware, async (req, res) => {
  //const { id } = req.params;
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findByPk(decodedToken.userId, {
    attributes: ['name', 'email', 'avatar']
  });

  res.json(user);
});

//Update Profil
router.post('/profil/update',authMiddleware, async (req, res) => {
  
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const id = decodedToken.userId;
  let name = req.body.name;
  let avatar = req.body.avatar;

  try{
    const user = await User.findByPk(id);
    await User.update({
      name: name,
      avatar: avatar
    }, { where: { id } });

    return res.status(200).json({ message: 'Change profil successfully.' });
  }catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});

//Change Password
router.post('/change-pass/:id', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const id = decodedToken.userId;
  let pass = req.body.pass;
  let newPass = req.body.newPass;
  let repeatNewPass = req.body.repeatNewPass;

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
