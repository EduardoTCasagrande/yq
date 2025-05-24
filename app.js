// Requisitos: Node.js instalado
// Para rodar: npm init -y && npm install express body-parser

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulando banco de dados (pode ser substituído por SQLite depois)
let reposicaoPlanejada = {
  "helena": 3,
  "arthur": 1
};

let contagemAtual = {};

app.get('/reposicao', (req, res) => {
  res.json({ reposicao: reposicaoPlanejada, atual: contagemAtual });
});

app.post('/bipar', (req, res) => {
  const { sku } = req.body;

  if (!reposicaoPlanejada[sku]) {
    return res.status(400).json({ status: 'erro', mensagem: `SKU '${sku}' não está na lista de reposição.` });
  }

  if (!contagemAtual[sku]) {
    contagemAtual[sku] = 0;
  }

  if (contagemAtual[sku] >= reposicaoPlanejada[sku]) {
    return res.status(400).json({ status: 'erro', mensagem: `Quantidade de '${sku}' já atingida.` });
  }

  contagemAtual[sku] += 1;
  res.json({ status: 'ok', mensagem: `SKU '${sku}' registrado com sucesso.`, atual: contagemAtual });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});