const jwt = require('jsonwebtoken')
const User = require('../models/users')
const dotenv = require('dotenv')
dotenv.config()

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ where: { id: decodedToken.userId } })

    if (!user) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

module.exports = authMiddleware;
