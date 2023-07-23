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

router.put("/post/like", requireLogin, (req, res) => {
  const postId = req.body.postID;
  Post.findOne({ _id: postId })
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: 'Post não encontrado' });
      }

      const ExisteIndexDeLike = post.likes.findIndex(item => item.toString() === req.user._id.toString());

      if (ExisteIndexDeLike === -1) {
        post.likes.push(req.user._id);
      } else {
        post.likes.splice(ExisteIndexDeLike, 1);
      }

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

  Post.findOne({ _id: postId })
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: 'Post not found.' });
      }

      const ExisteIndexdeDislike = post.dislikes.findIndex(item => item.toString() === req.user._id.toString());

      if (ExisteIndexdeDislike === -1) {
        post.dislikes.push(req.user._id);
      } else {
        post.dislikes.splice(ExisteIndexdeDislike, 1);
      }

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
