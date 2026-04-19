const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '🏦 API Bancaire',
      version: '1.0.0',
      description: 'API de gestion de comptes bancaires — dépôts et retraits',
      contact: {
        name: 'Alvarez Dongmo',
        url: 'https://alvarez3tech.com',
        email: 'contact@alvarez3tech.com'
      }
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Serveur local' },
      { url: 'https://banque-api.onrender.com', description: 'Serveur de production' }
    ]
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  customCss: `
    .swagger-ui .topbar { background-color: #1a3c5e; }
    .cahier-btn {
      position: fixed;
      top: 12px;
      right: 20px;
      background: white;
      color: #1a3c5e !important;
      font-weight: bold;
      font-size: 14px;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      z-index: 9999;
      text-decoration: none;
      border: 2px solid white;
    }
    .cahier-btn:hover { background: #e8f0fe; }
  `,
  customSiteTitle: '🏦 API Bancaire',
  customJsStr: `
    window.addEventListener('load', function() {
      setTimeout(function() {
        var topbar = document.querySelector('.swagger-ui .topbar-wrapper');
        if (topbar) {
          var btn = document.createElement('a');
          btn.href = '/cahier';
          btn.target = '_blank';
          btn.className = 'cahier-btn';
          btn.innerHTML = '📄 Cahier des charges';
          topbar.appendChild(btn);
        }
      }, 1000);
    });
  `
}));

// Redirection accueil → Swagger
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Cahier des charges
app.get('/cahier', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cahier.html'));
});

const comptesRoutes = require('./routes/comptes');
const transactionsRoutes = require('./routes/transactions');
app.use('/api/comptes', comptesRoutes);
app.use('/api/transactions', transactionsRoutes);

module.exports = app;