require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const MAILER_SENDER_HOST = process.env.MAILER_SENDER_HOST;
// const MAILER_SENDER_PORT = process.env.MAILER_SENDER_PORT
const MAILER_SENDER_EMAIL = process.env.MAILER_SENDER_EMAIL;
const MAILER_SENDER_USER = process.env.MAILER_SENDER_USER;
const MAILER_SENDER_PASS = process.env.MAILER_SENDER_PASS;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const recoveryUserTemplate = require("../assets/recoveryUserTemplate");

// Configuração do serviço de email
const MailerTransporter = nodemailer.createTransport({
  host: MAILER_SENDER_HOST,
  auth: {
    user: MAILER_SENDER_USER,
    pass: MAILER_SENDER_PASS,
  },
});

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
router.get("/auth/get-user-data", (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const token = authorization.split(" ")[1]; // Eliminando 'Bearer '

  const decodedToken = jwt.verify(token, JWT_SECRET ?? "");
  if (!decodedToken._id) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const id = decodedToken._id;
  User.findById(id)
    .then((user) => {
      if (user) {
        const { password, ...loggedUser } = user._doc; // Removendo o campo 'password' do objeto 'user'
        return res.json(loggedUser);
      } else {
        return res.status(401).json({ error: "Não autorizado" });
      }
    })
    .catch((error) => {
      console.error("Erro ao buscar usuário:", error.message);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    });
});

// Rota para solicitar a recuperação de senha
router.post("/auth/forgot_password", (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ error: "Informe o email para recuperar a senha." });
  }

  User.findOne({ email }) // Verificar se o email está registrado no sistema
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .json({ error: "Email não encontrado no sistema." });
      }

      // Gerar token com prazo de expiração de 1h
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });

      console.log("token p/ email: " + token); // Token de recuperação no console

      // Enviar o token por email para ser usado na próxima etapa
      const mailOptions = {
        from: MAILER_SENDER_EMAIL,
        to: email,
        subject: "Recuperação de Senha",
        html: recoveryUserTemplate(token),
      };

      MailerTransporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Erro ao enviar e-mail:", error.message);
          return res.status(500).json({
            error: "Erro ao enviar o e-mail de recuperação de senha.",
          });
        }
        console.log("E-mail enviado:", info.response);
        return res.json({
          message: "Solicitação de recuperação de senha enviada com sucesso.",
        });
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar usuário:", error.message);
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    });
});

// Rota para alterar senha
router.post("/auth/change_pass", (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      error: "Informe o token e a nova senha para alterar a senha esquecida.",
    });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    // Verificar se o token é válido e se o ID do usuário está presente
    if (!decodedToken._id) {
      return res.status(401).json({ error: "Token inválido ou expirado." });
    }

    User.findById(decodedToken._id) // Encontrar o usuário pelo ID
      .then((user) => {
        if (!user) {
          return res.status(404).json({ error: "Usuário não encontrado." });
        }
        bcrypt
          .hash(newPassword, 12) // Criptografar a nova senha
          .then((hashedPassword) => {
            user.password = hashedPassword; // Atualizar a senha criptografada do usuário
            user
              .save()
              .then(() => {
                return res.json({ message: "Senha alterada com sucesso." });
              })
              .catch((error) => {
                console.error(
                  "Erro ao salvar a senha atualizada:",
                  error.message
                );
                return res
                  .status(500)
                  .json({ error: "Erro ao salvar a senha atualizada." });
              });
          })
          .catch((error) => {
            console.error("Erro ao criptografar a nova senha:", error.message);
            return res
              .status(500)
              .json({ error: "Erro ao criptografar a nova senha." });
          });
      })
      .catch((error) => {
        console.error("Erro ao buscar usuário:", error.message);
        return res.status(500).json({ error: "Erro ao buscar usuário." });
      });
  } catch (error) {
    console.error("Erro ao verificar o token:", error.message);
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
});

module.exports = router;
