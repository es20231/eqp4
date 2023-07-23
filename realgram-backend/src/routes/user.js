const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");

// Get User By Username
router.get("/user/get-by-username/:username", requireLogin, (req, res) => {
  const username = req.params.username;

  User.findOne({ username: username })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao buscar o usuário." });
    });
});

// User List
router.get("/user/get-all", requireLogin, (req, res) => {
  User.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao buscar os usuários." });
    });
});

// Delete User
router.delete("/user/delete/:userId", requireLogin, (req, res) => {
  const userId = req.params.userId;

  User.findByIdAndRemove(userId)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      res.status(200).json({ message: "Usuário removido com sucesso." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao remover o usuário." });
    });
});

module.exports = router;
