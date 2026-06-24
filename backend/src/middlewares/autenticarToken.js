import jwt from 'jsonwebtoken';

const autenticarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Acesso negado. Token não fornecido.' });
  }

  jwt.verify(token, 'chave_secreta_super_segura_faxinei_2026', (erro, usuarioDecodificado) => {
    if (erro) {
      return res.status(403).json({ erro: 'Token inválido ou expirado.' });
    }

    req.usuario = usuarioDecodificado;
    
    next();
  });
};

export default autenticarToken;