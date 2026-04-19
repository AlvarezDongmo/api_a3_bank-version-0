const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { comptes, transactions } = require('../data/db');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Dépôts et retraits
 */

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Liste toutes les transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Liste des transactions
 */
router.get('/', (req, res) => {
  res.json({ succes: true, total: transactions.length, transactions });
});

/**
 * @swagger
 * /api/transactions/{idCompte}:
 *   get:
 *     summary: Transactions d'un compte
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: idCompte
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Transactions du compte
 *       404:
 *         description: Compte introuvable
 */
router.get('/:idCompte', (req, res) => {
  const compte = comptes.find(c => c.id === req.params.idCompte);
  if (!compte) {
    return res.status(404).json({ succes: false, message: 'Compte introuvable' });
  }
  const transactionsCompte = transactions.filter(t => t.idCompte === req.params.idCompte);
  res.json({ succes: true, compte: compte.nom, transactions: transactionsCompte });
});

/**
 * @swagger
 * /api/transactions/depot:
 *   post:
 *     summary: Faire un dépôt
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCompte
 *               - montant
 *             properties:
 *               idCompte:
 *                 type: string
 *                 example: uuid-du-compte
 *               montant:
 *                 type: number
 *                 example: 50000
 *               description:
 *                 type: string
 *                 example: Salaire du mois
 *     responses:
 *       201:
 *         description: Dépôt effectué avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Compte introuvable
 */
router.post('/depot', (req, res) => {
  const { idCompte, montant, description } = req.body;

  if (!idCompte || !montant) {
    return res.status(400).json({ succes: false, message: 'idCompte et montant sont obligatoires' });
  }
  if (montant <= 0) {
    return res.status(400).json({ succes: false, message: 'Le montant doit être positif' });
  }

  const compte = comptes.find(c => c.id === idCompte);
  if (!compte) {
    return res.status(404).json({ succes: false, message: 'Compte introuvable' });
  }

  compte.solde += montant;

  const transaction = {
    id: uuidv4(),
    idCompte,
    type: 'DEPOT',
    montant,
    description: description || 'Dépôt',
    soldeAvant: compte.solde - montant,
    soldeApres: compte.solde,
    date: new Date().toISOString()
  };

  transactions.push(transaction);
  res.status(201).json({
    succes: true,
    message: `Dépôt de ${montant} FCFA effectué`,
    transaction,
    nouveauSolde: compte.solde
  });
});

/**
 * @swagger
 * /api/transactions/retrait:
 *   post:
 *     summary: Faire un retrait
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idCompte
 *               - montant
 *             properties:
 *               idCompte:
 *                 type: string
 *                 example: uuid-du-compte
 *               montant:
 *                 type: number
 *                 example: 10000
 *               description:
 *                 type: string
 *                 example: Courses
 *     responses:
 *       201:
 *         description: Retrait effectué avec succès
 *       400:
 *         description: Solde insuffisant ou données invalides
 *       404:
 *         description: Compte introuvable
 */
router.post('/retrait', (req, res) => {
  const { idCompte, montant, description } = req.body;

  if (!idCompte || !montant) {
    return res.status(400).json({ succes: false, message: 'idCompte et montant sont obligatoires' });
  }
  if (montant <= 0) {
    return res.status(400).json({ succes: false, message: 'Le montant doit être positif' });
  }

  const compte = comptes.find(c => c.id === idCompte);
  if (!compte) {
    return res.status(404).json({ succes: false, message: 'Compte introuvable' });
  }

  if (compte.solde < montant) {
    return res.status(400).json({
      succes: false,
      message: `Solde insuffisant. Solde actuel: ${compte.solde} FCFA`
    });
  }

  compte.solde -= montant;

  const transaction = {
    id: uuidv4(),
    idCompte,
    type: 'RETRAIT',
    montant,
    description: description || 'Retrait',
    soldeAvant: compte.solde + montant,
    soldeApres: compte.solde,
    date: new Date().toISOString()
  };

  transactions.push(transaction);
  res.status(201).json({
    succes: true,
    message: `Retrait de ${montant} FCFA effectué`,
    transaction,
    nouveauSolde: compte.solde
  });
});

module.exports = router;