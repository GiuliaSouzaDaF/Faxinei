import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    const tokenHeader = req.headers['authorization'];
    const token = tokenHeader && tokenHeader.split(' ')[1]; // Formato esperado: "Bearer TOKEN_AQUI"

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const decodificado = jwt.verify(token, process.env.JWT_SECRET);
        
        req.usuario = decodificado;
        
        next(); 
    } catch (error) {
        res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }
};