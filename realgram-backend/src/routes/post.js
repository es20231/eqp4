const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const multer = require("multer");

// Configurando o armazenamento do multer para postagem(linha 42)
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

router.get("/post/get-all", (req, res) => {
  Post.find()
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get('/post/get-timeline',requireLogin,(req,res) => {
  //Se postado por seguindo
  Post.find({postedBy:{$in:req.user.following}})
  .populate("postedBy", "_id name")
  .sort('-createdAt')
  .then(posts =>{
    res.json({posts})
  })
  .catch(err=>{
    console.log(err)
  })
})

router.post("/post/create", requireLogin,upload.single("image"), (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    return res
      .status(422)
      .json({ error: "Por favor, adicione todos os parametros" });
  }
  if(!req.file){
    return res.status(400).json({error: "Por favor, selecione uma imagem para postar"});
  }
  const photo = req.file.filename;

  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      return res.status(500).json({
        error: "Erro interno ao criar uma postagem, tente novamente.",
      });
    });
});

router.get("/post/get-current-user-posts", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((meupost) => {
      res.json({ meupost });
    })
    .catch((err) => {
      console.log(err);
    });
});
//versão atualizada do like
router.put('/post/like', requireLogin, (req, res) => {
const postId = req.body.postId;
  const userId = req.user._id;

  Post.findById(postId)
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: 'Post não encontrado' });
      }

      
      const ExisteDislikeIndex = post.dislikes.findIndex(item => item.toString() === userId.toString());

      
      if (ExisteDislikeIndex !== -1) {
        post.dislikes.splice(ExisteDislikeIndex, 1);
      }

      
      const existelikeIndex = post.likes.findIndex(item => item.toString() === userId.toString());

     
      if (existelikeIndex !== -1) {
        return res.json(post);
      }

      
      post.likes.push(userId);

      post.save((err, updatedPost) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          res.json(updatedPost);
        }
      });
    });
});

//Versão atualizada do dislike
router.put('/post/dislike', requireLogin, (req, res) => {
  const postId = req.body.postId;
  const userId = req.user._id;
  Post.findById(postId)
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: 'Post não encontrado' });
      }

      
      const existeindexLike = post.likes.findIndex(item => item.toString() === userId.toString());

      
      if (existeindexLike !== -1) {
        post.likes.splice(existeindexLike, 1);
      }

     
      const ExisteDislikeIndex = post.dislikes.findIndex(item => item.toString() === userId.toString());

      
      if (ExisteDislikeIndex !== -1) {
        return res.json(post);
      }

      
      post.dislikes.push(userId);

      post.save((err, updatedPost) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          res.json(updatedPost);
        }
      });
    });
});


router.put('/post/comment', requireLogin,(req,res)=>{
  const comentario = {
    text:req.body.text,
    postedBy: req.user._id
  }
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{comentarios:comentario}
  },{
    new:true
  })
  .populate("comentarios.postedBy","_id name")
  .populate("postedBy","_id name")
  .exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

module.exports = router;
