const mongoose = require('mongoose');

const userImageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const UserImage = mongoose.model('UserImage', userImageSchema);

module.exports = UserImage;