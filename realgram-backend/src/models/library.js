const mongoose = require('mongoose');

const userImageSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
});

const UserImage = mongoose.model('UserImage', userImageSchema);

module.exports = UserImage;