var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware');
const dotenv = require('dotenv')
dotenv.config()

router.get('/',(req, res) => {
  res.render('login');
});

router.get('/inbox', (req, res) => {
  res.render('inbox');
});

router.get('/send', (req, res) => {
  res.render('send');
});

router.get('/home', authMiddleware, (req, res) => {
  res.render('home');
});

router.get('/register',(req, res) => {
  res.render('register');
});

router.get('/profil', (req, res) => {
  res.render( 'profil');
});

router.get('/change-pass', authMiddleware, (req, res) => {
  res.render( 'change_pass');
});

router.get('/review', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'review.html'));
});

router.get('/forgot-pass', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'forgot_pass.html'));
});

router.get('/pass-token', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'pass_token.html'));
});

router.get('/new-pass', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'new_pass.html'));
});

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
