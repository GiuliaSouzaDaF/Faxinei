import express from 'express';
import { avaliarServico } from '../controllers/avaliacaoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verificarToken, avaliarServico);

export default router;