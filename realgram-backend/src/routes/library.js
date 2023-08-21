const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const fs = require('fs');
const path = require('path');
const User = mongoose.model("User");
const Library = require("../models/library.js");
const multer = require('multer');
const requireLogin = require('../middleware/requireLogin.js');

// Configurando o armazenamento do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/user_images');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Filtro para permitir apenas imagens
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(('Somente imagens .jpg, .jpeg e .png são permitidas!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB para o tamanho do arquivo
  fileFilter: imageFilter
});

// Rota para upload de ate 10 imagens por envio
router.post('/library/save-image-list', requireLogin, (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ error: 'O limite por envio são de 10 imagens.' });
      }
    } else {
      next();
    }
  });
}, async (req, res) => {
  const userId = req.user.id; // ID do usuário autenticado

  try {
    const uploadedImages = req.files.map(file => ({
      fileName: file.filename,
      uploadedBy: new mongoose.Types.ObjectId(userId)
    }));

    await UserImage.create(uploadedImages);

    res.status(200).json({ message: 'Salvo com sucesso!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao enviar as imagens.' });
  }
});
  
// Rota para salvar uma imagem
router.post(
  "/library/save-image",
  upload.single("image"),
  requireLogin,
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Por favor, selecione uma imagem para salvar." });
    }

    const fileName = req.file.filename;
    const newImage = new Library({
      fileName: fileName,
      uploadedBy: req.user._id,
    });

    try {
      await newImage.save();
      return res.json({ message: "Imagem salva com sucesso" });
    } catch (err) {
      console.error("Erro ao salvar a imagem no banco de dados:", err);
      return res
        .status(500)
        .json({ error: "Erro ao salvar a imagem no banco de dados" });
      }
  }
);

//rota GET para recuperar informações sobre as imagens associadas a um usuário
router.get('/library/images/:userId', requireLogin, async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    // Encontre as imagens associadas ao usuário pelo ID do usuário
    const userImages = await UserImage.find({ uploadedBy: userId });

    res.status(200).json({ images: userImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao buscar as imagens.' });
  }
});

router.delete('/library/remove-image/:id', requireLogin, async (req, res) => {
  try {
    const imageId = req.params.id;
    const existingImage = await UserImage.findById(imageId);

    if (!existingImage) {
      return res.status(404).json({ error: 'Imagem não encontrada.' });
    }

    await UserImage.findByIdAndRemove(imageId);

    const imagePath = path.join('./public/user_images', existingImage.fileName);

    // Verificar se o arquivo existe antes de tentar excluí-lo
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      res.status(200).json({ message: 'Imagem removida com sucesso!' });
    } else {
      res.status(404).json({ error: 'Arquivo de imagem não encontrado.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ocorreu um erro ao remover a imagem.' });
  }
});


module.exports = router;
