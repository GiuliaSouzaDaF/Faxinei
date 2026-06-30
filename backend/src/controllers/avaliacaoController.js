import pool from '../config/db.js';

export const avaliarServico = async (req, res) => {
    const clienteId = req.usuario.id; 
    const { agendamento_id, nota, comentario } = req.body;

    if (!agendamento_id) {
        return res.status(400).json({ erro: 'O ID do agendamento é obrigatório.' });
    }

    if (!nota || nota < 1 || nota > 5) {
        return res.status(400).json({ erro: 'A nota deve ser um número inteiro entre 1 e 5.' });
    }

    try {
        const [agendamentos] = await pool.query(
            'SELECT id, prestador_id, status FROM agendamentos WHERE id = ? AND cliente_id = ?',
            [agendamento_id, clienteId]
        );

        if (agendamentos.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado ou não pertence a você.' });
        }

        const agendamento = agendamentos[0];

        if (agendamento.status !== 'concluido') {
            return res.status(400).json({ erro: 'Você só pode avaliar um serviço após ele ser marcado como concluído.' });
        }

        await pool.query(
            'INSERT INTO avaliacoes (agendamento_id, cliente_id, prestador_id, nota, comentario) VALUES (?, ?, ?, ?, ?)',
            [agendamento_id, clienteId, agendamento.prestador_id, nota, comentario || null]
        );

        
        const [resultadoMedia] = await pool.query(
            'SELECT AVG(nota) as media FROM avaliacoes WHERE prestador_id = ?',
            [agendamento.prestador_id]
        );

        const novaMedia = resultadoMedia[0].media ? parseFloat(resultadoMedia[0].media).toFixed(1) : '0.0';

        await pool.query(
            'UPDATE perfil_prestador SET nota_media = ? WHERE usuario_id = ?',
            [novaMedia, agendamento.prestador_id]
        );

        return res.status(201).json({ 
            mensagem: 'Avaliação enviada com sucesso! Obrigado pelo seu feedback.',
            nota_media_atualizada: parseFloat(novaMedia)
        });

    } catch (error) {
        console.error('Erro ao avaliar serviço no controller:', error);

        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: 'Você já registrou uma avaliação para este agendamento.' });
        }

        return res.status(500).json({ erro: 'Erro interno no servidor ao tentar salvar a avaliação.' });
    }
};