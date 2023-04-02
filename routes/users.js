var express = require('express');
var router = express.Router();
var User = require('../models/users');
const { response } = require('express');

/* TAMBAH USERS */
router.post('/', async (req, res, next) => {
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


module.exports = router;
