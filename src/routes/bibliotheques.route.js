import express from 'express';
import { inscrire, recupererCle } from '../controllers/bibliotheques.controller.js';
const router = express.Router();

router.post('/', inscrire);
router.post('/cle', recupererCle);

export default router;