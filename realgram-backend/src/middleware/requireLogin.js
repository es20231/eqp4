require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ error: "Você deve fazer o login" })
  }
  const token = authorization.replace("Bearer ", "")
  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "Você deve fazer o login" })
    }

    const { _id } = payload
    User.findById(_id).then(userdata => {
      req.user = userdata
    })
    next()
  })

}