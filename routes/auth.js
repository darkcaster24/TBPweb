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

  res.json({ token })
});

module.exports = router;
