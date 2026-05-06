import pretsController from '../controllers/prets.controller.js';
import express from 'express';

const router = express.Router();

router.post('/pret/', pretsController.ajouterPret);
/*
router.put('/pret/:id', modifierPret);
router.put('/pret/status/:id', modifierStatusPret);
router.delete('/pret/:id', supprimerPret);
*/
export default router;