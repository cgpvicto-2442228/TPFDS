import pretsController from '../controllers/prets.controller.js';
import express from 'express';

const router = express.Router();

router.post('/', pretsController.ajouterPret);
router.put('/:id', pretsController.modifierPret);
router.put('/status/:id', pretsController.modifierStatusPret);
router.delete('/:id', pretsController.supprimerPret);

export default router;