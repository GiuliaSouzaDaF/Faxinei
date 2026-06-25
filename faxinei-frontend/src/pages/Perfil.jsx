import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Perfil() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [mostrarModalExcluir, setMostrarModalExcluir] = useState(false);
  const [mostrarModalSalvar, setMostrarModalSalvar] = useState(false); // 🔥 Novo estado para o modal de salvar

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
  }, [navigate, usuarioLocal]);

  if (!usuarioAtual) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Essa função é disparada pelo formulário, mas ela apenas ABRE o modal de confirmação
  const gatilhoSalvar = (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setMostrarModalSalvar(true); // Abre o modal de confirmação
  };

  // 2. Essa função roda APENAS se o usuário clicar em "Sim, confirmar" dentro do modal
  const confirmarSalvarAlteracoes = async () => {
    setMostrarModalSalvar(false); // Fecha o modal
    setCarregando(true);

    try {
      await axios.put('http://localhost:3000/api/usuarios/perfil', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const novoUsuario = { ...usuarioAtual, ...formData };
      localStorage.setItem('usuario', JSON.stringify(novoUsuario));
      
      window.dispatchEvent(new Event('storage'));

      toast.success('Perfil atualizado com sucesso! 🎉');
    } catch (erro) {
      toast.error(erro.response?.data?.erro || 'Erro ao atualizar o perfil.');
    } finally {
      setCarregando(false);
    }
  };

  const confirmarExclusaoConta = async () => {
    try {
      await axios.delete('http://localhost:3000/api/usuarios/perfil', {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      window.dispatchEvent(new Event('storage'));

      toast.success('Sua conta foi excluída com sucesso. Sentiremos sua falta! 🥺');
      navigate('/');
    } catch (erro) {
      console.error('Erro ao excluir conta:', erro);
      toast.error(erro.response?.data?.erro || 'Erro ao tentar excluir sua conta.');
    } finally {
      setMostrarModalExcluir(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 border-t-4 border-faxinei-ciano">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Meu Perfil</h2>
        <p className="text-center text-gray-500 mb-8">
          Atualize suas informações pessoais e profissionais
        </p>

        {/* Mudamos o onSubmit para chamar a função que abre o modal */}
        <form onSubmit={gatilhoSalvar} className="space-y-4">
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

          <div className="pt-4 space-y-3">
            <button 
              type="submit" disabled={carregando}
              className={`w-full py-3 rounded-lg text-white font-bold transition-colors ${carregando ? 'bg-gray-400' : 'bg-faxinei-ciano hover:bg-faxinei-verde-agua'}`}
            >
              {carregando ? 'Salvando...' : 'Salvar Alterações'}
            </button>

            <button
              type="button"
              onClick={() => setMostrarModalExcluir(true)}
              className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-3 rounded-lg text-sm font-bold transition-all border border-red-100 shadow-sm"
            >
              ⚠️ Excluir Minha Conta Permanentemente
            </button>
          </div>
        </form>
      </div>

      {/* 🔥 MODAL DE CONFIRMAÇÃO DE SALVAMENTO */}
      {mostrarModalSalvar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative text-center">
            <div className="w-16 h-16 bg-blue-50 text-faxinei-ciano rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              💾
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Confirmar Alterações?</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Você deseja salvar as novas informações no seu perfil? <br />
              Seu painel e dados de contato serão atualizados imediatamente.
            </p>
            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={() => setMostrarModalSalvar(false)} 
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                onClick={confirmarSalvarAlteracoes} 
                className="flex-1 bg-faxinei-ciano text-white py-3 rounded-xl font-bold hover:bg-faxinei-verde-agua transition-colors shadow-md"
              >
                Sim, salvar tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO DE CONTA */}
      {mostrarModalExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🚨
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Atenção total!</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Você tem certeza que deseja excluir essa conta? <br />
              <span className="text-red-500 font-semibold">Esta ação é definitiva e apagará todos os seus dados sem rastros.</span>
            </p>
            <div className="flex space-x-3">
              <button type="button" onClick={() => setMostrarModalExcluir(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                Não, manter conta
              </button>
              <button type="button" onClick={confirmarExclusaoConta} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md">
                Sim, excluir tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}