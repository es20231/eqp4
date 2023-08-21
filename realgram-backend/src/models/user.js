const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  profilePhoto: {
    type: String
  },
  library: [{ type: ObjectId, ref: "Library" }],
  posts: [{ type: ObjectId, ref: "Post" }],
  followers: [{ type: ObjectId, ref: "User" }],
  following: [{ type: ObjectId, ref: "User" }]
})

mongoose.model("User", userSchema)