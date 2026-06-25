import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [prestadores, setPrestadores] = useState([]);
  const [carregando, setCarregando] = useState(true);
  
  const [busca, setBusca] = useState('');

  const [prestadorSelecionado, setPrestadorSelecionado] = useState(null);
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [erroModal, setErroModal] = useState('');
  const [sucessoModal, setSucessoModal] = useState('');

  const usuarioLocal = localStorage.getItem('usuario');
  const usuario = usuarioLocal ? JSON.parse(usuarioLocal) : null;

  const carregarPrestadores = async (termoDeBusca = '') => {
    setCarregando(true);
    try {
      const url = termoDeBusca 
        ? `http://localhost:3000/api/usuarios/prestadores?endereco=${encodeURIComponent(termoDeBusca)}`
        : 'http://localhost:3000/api/usuarios/prestadores';
        
      const resposta = await axios.get(url);
      setPrestadores(resposta.data);
    } catch (erro) {
      console.error('Erro ao buscar prestadores:', erro);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarPrestadores();
  }, []);

  const handleFiltrar = (e) => {
    e.preventDefault();
    carregarPrestadores(busca);
  };

  const handleLimparFiltro = () => {
    setBusca('');
    carregarPrestadores('');
  };

  const abrirModal = (prestador) => {
  if (!usuario) {
    toast.warn('Você precisa estar logado para contratar um serviço.'); // Alerta de aviso amarelo
    navigate('/login');
    return;
  }
  if (usuario.tipo !== 'cliente') {
    toast.error('Apenas contas de Cliente podem contratar serviços.'); // Alerta de erro vermelho
    return;
  }
  setErroModal('');
  setSucessoModal('');
  setDataAgendamento('');
  setPrestadorSelecionado(prestador);
};

  const handleContratar = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem('token');
    await axios.post('http://localhost:3000/api/agendamentos', {
      prestador_id: prestadorSelecionado.id,
      data_agendamento: dataAgendamento
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success('Serviço agendado com sucesso! 🎉');
    
    setPrestadorSelecionado(null);
  } catch (erro) {
    const mensagemErro = erro.response?.data?.erro || 'Erro ao agendar serviço.';
    toast.error(mensagemErro);
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      
      {/* Cabeçalho de Boas-vindas */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Encontre o profissional ideal para sua faxina
        </h1>
        <p className="text-gray-500 text-lg">
          Digite sua localização abaixo para encontrar prestadores de serviço perto de você.
        </p>
      </div>

      {/* BARRA DE PESQUISA COM FILTRO */}
      <form onSubmit={handleFiltrar} className="max-w-2xl mx-auto mb-12 flex shadow-md rounded-xl overflow-hidden bg-white border border-gray-200 p-1">
        <input 
          type="text" 
          placeholder="🔍 Digite o bairro, cidade ou região (Ex: Centro, Trindade...)"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-grow px-4 py-3 focus:outline-none rounded-l-lg text-gray-700 placeholder-gray-400"
        />
        
        {busca && (
          <button 
            type="button"
            onClick={handleLimparFiltro}
            className="px-3 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
          >
            Limpar
          </button>
        )}

        <button 
          type="submit"
          className="bg-faxinei-ciano text-white px-8 py-3 font-bold hover:bg-faxinei-verde-agua transition-colors rounded-lg shadow-sm"
        >
          Buscar
        </button>
      </form>

      {/* LISTAGEM DOS CARDS */}
      {carregando ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-xl text-gray-500 font-medium animate-pulse">Carregando prestadores de serviço...</p>
        </div>
      ) : prestadores.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 max-w-md mx-auto">
          <p className="text-gray-500 text-lg mb-4">Nenhum prestador encontrado para esta região.</p>
          <button 
            onClick={handleLimparFiltro}
            className="bg-gray-100 text-faxinei-ciano px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Ver todos os prestadores
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-6 font-medium">
            {busca ? `Resultados para "${busca}":` : 'Todos os profissionais disponíveis:'} ({prestadores.length})
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {prestadores.map((prestador) => (
              <div 
                key={prestador.id} 
                className="bg-faxinei-branco rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-faxinei-verde-agua transition-all duration-300 p-6 flex flex-col h-full relative overflow-hidden group"
              >
                {/* Linha decorativa no topo do card */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-faxinei-verde-agua group-hover:bg-faxinei-ciano transition-colors" />
                
                {/* TÍTULO E NOTA */}
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold text-gray-800 group-hover:text-faxinei-ciano transition-colors line-clamp-1">
                    {prestador.nome}
                  </h2>
                  
                  {/* SISTEMA VISUAL DE ESTRELAS */}
                  <div className="flex flex-col items-end shrink-0">
                    {Number(prestador.media_estrelas) > 0 ? (
                      <>
                        <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                          <span className="text-yellow-500 font-bold text-sm">⭐</span>
                          <span className="text-gray-800 font-bold text-sm">
                            {Number(prestador.media_estrelas).toFixed(1)}
                          </span>
                        </div>
                        <span className="text-[10px] text-gray-400 mt-0.5 font-medium">
                          ({prestador.total_avaliacoes} {prestador.total_avaliacoes === 1 ? 'avaliação' : 'avaliações'})
                        </span>
                      </>
                    ) : (
                      <span className="text-[10px] bg-green-50 text-green-700 font-semibold px-2 py-1 rounded-md border border-green-100 uppercase tracking-wider">
                        ✨ Novo
                      </span>
                    )}
                  </div>
                </div>
                
                {/* INFORMAÇÕES DO PRESTADOR */}
                <div className="text-gray-600 space-y-2 mb-4 text-sm flex-grow">
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold">📍 Região:</span> {prestador.endereco}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold">📞 Tel:</span> {prestador.telefone}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-400 font-bold">✉️ E-mail:</span> {prestador.email}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                  <p className="text-sm text-gray-600 font-medium mb-1">Sobre o profissional:</p>
                  <p className="text-sm text-gray-500 italic line-clamp-3">
                    "{prestador.descricao || 'Este profissional ainda não adicionou uma descrição.'}"
                  </p>
                  <div className="mt-3 text-xs bg-cyan-50 text-faxinei-ciano font-semibold px-2 py-1 rounded inline-block">
                    🕒 {prestador.horario_atendimento || 'Horário comercial'}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                  <div>
                    <span className="text-xs text-gray-400 block font-medium">Preço Base</span>
                    <span className="text-2xl font-black text-gray-800">
                      R$ {Number(prestador.preco_servico).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  
                  <button 
                    onClick={() => abrirModal(prestador)}
                    className="bg-faxinei-ciano text-white px-5 py-2.5 rounded-xl hover:bg-faxinei-verde-agua transition-all font-bold shadow-sm hover:shadow text-sm"
                  >
                    Contratar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE CONTRATAÇÃO */}
      {prestadorSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setPrestadorSelecionado(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg">✕</button>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Agendar Faxina</h3>
            <p className="text-sm text-gray-500 mb-6">Contratando: <span className="text-faxinei-ciano font-semibold">{prestadorSelecionado.nome}</span></p>

            {sucessoModal ? (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-medium border border-green-200">
                🎉 {sucessoModal}
              </div>
            ) : (
              <form onSubmit={handleContratar} className="space-y-4">
                {erroModal && <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-100">{erroModal}</div>}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Selecione a Data e Hora *</label>
                  <input 
                    type="datetime-local" required value={dataAgendamento} onChange={(e) => setDataAgendamento(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano text-gray-700"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button type="button" onClick={() => setPrestadorSelecionado(null)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 bg-faxinei-ciano text-white py-3 rounded-xl font-bold hover:bg-faxinei-verde-agua transition-colors shadow-md">Confirmar</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}