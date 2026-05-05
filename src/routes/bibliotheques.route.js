import bibliothequesController from '../controllers/bibliotheques.controller.js';

// Nous avons besoin d'importer le module express pour utiliser la classe Router
import express from 'express';
// Nous créons un objet router qui va nous permettre de gérer les routes
const router = express.Router();

router.get('/livre/liste', bibliothequesController.listeLivre);
router.get('/livre/:id', bibliothequesController.trouverLivre);
router.post('/livre/', bibliothequesController.ajouterLivre);
/*
router.put('/livre/:id', modifierLivre);
router.put('/livre/status/:id', modifierStatusLivre);
router.delete('/livre/:id', supprimerLivre);

router.post('/pret/', ajouterPret);
router.put('/pret/:id', modifierPret);
router.put('/pret/status/:id', modifierStatusPret);
router.delete('/pret/:id', supprimerPret);
*/
export default router;