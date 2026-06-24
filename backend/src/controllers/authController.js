import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registrar = async (req, res) => {
    const { nome, email, senha, telefone, endereco, tipo, preco_servico, descricao, horario_atendimento } = req.body;

    try {
        const [usuariosExistentes] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (usuariosExistentes.length > 0) {
            return res.status(400).json({ erro: 'Este e-mail já está em uso.' });
        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [resultadoUsuario] = await connection.query(
                'INSERT INTO usuarios (nome, email, senha, telefone, endereco, tipo) VALUES (?, ?, ?, ?, ?, ?)',
                [nome, email, senhaHash, telefone, endereco, tipo]
            );

            const usuarioId = resultadoUsuario.insertId;

            if (tipo === 'prestador') {
                if (!preco_servico || !horario_atendimento) {
                    throw new Error('Preço do serviço e horário de atendimento são obrigatórios para prestadores.');
                }

                await connection.query(
                    'INSERT INTO perfil_prestador (usuario_id, preco_servico, descricao, horario_atendimento) VALUES (?, ?, ?, ?)',
                    [usuarioId, preco_servico, descricao, horario_atendimento]
                );
            }

            await connection.commit();
            connection.release();

            return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso!' });

        } catch (errorTransacao) {
            await connection.rollback();
            connection.release();
            throw errorTransacao; 
        }

    } catch (errorGeral) {
        console.error('Erro no registro:', errorGeral);
        return res.status(500).json({ erro: errorGeral.message || 'Erro interno no servidor ao registrar usuário.' });
    }
};

export const login = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        
        if (usuarios.length === 0) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const usuario = usuarios[0];

        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
        }

        const token = jwt.sign(
            { id: usuario.id, tipo: usuario.tipo },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.json({
            mensagem: 'Login realizado com sucesso!',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                tipo: usuario.tipo
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ erro: 'Erro interno no servidor ao fazer login.' });
    }
};