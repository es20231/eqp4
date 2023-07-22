require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')

//middleware para verificação de token
router.get('/protected', requireLogin, (req, res) => {
  res.send("Hello user")
})

//cadastro de usuário
router.post('/signup', (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res.status(422).json({ error: "Por favor, preencha todos os campos." });
  }

  // Check if the email or username is already registered
  User.findOne({ $or: [{ email: email }, { username: username }] }).then((existingUser) => {
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({ error: "E-mail já está cadastrado." });
      } else if (existingUser.username === username) {
        return res.status(409).json({ error: "Nome de usuário já cadastrado." });
      }
    } else {
      // If email and username are not already registered, proceed with saving the new user
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          name,
          email,
          username,
          password: hashedpassword,
        });

        user.save().then((user) => {
          res.json({ message: "Salvo com sucesso!" });
        }).catch((err) => {
          console.log(err);
        });
      }).catch((err) => {
        console.log(err);
      });
    }
  }).catch((err) => {
    console.log(err);
  });
});

//Listar usuário
router.get('/users', (req, res) => {
  User.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao buscar os usuários." });
    });
});

//login
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
        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
        res.json({ token })
      } else {
        return res.status(422).json({ error: "Email ou senha inválido." })
      }
    }).catch(err => {
      console.log(err)
    })
  })
})

// Encontrar usuário pelo nome de usuário (username)
router.get('/users/:username', (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      res.json(user);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao buscar o usuário." });
    });
});

//remover usuário pelo id
router.delete('/users/:userId', (req, res) => {
  const userId = req.params.userId;

  User.findByIdAndRemove(userId)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      res.json({ message: "Usuário removido com sucesso." });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao remover o usuário." });
    });
});

module.exports = router
