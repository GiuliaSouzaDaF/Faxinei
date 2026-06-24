import pool from '../config/db.js';

// 1. LISTAR PRESTADORES (Home - unindo a média de estrelas com os dados do perfil)
export const listarPrestadores = async (req, res) => {
    const { endereco } = req.query;

    try {
        let query = `
            SELECT 
                u.id, 
                u.nome, 
                u.endereco, 
                u.telefone, 
                u.email,
                p.preco_servico,
                p.descricao,
                p.horario_atendimento,
                IFNULL(ROUND(AVG(a.nota), 1), 0) AS media_estrelas,
                COUNT(a.id) AS total_avaliacoes
            FROM usuarios u
            LEFT JOIN perfil_prestador p ON u.id = p.usuario_id
            LEFT JOIN avaliacoes a ON u.id = a.prestador_id
            WHERE u.tipo = 'prestador'
        `;

        const params = [];

        if (endereco) {
            query += ` AND u.endereco LIKE ?`;
            params.push(`%${endereco}%`);
        }

        query += ` GROUP BY u.id, p.id`;

        const [prestadores] = await pool.query(query, params);
        res.json(prestadores);

    } catch (error) {
        console.error('Erro ao listar prestadores com avaliações:', error);
        res.status(500).json({ erro: 'Erro ao buscar prestadores de serviço.' });
    }
};

// 2. EDITAR PERFIL (Atualiza tanto os dados básicos quanto a tabela de prestador)
export const editarPerfil = async (req, res) => {
    const usuarioId = req.usuario.id; 
    const tipo = req.usuario.tipo;
    const { nome, telefone, endereco, preco_servico, descricao, horario_atendimento } = req.body;

    if (!nome || !telefone || !endereco) {
        return res.status(400).json({ erro: 'Os campos Nome, Telefone e Endereço são obrigatórios.' });
    }

    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            // Atualiza a tabela principal de usuários
            await connection.query(
                'UPDATE usuarios SET nome = ?, telefone = ?, endereco = ? WHERE id = ?',
                [nome, telefone, endereco, usuarioId]
            );

            // Se for prestador, atualiza a tabela específica de perfil profissional
            if (tipo === 'prestador') {
                await connection.query(
                    'UPDATE perfil_prestador SET preco_servico = ?, descricao = ?, horario_atendimento = ? WHERE usuario_id = ?',
                    [preco_servico || null, descricao || null, horario_atendimento || null, usuarioId]
                );
            }

            await connection.commit();
            connection.release();

            res.json({ mensagem: 'Perfil atualizado com sucesso!' });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Erro ao editar perfil:', error);
        res.status(500).json({ erro: 'Erro ao atualizar o perfil.' });
    }
};

// 3. EXCLUIR PERFIL (Deleta a conta e limpa os registros vinculados)
export const excluirPerfil = async (req, res) => {
    const usuarioId = req.usuario.id;

    try {
        await pool.query('DELETE FROM usuarios WHERE id = ?', [usuarioId]);
        res.json({ mensagem: 'Perfil e todos os dados vinculados foram excluídos com sucesso.' });
    } catch (error) {
        console.error('Erro ao excluir perfil:', error);
        res.status(500).json({ erro: 'Erro ao excluir conta.' });
    }
};