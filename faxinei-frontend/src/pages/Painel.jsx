import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'; 

export default function Painel() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [agendamentoEditando, setAgendamentoEditando] = useState(null);
  const [novaData, setNovaData] = useState('');
  const [modalConcluir, setModalConcluir] = useState({ aberto: false, id: null });
  const [modalCancelar, setModalCancelar] = useState({ aberto: false, id: null });
  
  const usuarioLocal = localStorage.getItem('usuario');
  const usuario = usuarioLocal ? JSON.parse(usuarioLocal) : null;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    const buscarAgendamentos = async () => {
      try {
        const resposta = await axios.get('http://localhost:3000/api/agendamentos', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAgendamentos(resposta.data);
      } catch (erro) {
        console.error('Erro ao buscar painel:', erro);
        if (erro.response?.status === 401 || erro.response?.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('usuario');
          navigate('/login');
        }
      } finally {
        setCarregando(false);
      }
    };

    buscarAgendamentos();
  }, [navigate, usuario, token]);

  if (!usuario) return null;

  const executarConclusao = async () => {
    const id = modalConcluir.id;
    setModalConcluir({ aberto: false, id: null });
    if (!id) return;
    
    try {
      await axios.put(`http://localhost:3000/api/agendamentos/${id}/status`, 
        { status: 'concluido' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAgendamentos((prev) => 
        prev.map(ag => ag.id === id ? { ...ag, status: 'concluido' } : ag)
      );

      toast.success('✨ Excelente! Serviço marcado como concluído com sucesso! 🧹👏');
    } catch (erro) {
      toast.error(erro.response?.data?.erro || 'Erro ao concluir o serviço.');
    }
  };

  const executarCancelamento = async () => {
    const id = modalCancelar.id;
    setModalCancelar({ aberto: false, id: null });
    if (!id) return;
    
    try {
      await axios.put(`http://localhost:3000/api/agendamentos/${id}/status`, 
        { status: 'cancelado' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAgendamentos((prev) => 
        prev.map(ag => ag.id === id ? { ...ag, status: 'cancelado' } : ag)
      );

      toast.warn('Registro atualizado: O agendamento foi cancelado. 📝');
    } catch (erro) {
      toast.error(erro.response?.data?.erro || 'Erro ao cancelar o serviço.');
    }
  };

  const salvarNovaData = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.put(`http://localhost:3000/api/agendamentos/${agendamentoEditando.id}`, 
        { data_agendamento: novaData },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAgendamentos(agendamentos.map(ag => 
        ag.id === agendamentoEditando.id ? { ...ag, data_agendamento: novaData } : ag
      ));
      
      setAgendamentoEditando(null); 
      toast.success(resposta.data.mensagem || 'Horário alterado com sucesso!');
    } catch (erro) {
      console.error('Erro ao reagendar:', erro);
      toast.error(erro.response?.data?.erro || 'Erro ao reagendar o serviço.');
    }
  }; 

  const formatarData = (dataSql) => {
    const data = new Date(dataSql);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(data);
  };

  const corStatus = (status) => {
    switch(status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'concluido': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelado': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meu Painel</h1>
          <p className="text-gray-500 mt-1">
            Logado como <strong className="text-faxinei-ciano">{usuario.tipo === 'cliente' ? 'Cliente' : 'Prestador de Serviço'}</strong>
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold text-gray-700 mb-6">
        {usuario.tipo === 'cliente' ? 'Meus Serviços Contratados' : 'Minhas Faxinas Agendadas'}
      </h2>

      {carregando ? (
        <p className="text-gray-500 text-center py-10">Carregando seus dados...</p>
      ) : agendamentos.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
          <p className="text-gray-500 mb-4 text-lg">Você ainda não possui nenhum agendamento.</p>
        </div>
      ) : ( 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agendamentos.map((agendamento) => (
            <div key={agendamento.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-faxinei-ciano flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {usuario.tipo === 'cliente' ? agendamento.prestador_nome : agendamento.cliente_nome}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {usuario.tipo === 'cliente' ? `📞 Tel: ${agendamento.telefone || 'Não informado'}` : `📍 Endereço: ${agendamento.endereco}`}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${corStatus(agendamento.status)}`}>
                  {agendamento.status}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4 flex-grow border border-gray-100">
                <p className="text-gray-700 font-medium text-sm mb-1">Data e Horário do Serviço:</p>
                <p className="text-faxinei-ciano font-bold text-lg">
                  {formatarData(agendamento.data_agendamento)}
                </p>
              </div>

              {/* BOTÕES DE AÇÃO INTERATIVOS MODIFICADOS */}
              <div className="flex justify-end space-x-3 mt-auto pt-3 border-t border-gray-100">
                
                {/* 1. Cliente pode alterar o horário do serviço pendente */}
                {usuario.tipo === 'cliente' && agendamento.status === 'pendente' && (
                  <button 
                    onClick={() => setAgendamentoEditando(agendamento)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Alterar Horário
                  </button>
                )}

                {/* 2. Ambos podem cancelar enquanto estiver pendente - Abre o Modal de Cancelar */}
                {agendamento.status === 'pendente' && (
                  <button 
                    onClick={() => setModalCancelar({ aberto: true, id: agendamento.id })}
                    className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                )}

                {/* 3. Só o prestador pode concluir o serviço pendente - Abre o Modal de Concluir */}
                {usuario.tipo === 'prestador' && agendamento.status === 'pendente' && (
                  <button 
                    onClick={() => setModalConcluir({ aberto: true, id: agendamento.id })}
                    className="text-sm bg-faxinei-verde-agua hover:bg-faxinei-ciano text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm"
                  >
                    Concluir Serviço
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}  

      {/* MODAL DE ALTERAR HORÁRIO */}
      {agendamentoEditando && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
            <button 
              onClick={() => setAgendamentoEditando(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >✕</button>
            
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reagendar Serviço</h3>
            
            <form onSubmit={salvarNovaData}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Nova Data e Hora *</label>
                <input 
                  type="datetime-local" required 
                  value={novaData} onChange={(e) => setNovaData(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
                />
              </div>

              <div className="flex space-x-3">
                <button type="button" onClick={() => setAgendamentoEditando(null)} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-200">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-faxinei-ciano text-white py-2.5 rounded-xl font-bold hover:bg-faxinei-verde-agua transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 MODAL DE CONFIRMAÇÃO DE CONCLUSÃO */}
      {modalConcluir.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-blue-50 text-faxinei-ciano rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🧹
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Finalizar Faxina?</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              O serviço foi realmente finalizado? <br />
              Esta ação confirmará para o cliente que tudo está pronto.
            </p>
            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={() => setModalConcluir({ aberto: false, id: null })} 
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Voltar
              </button>
              <button 
                type="button" 
                onClick={executarConclusao} 
                className="flex-1 bg-faxinei-ciano text-white py-3 rounded-xl font-bold hover:bg-faxinei-verde-agua transition-colors shadow-md"
              >
                Sim, finalizar!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL DE CONFIRMAÇÃO DE CANCELAMENTO */}
      {modalCancelar.aberto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              ⚠️
            </div>
            <h3 className="text-2xl font-black text-gray-800 mb-2">Cancelar Agendamento?</h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Tem certeza que deseja cancelar? <br />
              <span className="text-red-500 font-semibold">Esta ação removerá este horário da sua grade de faxinas.</span>
            </p>
            <div className="flex space-x-3">
              <button 
                type="button" 
                onClick={() => setModalCancelar({ aberto: false, id: null })} 
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Não, manter
              </button>
              <button 
                type="button" 
                onClick={executarCancelamento} 
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-md"
              >
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  ); 
}