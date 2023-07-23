const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/allpost',requireLogin,(req,res) => {
  Post.find()
  .populate("postedBy", "_id name")
  .sort('-createdAt')
  .then(posts =>{
    res.json({posts})
  })
  .catch(err=>{
    console.log(err)
  })
})
router.get('/getsubpost',requireLogin,(req,res) => {
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
router.post('/createpost', requireLogin, (req, res) => {
  const { title, body } = req.body
  if (!title || !body) {
    return res.status(422).json({ error: "Por favor, adicione todos os parametros" })
  }
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    postedBy: req.user,
  })
  post.save().then(result => {
      res.json({ post: result })
    })
    .catch((err) => {
      console.log(err)
    })
})
router.get('/meupost',requireLogin,(req,res)=>{
  Post.find({postedBy:req.user._id})
  .populate("postedBy","_id name")
  .then(meupost=>{
    res.json({meupost})
  })
  .catch(err=>{
    console.log(err)
  })
})
router.put('/like', requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $push:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})
router.put('/dislike', requireLogin,(req,res)=>{
  Post.findByIdAndUpdate(req.body.postId,{
    $pull:{likes:req.user._id}
  },{
    new:true
  }).exec((err,result)=>{
    if(err){
      return res.status(422).json({error:err})
    }else{
      res.json(result)
    }
  })
})

router.put('/comentario', requireLogin,(req,res)=>{
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


module.exports = router
