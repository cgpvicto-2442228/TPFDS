import livresController from '../controllers/livres.controller.js';
import express from 'express';

const router = express.Router();

router.get('/liste', livresController.listeLivre);
router.get('/:id', livresController.trouverLivre);
router.post('/', livresController.ajouterLivre);
router.put('/:id', livresController.modifierLivre);
router.put('/status/:id', livresController.modifierStatusLivre);
router.delete('/:id', livresController.supprimerLivre);

export default router;