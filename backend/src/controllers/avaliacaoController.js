import pool from '../config/db.js';

export const avaliarServico = async (req, res) => {
    const clienteId = req.usuario.id;
    const { agendamento_id, nota, comentario } = req.body;

    // 1. Validações básicas
    if (!nota || nota < 1 || nota > 5) {
        return res.status(400).json({ erro: 'A nota deve ser um número entre 1 e 5.' });
    }

    try {
        // 2. Verifica se o agendamento existe, se é do cliente e se está CONCLUÍDO
        const [agendamentos] = await pool.query(
            'SELECT id, prestador_id, status FROM agendamentos WHERE id = ? AND cliente_id = ?',
            [agendamento_id, clienteId]
        );

        if (agendamentos.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado ou não pertence a você.' });
        }

        const agendamento = agendamentos[0];

        if (agendamento.status !== 'concluido') {
            return res.status(400).json({ erro: 'Você só pode avaliar um serviço que já foi concluído.' });
        }

        // 3. Insere a avaliação no banco de dados
        await pool.query(
            'INSERT INTO avaliacoes (agendamento_id, cliente_id, prestador_id, nota, comentario) VALUES (?, ?, ?, ?, ?)',
            [agendamento_id, clienteId, agendamento.prestador_id, nota, comentario]
        );

        res.status(201).json({ mensagem: 'Avaliação enviada com sucesso! Obrigado pelo feedback.' });

    } catch (error) {
        console.error('Erro ao avaliar serviço:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ erro: 'Você já avaliou este agendamento anteriormente.' });
        }
        res.status(500).json({ erro: 'Erro interno ao salvar a avaliação.' });
    }
};