const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

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

router.post("/post/create", requireLogin, (req, res) => {
  const { title, body } = req.body;
  
  if (!title || !body) {
    return res
      .status(422)
      .json({ error: "Por favor, adicione todos os parametros" });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
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
router.put('/post/like', requireLogin, (req, res) => {
const postId = req.body.postId;
  const userId = req.user._id;

  Post.findById(postId)
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: 'Post não encontrado' });
      }

      // Verifica se o usuário já deu dislike anteriormente
      const ExisteDislikeIndex = post.dislikes.findIndex(item => item.toString() === userId.toString());

      // Se o usuário já deu dislike, remove-o do array de dislikes
      if (ExisteDislikeIndex !== -1) {
        post.dislikes.splice(ExisteDislikeIndex, 1);
      }

      // Verifica se o usuário já deu like anteriormente
      const existelikeIndex = post.likes.findIndex(item => item.toString() === userId.toString());

      // Se o usuário já deu like, não faz nada
      if (existelikeIndex !== -1) {
        return res.json(post);
      }

      // Adiciona o usuário ao array de likes
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


router.put('/post/dislike', requireLogin, (req, res) => {
  const postId = req.body.postId;
  const userId = req.user._id;
  Post.findById(postId)
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: 'Post não encontrado' });
      }

      // Verifica se o usuário já deu like anteriormente
      const existeindexLike = post.likes.findIndex(item => item.toString() === userId.toString());

      // Se o usuário já deu like, remove-o do array de likes
      if (existeindexLike !== -1) {
        post.likes.splice(existeindexLike, 1);
      }

      // Verifica se o usuário já deu dislike anteriormente
      const ExisteDislikeIndex = post.dislikes.findIndex(item => item.toString() === userId.toString());

      // Se o usuário já deu dislike, não faz nada
      if (ExisteDislikeIndex !== -1) {
        return res.json(post);
      }

      // Adiciona o usuário ao array de dislikes
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
