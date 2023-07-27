const express = require("express");
const path = require("path");

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Aplicação inicializada com sucesso na porta: ${port}`);
});
