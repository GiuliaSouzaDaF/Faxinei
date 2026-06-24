import pool from '../config/db.js';
import { calcularDiferencaDias } from '../utils/dataHelper.js';

// 1. CRIAR AGENDAMENTO (Contratar serviço na Home)
export const criarAgendamento = async (req, res) => {
    const clienteId = req.usuario.id;
    const { prestador_id, data_agendamento } = req.body;

    if (req.usuario.tipo !== 'cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem contratar serviços.' });
    }

    try {
        await pool.query(
            'INSERT INTO agendamentos (cliente_id, prestador_id, data_agendamento) VALUES (?, ?, ?)',
            [clienteId, prestador_id, data_agendamento]
        );
        res.status(201).json({ mensagem: 'Serviço contratado com sucesso!' });
    } catch (error) {
        console.error('Erro ao criar agendamento:', error);
        res.status(500).json({ erro: 'Erro ao agendar o serviço.' });
    }
};

// 2. LISTAR AGENDAMENTOS (Exibir no Painel)
export const listarAgendamentos = async (req, res) => {
    const usuarioId = req.usuario.id;
    const tipo = req.usuario.tipo;

    try {
        let query;
        if (tipo === 'cliente') {
            query = `
                SELECT a.id, a.data_agendamento, a.status, u.nome AS prestador_nome, u.telefone
                FROM agendamentos a
                JOIN usuarios u ON a.prestador_id = u.id
                WHERE a.cliente_id = ?
            `;
        } else {
            query = `
                SELECT a.id, a.data_agendamento, a.status, u.nome AS cliente_nome, u.endereco
                FROM agendamentos a
                JOIN usuarios u ON a.cliente_id = u.id
                WHERE a.prestador_id = ?
            `;
        }

        const [agendamentos] = await pool.query(query, [usuarioId]);
        res.json(agendamentos);
    } catch (error) {
        console.error('Erro ao listar agendamentos:', error);
        res.status(500).json({ erro: 'Erro ao buscar agendamentos.' });
    }
};

// 3. REAGENDAR / ALTERAR HORÁRIO (Usado pelo botão Alterar Horário)
export const atualizarHorario = async (req, res) => {
    const { id } = req.params; 
    const { data_agendamento } = req.body; // Ajustado para bater com o Painel.jsx
    const clienteId = req.usuario.id;

    if (req.usuario.tipo !== 'cliente') {
        return res.status(403).json({ erro: 'Apenas clientes podem alterar o horário.' });
    }

    try {
        const [agendamentos] = await pool.query(
            'SELECT data_agendamento FROM agendamentos WHERE id = ? AND cliente_id = ?', 
            [id, clienteId]
        );
        
        if (agendamentos.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        const diferencaDias = calcularDiferencaDias(agendamentos[0].data_agendamento);

        if (diferencaDias <= 3) {
            return res.status(400).json({ erro: 'O horário só pode ser alterado com mais de 3 dias de antecedência.' });
        }

        await pool.query('UPDATE agendamentos SET data_agendamento = ? WHERE id = ?', [data_agendamento, id]);
        res.json({ mensagem: 'Horário do serviço atualizado com sucesso!' });

    } catch (error) {
        console.error('Erro ao atualizar horário:', error);
        res.status(500).json({ erro: 'Erro ao alterar horário.' });
    }
};

// 4. ALTERAR STATUS (Usado pelos botões Concluir e Cancelar)
export const alterarStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 
    const usuarioId = req.usuario.id;
    const tipo = req.usuario.tipo;

    // Validação de segurança para aceitar apenas os status corretos
    if (!['concluido', 'cancelado', 'pendente'].includes(status)) {
        return res.status(400).json({ erro: 'Status inválido.' });
    }

    try {
        if (tipo === 'cliente' && status === 'concluido') {
            return res.status(403).json({ erro: 'Apenas o prestador pode marcar o serviço como concluído.' });
        }

        const query = tipo === 'cliente' 
            ? 'UPDATE agendamentos SET status = ? WHERE id = ? AND cliente_id = ?'
            : 'UPDATE agendamentos SET status = ? WHERE id = ? AND prestador_id = ?';

        const [resultado] = await pool.query(query, [status, id, usuarioId]);

        if (resultado.affectedRows === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado ou você não tem permissão.' });
        }

        res.json({ mensagem: `Status atualizado para ${status} com sucesso!` });
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        res.status(500).json({ erro: 'Erro ao atualizar o serviço.' });
    }
};