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

router.get('/forgot-pass', (req, res) => {
  res.render('forgot_pass');
});

router.get('/pass-token', (req, res) => {
  res.render('pass_token');
});

router.get('/new-pass', (req, res) => {
  res.render('new_pass');
});

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
