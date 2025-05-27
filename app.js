const express = require('express'); 
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Página de reposição
app.get('/reposicao', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reposicao.html'));
});

let reposicaoPlanejada = {};
let contagemAtual = {};

app.post('/reposicao', (req, res) => {
  reposicaoPlanejada = req.body;
  contagemAtual = {}; // Zera a contagem
  console.log('Reposição carregada:', reposicaoPlanejada);
  res.json({
    status: 'ok',
    mensagem: 'Reposição atualizada com sucesso.',
    atual: contagemAtual,
    planejado: reposicaoPlanejada
  });
});

// Endpoint para registrar bips
app.post('/bipar', (req, res) => {
  const { sku } = req.body;

if (!reposicaoPlanejada[sku]) {
  return res.status(400).json({
    status: 'erro',
    mensagem: `SKU '${sku}' não está na lista de reposição.`
  });
}


  if (!contagemAtual[sku]) {
    contagemAtual[sku] = 0;
  }

  if (contagemAtual[sku] >= reposicaoPlanejada[sku]) {
    return res.status(400).json({
      status: 'erro',
      mensagem: `Quantidade de '${sku}' já atingida.`
    });
  }

  contagemAtual[sku] += 1;

  res.json({
    status: 'ok',
    mensagem: `SKU '${sku}' registrado com sucesso.`,
    atual: contagemAtual,
    planejado: reposicaoPlanejada
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
