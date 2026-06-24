import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  const [usuario, setUsuario] = useState(null);

  const verificarLogin = () => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      setUsuario(JSON.parse(usuarioSalvo));
    } else {
      setUsuario(null);
    }
  };

  useEffect(() => {
    verificarLogin();

    window.addEventListener('storage', verificarLogin);
    
    return () => {
      window.removeEventListener('storage', verificarLogin);
    };
  }, []);

  // Limpa as credenciais e desloga o usuário
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    navigate('/login');
  };

  return (
    <nav className="bg-faxinei-branco shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* LOGO E LINKS INSTITUCIONAIS */}
        <div className="flex items-center space-x-8">
          <Link to="/" className="text-2xl font-bold text-faxinei-ciano tracking-wide">
            Faxinei<span className="text-faxinei-verde-agua">.</span>
          </Link>
          
          {/* Link Sobre Nós - Visível para qualquer visitante */}
          <Link to="/sobre" className="text-gray-600 hover:text-faxinei-ciano font-medium transition-colors hidden sm:inline-block">
            Sobre Nós
          </Link>
        </div>
        
        {/* MENU DE USUÁRIO / AUTENTICAÇÃO */}
        <div className="flex items-center space-x-6">
          {/* Link Sobre Nós compacto para telas pequenas (mobile) */}
          <Link to="/sobre" className="text-gray-600 hover:text-faxinei-ciano font-medium transition-colors sm:hidden text-sm">
            Sobre
          </Link>

          {usuario ? (
            <>
              {/* Mostra apenas o primeiro nome para ficar elegante */}
              <span className="text-gray-600 font-medium hidden md:inline">
                Olá, <span className="text-faxinei-ciano font-semibold">{usuario.nome.split(' ')[0]}</span>
              </span>
              
              <Link to="/painel" className="text-gray-600 hover:text-faxinei-ciano font-medium transition-colors">
                Meu Painel
              </Link>
              
              <Link to="/perfil" className="text-gray-600 hover:text-faxinei-ciano font-medium transition-colors">
                Meu Perfil
              </Link>
              
              <button 
                onClick={handleLogout}
                className="bg-red-50 text-red-500 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-faxinei-ciano font-medium transition-colors">
                Entrar
              </Link>
              <Link to="/cadastro" className="bg-faxinei-verde-agua text-white px-5 py-2 rounded-lg hover:bg-faxinei-ciano transition-colors font-medium shadow-sm">
                Cadastrar
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}