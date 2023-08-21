require("dotenv").config();
const MONGOURI = process.env.MONGOURI;
const cors = require("cors");
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const multer = require("multer");

require("./models/user");
require("./models/post");
require("./models/library");

// Cors Config
const allowedOrigins = [
  "http://localhost:8080",
  "https://realgram-frontend.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));
app.use(require("./routes/library"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Conectado ao Mongo");
});
mongoose.connection.on("err", (err) => {
  console.log("Erro ao conectar o Mongo", err);
});

const server = app.listen(port, () => {
  console.log(`####### REALGRAM API #######`);
  console.log(`Servidor iniciado na porta: ${port}`);
});

module.exports = { app, server };
