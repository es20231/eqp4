const express = require('express');
const router = express.Router();
const UserImage = require('../models/library.js');
const multer = require('multer');

// Configurando o armazenamento do multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/user_images');
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
router.post('/save-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Por favor, selecione uma imagem para salvar.' });
  }

  const fileName = req.file.filename;
  const newImage = new UserImage({
    fileName: fileName,
  });

  newImage.save((err) => {
    if (err) {
      console.error('Erro ao salvar a imagem no banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao salvar a imagem no banco de dados' });
    }

    return res.json({ message: 'Imagem salva com sucesso' });
  });
});

router.delete('/remove-image/:id', (req, res) => {
  const imageId = req.params.id;

  UserImage.findByIdAndDelete(imageId, (err, deletedImage) => {
    if (err) {
      console.error('Erro ao remover a imagem do banco de dados:', err);
      return res.status(500).json({ error: 'Erro ao remover a imagem do banco de dados' });
    }

    if (!deletedImage) {
      return res.status(404).json({ error: 'Imagem não encontrada' });
    }

    return res.json({ message: 'Imagem removida com sucesso' });
  });
});

module.exports = router;
