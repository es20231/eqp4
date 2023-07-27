const express = require("express");
const path = require("path");

const app = express();
const port = 3001; // ou qualquer outra porta de sua escolha

// Middleware para servir os arquivos estáticos da pasta /dist
app.use(express.static(path.join(__dirname, "dist")));

// Rota para servir o index.html em todas as solicitações GET
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Inicie o servidor na porta especificada
app.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
});
