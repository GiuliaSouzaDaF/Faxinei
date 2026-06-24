import express from 'express';
import { listarPrestadores, editarPerfil, excluirPerfil } from '../controllers/usuarioController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/prestadores', listarPrestadores);

router.put('/perfil', verificarToken, editarPerfil);
router.delete('/perfil', verificarToken, excluirPerfil);

export default router;