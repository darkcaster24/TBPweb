const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const dotenv = require('dotenv');
const router = express.Router();

dotenv.config();

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ where: { email } })

  if (!user) {
    return res.status(401).json({ message: 'Email salah' })
  }

  if (password !== user.pass) {
    return res.status(401).json({ message: 'Password salah' });
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' })
  user.update({ active: true }); 
  res.json({ token })
});


// Fungsi logout
router.post('/logout', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    const user = await User.findOne({ where: { id: decoded.userId } }); 

    if (!user) {
      return res.status(404).json({ message: 'User not found' }); 
    }

    user.update({ active: false }); 
    res.status(200).json({ message: 'Logout success' }); 
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal server error' }); 
  }
});



module.exports = router;
