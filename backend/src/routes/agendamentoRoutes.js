import express from 'express';
import { criarAgendamento, listarAgendamentos, atualizarHorario, alterarStatus } from '../controllers/agendamentoController.js';
import { verificarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(verificarToken); 

// Rota para criar agendamentos (Home)
router.post('/', criarAgendamento);

// Rota para listar agendamentos (Painel)
router.get('/', listarAgendamentos);

router.put('/:id/status', alterarStatus);

router.put('/:id', atualizarHorario);

export default router;