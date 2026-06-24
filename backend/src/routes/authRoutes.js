import express from 'express';
import { registrar, login } from '../controllers/authController.js';

const router = express.Router();

// Rota POST para http://localhost:3000/api/auth/registrar
router.post('/registrar', registrar);

// Rota POST para http://localhost:3000/api/auth/login
router.post('/login', login);

export default router;