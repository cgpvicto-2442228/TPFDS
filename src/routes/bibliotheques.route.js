import express from 'express';
import { inscrire, recupererCle } from '../controllers/bibliotheques.controller.js';
const router = express.Router();

router.post('/', inscrire);
router.get('/cle', recupererCle);

export default router;