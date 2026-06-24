import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Perfil() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const usuarioLocal = localStorage.getItem('usuario');
  const usuarioAtual = usuarioLocal ? JSON.parse(usuarioLocal) : null;
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    preco_servico: '',
    descricao: '',
    horario_atendimento: ''
  });

  useEffect(() => {
    if (!usuarioAtual) {
      navigate('/login');
      return;
    }
    setFormData({
      nome: usuarioAtual.nome || '',
      telefone: usuarioAtual.telefone || '',
      endereco: usuarioAtual.endereco || '',
      preco_servico: usuarioAtual.preco_servico || '',
      descricao: usuarioAtual.descricao || '',
      horario_atendimento: usuarioAtual.horario_atendimento || ''
    });
  }, [navigate]);

  if (!usuarioAtual) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setMensagem({ texto: '', tipo: '' });

    try {
      const resposta = await axios.put('http://localhost:3000/api/usuarios/perfil', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const novoUsuario = { ...usuarioAtual, ...formData };
      localStorage.setItem('usuario', JSON.stringify(novoUsuario));
      
      window.dispatchEvent(new Event('storage'));

      setMensagem({ texto: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
    } catch (erro) {
      setMensagem({ 
        texto: erro.response?.data?.erro || 'Erro ao atualizar o perfil.', 
        tipo: 'erro' 
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="bg-faxinei-branco w-full max-w-2xl rounded-xl shadow-lg p-8 border-t-4 border-faxinei-ciano">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Meu Perfil</h2>
        <p className="text-center text-gray-500 mb-8">
          Atualize suas informações pessoais e profissionais
        </p>

        {mensagem.texto && (
          <div className={`p-4 rounded-lg mb-6 text-center font-medium ${mensagem.tipo === 'sucesso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSalvar} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input 
                type="text" name="nome" required value={formData.nome} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail (Não editável)</label>
              <input 
                type="email" disabled value={usuarioAtual.email}
                className="w-full border border-gray-200 bg-gray-100 rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input 
                type="text" name="telefone" required value={formData.telefone} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Bairro/Cidade)</label>
              <input 
                type="text" name="endereco" required value={formData.endereco} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
              />
            </div>
          </div>

          {usuarioAtual.tipo === 'prestador' && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200 mt-4">
              <h3 className="font-semibold text-faxinei-ciano">Informações Profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base (R$)</label>
                  <input 
                    type="number" name="preco_servico" step="0.01" value={formData.preco_servico} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horários de Atendimento</label>
                  <input 
                    type="text" name="horario_atendimento" value={formData.horario_atendimento} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea 
                  name="descricao" rows="3" value={formData.descricao} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
                ></textarea>
              </div>
            </div>
          )}

          <button 
            type="submit" disabled={carregando}
            className={`w-full py-3 rounded-lg text-white font-bold transition-colors mt-6 ${carregando ? 'bg-gray-400' : 'bg-faxinei-ciano hover:bg-faxinei-verde-agua'}`}
          >
            {carregando ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
    </div>
  );
}