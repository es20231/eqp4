const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const { MONGOURI } = require('./keys')

require("./models/user")

app.use(express.json())
app.use(require('./routes/auth'))

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
  console.log("Conectado ao Mongo")
})
mongoose.connection.on('err', (err) => {
  console.log("Erro ao conectar o Mongo", err)
})

app.listen(port, () => {
  console.log(`####### REALGRAM API #######`);
  console.log(`Servidor iniciado na porta: ${port}`);
});
