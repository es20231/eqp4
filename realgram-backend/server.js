const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  console.log(`####### GET [/] #######`);
  console.log("req", req);
  console.log("res", res);
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`####### REALGRAM API #######`);
  console.log(`Servidor iniciado na porta: ${port}`);
});
