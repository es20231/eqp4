const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");
const Post = mongoose.model("Post");
const Library = mongoose.model("Library");
const multer = require("multer");
const fs = require("fs");

// Configurando o multer para o upload de imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

// Filtrar apenas imagens .jpg e .png
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb("Somente imagens .jpg, .jpeg e .png são permitidas!", false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB para o tamanho do arquivo
  fileFilter: imageFilter, // Aplicar o filtro personalizado para imagens
}).single("profilePhoto");

// Get User By Username
router.get(
  "/user/get-by-username/:username",
  requireLogin,
  async (req, res) => {
    const username = req.params.username;

    try {
      // Encontrar o usuário pelo username
      const user = await User.findOne({ username: username });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // Encontrar os posts do usuário usando a função populate
      const posts = await Post.find({ postedBy: user._id });

      // Encontrar a library do usuário usando a função populate
      const library = await Library.find({ uploadedBy: user._id });

      // Retornar o usuário com os posts como atributo
      res.json({
        ...user._doc,
        posts,
        library,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Ocorreu um erro ao buscar o usuário." });
    }
  }
);

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
      res.status(200).json({ message: "Usuário removido com sucesso." });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json({ error: "Usuário não encontrado." });
    });
});

// Rota para editar o perfil do usuário
router.put(
  "/user/edit-current-user-profile/:userId",
  requireLogin,
  upload,
  async (req, res) => {
    const userId = req.params.userId;

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      // Atualizar os campos de acordo com os dados fornecidos na requisição
      if (req.body.name) {
        user.name = req.body.name;
      }
      if (req.body.description) {
        user.description = req.body.description;
      }
      // Se houver um arquivo de imagem enviado, atualizar o campo "profilePhoto"
      if (req.file) {
        // Primeiro, vamos remover a imagem anterior se ela existir
        if (user.profilePhoto) {
          fs.unlinkSync("./uploads/" + user.profilePhoto); // Remover a imagem do diretório
        }
        user.profilePhoto = req.file.filename; // Atualizar o campo com o novo caminho da imagem
      }
      // Verificar se a opção para remover a foto de perfil foi marcada
      if (req.body.removeProfilePhoto) {
        // Primeiro, vamos remover a imagem atual se ela existir
        if (user.profilePhoto) {
          fs.unlinkSync("./uploads/" + user.profilePhoto); // Remover a imagem do diretório
        }
        user.profilePhoto = ""; // Atualizar o campo para vazio, removendo a imagem do banco de dados
      }
      // Salvar as alterações no banco de dados
      const updatedUser = await user.save();

      res.json({
        message: "Perfil atualizado com sucesso.",
        user: updatedUser,
      });
    } catch (error) {
      // Verificando se o erro é relacionado ao campo profilePhoto
      if (error.errors && error.errors.profilePhoto) {
        return res.status(422).json({ error: "URL de imagem inválida" });
      }
      console.error("Erro ao editar perfil:", error);
      return res.status(500).json({ error: "Erro ao editar perfil." });
    }
  }
);

router.put("/user/follow", requireLogin, async (req, res) => {
  const { followId } = req.body;
  const { user } = req;

  try {
    // Added Auth User to Params User Followers List
    const updatedUser = await User.findByIdAndUpdate(
      followId,
      {
        $push: { followers: user._id },
      },
      {
        new: true,
      }
    );

    // Added Params User to Auth User Following List
    const updatedLoggedInUser = await User.findByIdAndUpdate(
      user._id,
      {
        $push: { following: followId },
      },
      { new: true }
    ).select("-password");

    res.json(updatedLoggedInUser);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

router.put("/user/unfollow", requireLogin, async (req, res) => {
  try {
    // Remove Auth User from Params User Followers List
    const updatedUser = await User.findByIdAndUpdate(
      req.body.unfollowId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      }
    );

    // Remove Params User from Auth User Following List
    const updatedLoggedInUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $pull: { following: req.body.unfollowId },
      },
      { new: true }
    ).select("-password");

    res.json(updatedLoggedInUser);
  } catch (err) {
    return res.status(422).json({ error: err.message });
  }
});

module.exports = router;
