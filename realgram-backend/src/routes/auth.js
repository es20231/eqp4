const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')

router.post('/signup', (req, res) => {
  const { name, email, username, password } = req.body
  if (!name || !email || !username || !password) {
    return res.status(422).json({ error: "Por favor, preencha todos os campos." })
  }
  User.findOne({ username: username }).then((savedUser) => {
    if (savedUser) {
      return res.status(422).json({ error: "Nome de usuário já cadastrado." })
    }
    bcrypt.hash(password, 12).then(hashedpassword => {
      const user = new User({
        name,
        email,
        username,
        password: hashedpassword
      })
      user.save().then(user => {
        res.json({ message: "Salvo com sucesso!" })
      }).catch(err => {
        console.log(err)
      })
    })

  }).catch(err => {
    console.log(err)
  })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(422).json({ error: "Por favor, adicione seu email ou senha." })
  }
  User.findOne({ email: email }).then(savedUser => {
    if (!savedUser) {
      return res.status(422).json({ error: "Email ou senha inválido." })
    }
    bcrypt.compare(password, savedUser.password).then(doMatch => {
      if (doMatch) {
        res.json({ message: "Login realizado com sucesso" })
      } else {
        return res.status(422).json({ error: "Email ou senha inválido." })
      }
    }).catch(err => {
      console.log(err)
    })
  })
})

module.exports = router