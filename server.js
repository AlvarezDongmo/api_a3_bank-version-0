const app = require('./src/app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🏦 Serveur bancaire démarré sur le port ${PORT}`);
  console.log(`👉 http://localhost:${PORT}`);
});