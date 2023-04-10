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
  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
  const id = decodedToken.userId;

  const user = await User.findAll({where:{id:{[Op.ne]: id}},
    attributes: ['id','name']
  });

  res.json(user);
});

// Sent Document
router.post('/sent-doc', authMiddleware, upload.single('pdf'),  async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const id = decodedToken.userId;
    let id_signer = req.body.id;
    let status = 'pending';
    const pdf = {
        filename: req.file.originalname,
        pdf: req.file.buffer
    };

    await Doc.create({
        sender_id: id,
        signer_id: id_signer,
        filename: pdf.filename,
        doc: pdf.pdf,
        status: status
    }).then((result) => {
        let response = {
          message: "Data berhasil ditambahkan",
        };
        res.json(response);
    }).catch((err) => {
        console.log(err);
    })
});

//Show sent document
router.get('/show-sent-doc', authMiddleware,  async (req, res) => {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const id = decodedToken.userId;
    Doc.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
    Doc.belongsTo(User, { foreignKey: 'signer_id', as: 'signer' });

    try {
        const documents = await Doc.findAll({where:{sender_id: id},
          attributes: [
            'status'
          ],
          include: [
            {
              model: User,
              as: 'signer',
              attributes: [
                'id',
                ['name','signer_name']
              ]
            }
          ]
        });
        res.json(documents);
      } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
      }
});

//Received Document
router.get('/show-received-doc', authMiddleware,  async (req, res) => {

    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const id = decodedToken.userId;
    Doc.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
    Doc.belongsTo(User, { foreignKey: 'signer_id', as: 'signer' });

    try {
        const documents = await Doc.findAll({where:{signer_id: id},
          attributes: [
            'status'
          ],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: [
                'id',
                ['name','sender_name']
              ]
            }
          ]
        });
        res.json(documents);
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


module.exports = router;
