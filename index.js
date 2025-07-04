const venom = require('venom-bot');
const express = require('express');

const app = express();
app.use(express.json());

let client = null;

venom
  .create({
    session: 'versozap',
    headless: false,
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe', // caminho do seu Chromec:
  })
  .then((cli) => {
    client = cli;
    console.log('✅ Conectado ao WhatsApp!');
  })
  .catch((error) => {
    console.error('Erro ao conectar com o WhatsApp:', error);
  });
// Rota para enviar mensagem
app.post('/enviar', async (req, res) => {
  const { telefone, mensagem } = req.body;

  if (!client) {
    return res.status(500).json({ erro: 'Cliente WhatsApp não conectado' });
  }

  try {
    await client.sendText(`${telefone}@c.us`, mensagem);
    return res.json({ status: 'Mensagem enviada com sucesso' });
  } catch (err) {
    return res.status(500).json({ erro: 'Erro ao enviar mensagem', detalhes: err });
  }
});

client.onMessage((message) => {
  // Ignora mensagens de grupos
  if (message.isGroupMsg) return;

  // Ignora mensagens que não sejam comandos
  if (!message.body.toLowerCase().startsWith('versozap')) return;

  // Processa comandos
  console.log("Mensagem relevante recebida:", message.body);
});

app.listen(3000, () => {
  console.log('Servidor de envio rodando em http://localhost:3000');
});
