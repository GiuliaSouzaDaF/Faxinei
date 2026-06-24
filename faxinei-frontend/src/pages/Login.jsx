import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await axios.post('http://localhost:3000/api/auth/login', formData);
      
      localStorage.setItem('token', resposta.data.token);
      localStorage.setItem('usuario', JSON.stringify(resposta.data.usuario));
      
      navigate('/');
      
      window.dispatchEvent(new Event('storage'));

    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center min-h-[calc(100vh-80px)] items-start pt-20">
      <div className="bg-faxinei-branco w-full max-w-md rounded-xl shadow-lg p-8 border-t-4 border-faxinei-ciano">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Entrar no Faxinei
        </h2>

        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input 
              type="email" name="email" required value={formData.email} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input 
              type="password" name="senha" required value={formData.senha} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            disabled={carregando}
            className={`w-full py-3 rounded-lg text-white font-bold transition-colors mt-4 ${carregando ? 'bg-gray-400 cursor-not-allowed' : 'bg-faxinei-ciano hover:bg-faxinei-verde-agua'}`}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          Ainda não tem uma conta? <Link to="/cadastro" className="text-faxinei-ciano font-semibold hover:underline">Cadastre-se grátis</Link>
        </p>
      </div>
    </div>
  );
}