const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const librarySchema = new mongoose.Schema({
  fileName: { 
    type: String, 
    required: true 
  },
  uploadedBy: { 
    type: ObjectId, 
    ref: "User" 
  },
  uploadDate: {
    type: Date,
    default: Date.now // Define o valor padrão para o horário atual
  }
});

const Library = mongoose.model("Library", librarySchema);

module.exports = Library;
