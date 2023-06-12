var express = require('express');
const { Sequelize } = require('sequelize');
const { Op } = require('sequelize');
var router = express.Router();
var User = require('../models/users');
var Doc = require('../models/docs');
const { response } = require('express');
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middleware/authMiddleware');
const dotenv = require('dotenv')
dotenv.config()
const sequelize = require('../config/database');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


//Signer
router.get('/signer', authMiddleware, async (req, res) => {
  const token = req.cookies.token
  // const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const id = decodedToken.userId;

  const user = await User.findAll({where:{id:{[Op.ne]: id}},
    attributes: ['id','name']
  });

  // res.json(user[0].id);
  res.render('send',{user});
});

// Sent Document
router.post('/sent-doc', authMiddleware, upload.single('document'),  async (req, res) => {
    // const token = req.headers.authorization.split(' ')[1]
    const token = req.cookies.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const id = decodedToken.userId;
    let id_signer = req.body.signer;
    let filename = req.body.filename;
    let status = 'pending';
    let pdf = req.file.buffer;
    // const pdf = {
    //     filename: req.file.originalname,
    //     pdf: req.file.buffer
    // };

    await Doc.create({
        sender_id: id,
        signer_id: id_signer,
        filename: filename,
        doc: pdf,
        status: status
    }).then((result) => {
        // let response = {
        //   message: "Data berhasil ditambahkan",
        // };
        // res.json(response);
        res.redirect('/docs/home')
    }).catch((err) => {
        console.log(err);
    })
});

//Show sent document
router.get('/home', authMiddleware,  async (req, res) => {
    // const token = req.headers.authorization.split(' ')[1]
    const token = req.cookies.token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const id = decodedToken.userId;
    

    try {
      // Doc.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
      if (!Doc.associations.hasOwnProperty('signer')) {
        Doc.belongsTo(User, { foreignKey: 'signer_id', as: 'signer' });
      }
      const documents = await Doc.findAll({where:{sender_id: id},
        attributes: [
          'id',
          'status',
          'filename',
          'created_at'
        ],
        include: [
          {
            model: User,
            as: 'signer',
            attributes: [
              'id',
              'name'
              // ['name','signer_name']
            ]
          }
        ]
      });
      // res.json(documents);
      // const signerNames = documents.map(doc => doc.signer.signer_name);
      // console.log(documents[0].signer.name);
      // console.log(documents[0].filename);
      // console.log(documents[0].created_at);
      // Doc.removeAttribute('sender');
      // Doc.removeAttribute('signer');
      res.render('home',{documents})
    } catch (error) {
      console.log(error);
      // res.render('home')
      // res.status(500).send('Internal server error');
    }
});

//Received Document
router.get('/inbox', authMiddleware,  async (req, res) => {
    const token = req.cookies.token
    // const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const id = decodedToken.userId;

    try {
      if (!Doc.associations.hasOwnProperty('sender')) {
      Doc.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
      }
      // Doc.belongsTo(User, { foreignKey: 'signer_id', as: 'signer' });
      const documents = await Doc.findAll({where:{signer_id: id},
        attributes: [
          'id',
          'status',
          'filename',
          'created_at'
        ],
        include: [
          {
            model: User,
            as: 'sender',
            attributes: [
              'id',
              'name'
            ]
          }
        ]
      });

      res.render('inbox',{documents})
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server error');
    }
});

// Sentback Document
router.post('/sentback-doc', authMiddleware, upload.single('pdf'),  async (req, res) => {
  // const token = req.headers.authorization.split(' ')[1]
  // const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  // const id = decodedToken.userId;
  
  let id = req.body.id;
  let status = req.body.status;
  const pdf = {
      filename: req.file.originalname,
      pdf: req.file.buffer
  };

  await Doc.update({
      filename: pdf.filename,
      doc: pdf.pdf,
      status: status
  }, { where: { id } }).then((result) => {
      let response = {
        message: "Data berhasil ditambahkan",
      };
      res.json(response);
  }).catch((err) => {
      console.log(err);
  })
});

//review document
router.get('/review/:id', async(req, res) => {
  const id = req.params.id;
  Doc.findByPk(id)
    .then(pdf => {
      const fileBuffer = Buffer.from(pdf.doc, 'binary');
      console.log(fileBuffer)
      // res.setHeader('Content-Type', 'application/pdf');
      // res.send(pdf.pdf);
      res.render('review',{id,fileBuffer})
    })
    .catch(error => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
