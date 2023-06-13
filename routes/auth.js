const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();


//Login
router.post('/test', async (req, res) => {
  const email = req.body.logEmail;
  const password = req.body.logPassword;

  console.log(email);
});

//Login
router.post('/login', async (req, res) => {
  const email = req.body.logEmail;
  const password = req.body.logPassword;

  const user = await User.findOne({ where: { email } })

  if (!user) {
    // return res.status(401).json({ message: 'Email salah' })
    return res.send("<script>window.location.href = '/';alert('Email salah');</script>");

  }

  if (password !== user.pass) {
    // return res.status(401).json({ message: 'Password salah' });
    return res.send("<script>window.location.href = '/';alert('Password salah');</script>");
    // res.send("<script>window.alert('Password salah');</script>");
  }

  if (user.active) {
    // return res.status(401).json({ message: 'Password salah' });
    return res.send("<script>window.location.href = '/';alert('Akun Sedang Aktif!');</script>");
    // res.send("<script>window.alert('Password salah');</script>");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '3h' })
  user.update({ active: true }); 
  res.cookie('token', token, { httpOnly: true })
  // res.json({ token })
  res.redirect('/docs/home');
});


// Fungsi logout
router.get('/logout', async (req, res) => {
  try {
    // const token = req.headers.authorization.split(' ')[1]; 
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findOne({ where: { id: decoded.userId } }); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }

    user.update({ active: false }); 
    res.clearCookie('token');
    // res.status(200).json({ message: 'Logout success' }); 
    res.redirect('/');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
});



module.exports = router;
