require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");

// Register User
router.post("/auth/register", (req, res) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    return res
      .status(400)
      .json({ error: "Por favor, preencha todos os campos." });
  }

  // Check if the email or username is already registered
  User.findOne({ $or: [{ email: email }, { username: username }] })
    .then((existingUser) => {
      if (existingUser) {
        if (existingUser.email === email) {
          return res.status(409).json({ error: "E-mail já está cadastrado." });
        } else if (existingUser.username === username) {
          return res
            .status(409)
            .json({ error: "Nome de usuário já cadastrado." });
        }
      } else {
        // If email and username are not already registered, proceed with saving the new user
        bcrypt
          .hash(password, 12)
          .then((hashedpassword) => {
            const user = new User({
              name,
              email,
              username,
              password: hashedpassword,
            });

            user
              .save()
              .then((user) => {
                return res
                  .status(201)
                  .json({ message: "Usuário criado com sucesso!" });
              })
              .catch((err) => {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Erro interno ao cadastrar novo usuário!" });
              });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Erro interno ao cadastrar novo usuário!" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Erro interno ao cadastrar novo usuário!" });
    });
});

//login
router.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Por favor, preencha todos os campos." });
  }

  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({
        error: "O e-mail inserido não pertence a um usuário cadastrado.",
      });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          res.json({ token, data: savedUser });
        } else {
          return res.status(422).json({
            error:
              "A senha está incorreta, recupere a senha ou tente novamente.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .json({ message: "Erro interno ao cadastrar novo usuário!" });
      });
  });
});

// Logout
router.post("/auth/logout", (req, res) => {
  const token = req.header("Authorization");

  // Verificar se o token está presente
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  // Invalidar o token
  jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido." });
    }

    return res.status(200).json({ message: "Logout realizado com sucesso." });
  });
});

//recupera os dados do usuário autenticado
router.get('/auth/get-user-data', (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Não autorizado" })
  }

  const token = authorization.split(' ')[1]; // Eliminando 'Bearer '

  const decodedToken = jwt.verify(token, JWT_SECRET ?? '')
  if (!decodedToken._id) {
    return res.status(401).json({ error: "Não autorizado" })
  }

  const id = decodedToken._id
  User.findById(id)
    .then(user => {
      if (user) {
        const { password, ...loggedUser } = user._doc // Removendo o campo 'password' do objeto 'user'
        return res.json(loggedUser)
      } else {
        return res.status(401).json({ error: "Não autorizado" })
      }
    })
    .catch(error => {
      console.error('Erro ao buscar usuário:', error.message);
      return res.status(500).json({ error: "Erro ao buscar usuário" })
    })
})

module.exports = router
