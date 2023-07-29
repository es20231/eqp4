const express = require('express');
const router = express.Router();
const Library = require('../models/library.js');
const multer = require('multer');
const requireLogin = require('../middleware/requireLogin');

// Configurando o armazenamento do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

// Filtro para permitir apenas imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('O arquivo enviado não é uma imagem!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Rota para salvar imagem
router.post(
  '/library/save-image',
  upload.single('image'),
  requireLogin,
  async (req, res) => {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: 'Por favor, selecione uma imagem para salvar.' });
    }

    const fileName = req.file.filename;
    const newImage = new Library({
      fileName: fileName,
      uploadedBy: req.user._id,
    });

    try {
      await newImage.save();
      const imageId = newImage._id;
      return res.json({
        message: 'Imagem salva com sucesso',
        imageId: imageId,
      });
    } catch (err) {
      console.error('Erro ao salvar a imagem no banco de dados:', err);
      return res
        .status(500)
        .json({ error: 'Erro ao salvar a imagem no banco de dados' });
    }
  },
);

router.delete('/library/delete-image/:id', requireLogin, async (req, res) => {
  const imageId = req.params.id;

  try {
    const deletedImage = await Library.findByIdAndDelete(imageId);
    if (!deletedImage) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    return res.json({ message: 'Imagem removida com sucesso' });
  } catch (err) {
    console.error('Erro ao remover a imagem do banco de dados:', err);
    return res
      .status(500)
      .json({ error: 'Erro ao remover a imagem do banco de dados' });
  }
});

module.exports = router;
