import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export function ModalAvaliacao({ agendamento, onClose, onAvaliacaoSucesso }) {
    const [nota, setNota] = useState(0);
    const [hoverNota, setHoverNota] = useState(0);
    const [comentario, setComentario] = useState("");
    const [carregando, setCarregando] = useState(false);

    const handleEnviar = async () => {
        if (nota === 0) {
            toast.warn("Por favor, selecione pelo menos 1 estrela.");
            return;
        }

        setCarregando(true);

        try {
            const token = localStorage.getItem('token'); 

            const resposta = await axios.post('http://localhost:3000/api/avaliacoes', {
                agendamento_id: agendamento.id,
                nota: nota,
                comentario: comentario
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (onAvaliacaoSucesso) {
                onAvaliacaoSucesso(agendamento.id);
            }

            toast.success(resposta.data.mensagem || "Avaliação enviada com sucesso! ✨");
            onClose(); 

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.erro || "Erro ao enviar a avaliação.");
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 text-center border border-gray-100 relative animate-fadeIn">
                
                {/* Botão X para fechar */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={carregando}
                >
                    ✕
                </button>

                <h3 className="text-2xl font-black text-gray-800 mb-2">Avaliar Serviço</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                    Como foi a sua experiência com a faxina de <strong className="text-faxinei-ciano">{agendamento.prestador_nome}</strong>?
                </p>

                {/* CONTAINER DE ESTRELAS INTERATIVAS CORRIGIDO */}
                <div className="flex gap-3 justify-center mb-6">
                    {[1, 2, 3, 4, 5].map((estrela) => (
                        <i
                            key={estrela}
                            className={`text-4xl cursor-pointer transition-all duration-150 transform hover:scale-110 ${
                                estrela <= (hoverNota || nota) 
                                    ? "fa-solid fa-star text-amber-500" // Estrela preenchida
                                    : "fa-regular fa-star text-gray-300" // Estrela vazia
                            }`}
                            onMouseEnter={() => !carregando && setHoverNota(estrela)}
                            onMouseLeave={() => !carregando && setHoverNota(0)}
                            onClick={() => !carregando && setNota(estrela)}
                        />
                    ))}
                </div>

                {/* TEXTAREA DO COMENTÁRIO */}
                <textarea
                    placeholder="Deixe um comentário contando sobre a pontualidade, educação e capricho do profissional... (Opcional)"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano resize-none mb-6 text-gray-700"
                    rows="4"
                    disabled={carregando}
                />

                {/* BOTÕES */}
                <div className="flex space-x-3">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                        disabled={carregando}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        onClick={handleEnviar} 
                        className="flex-1 bg-faxinei-ciano text-white py-3 rounded-xl font-bold hover:bg-faxinei-verde-agua transition-colors shadow-md text-sm flex items-center justify-center"
                        disabled={carregando}
                    >
                        {carregando ? "Enviando..." : "Confirmar"}
                    </button>
                </div>
            </div>
        </div>
    );
}