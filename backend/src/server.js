import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js'; 
import authRoutes from './routes/authRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import agendamentoRoutes from './routes/agendamentoRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/agendamentos', agendamentoRoutes);

app.get('/', (req, res) => {
    res.json({ mensagem: 'API do Faxinei está online e pronta para o trabalho!' });
});

app.listen(PORT, () => {
    console.log(`Servidor do Faxinei rodando na porta ${PORT}`);
});