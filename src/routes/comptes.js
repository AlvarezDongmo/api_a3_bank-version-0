const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { comptes } = require('../data/db');

/**
 * @swagger
 * tags:
 *   name: Comptes
 *   description: Gestion des comptes bancaires
 */

/**
 * @swagger
 * /api/comptes:
 *   get:
 *     summary: Liste tous les comptes
 *     tags: [Comptes]
 *     responses:
 *       200:
 *         description: Liste des comptes récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 succes:
 *                   type: boolean
 *                 total:
 *                   type: integer
 *                 comptes:
 *                   type: array
 */
router.get('/', (req, res) => {
  res.json({ succes: true, total: comptes.length, comptes });
});

/**
 * @swagger
 * /api/comptes/{id}:
 *   get:
 *     summary: Voir un compte spécifique
 *     tags: [Comptes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Compte trouvé
 *       404:
 *         description: Compte introuvable
 */
router.get('/:id', (req, res) => {
  const compte = comptes.find(c => c.id === req.params.id);
  if (!compte) {
    return res.status(404).json({ succes: false, message: 'Compte introuvable' });
  }
  res.json({ succes: true, compte });
});

/**
 * @swagger
 * /api/comptes:
 *   post:
 *     summary: Créer un nouveau compte
 *     tags: [Comptes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - email
 *             properties:
 *               nom:
 *                 type: string
 *                 example: Dongmo
 *               prenom:
 *                 type: string
 *                 example: Alvarez
 *               email:
 *                 type: string
 *                 example: alvarez@example.com
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Données manquantes ou email déjà utilisé
 */
router.post('/', (req, res) => {
  const { nom, prenom, email } = req.body;

  if (!nom || !prenom || !email) {
    return res.status(400).json({
      succes: false,
      message: 'Les champs nom, prenom et email sont obligatoires'
    });
  }

  const emailExiste = comptes.find(c => c.email === email);
  if (emailExiste) {
    return res.status(400).json({
      succes: false,
      message: 'Un compte avec cet email existe déjà'
    });
  }

  const nouveauCompte = {
    id: uuidv4(),
    nom,
    prenom,
    email,
    solde: 0,
    dateCreation: new Date().toISOString()
  };

  comptes.push(nouveauCompte);
  res.status(201).json({
    succes: true,
    message: 'Compte créé avec succès',
    compte: nouveauCompte
  });
});

module.exports = router;