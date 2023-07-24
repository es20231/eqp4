const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const postSchemma = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: 'no photo',
  },
  likes:[{type:ObjectId,ref:"User"}],
  dislikes:[{type:ObjectId,ref:"User"}],
  comentarios:[{
    text:String,
    postedBy:{type:ObjectId,ref:"User"}
  }],
  postedBy: {
    type: ObjectId,
    ref: 'User',
  },
},{timestamps:true})

mongoose.model('Post', postSchemma)
