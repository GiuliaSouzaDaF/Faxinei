import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Cadastro() {
  const navigate = useNavigate();
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    endereco: '',
    tipo: 'cliente', 
    preco_servico: '',
    descricao: '',
    horario_atendimento: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await axios.post('http://localhost:3000/api/auth/registrar', formData);
      
      alert('Cadastro realizado com sucesso!');
      navigate('/login');
    } catch (error) {
      setErro(error.response?.data?.erro || 'Ocorreu um erro ao realizar o cadastro.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex justify-center">
      <div className="bg-faxinei-branco w-full max-w-2xl rounded-xl shadow-lg p-8 border-t-4 border-faxinei-ciano">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Crie sua conta no Faxinei
        </h2>

        {erro && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center">
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="flex justify-center space-x-6 mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" name="tipo" value="cliente" 
                checked={formData.tipo === 'cliente'} 
                onChange={handleChange}
                className="text-faxinei-ciano focus:ring-faxinei-ciano"
              />
              <span className="font-medium text-gray-700">Quero contratar</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio" name="tipo" value="prestador" 
                checked={formData.tipo === 'prestador'} 
                onChange={handleChange}
                className="text-faxinei-verde-agua focus:ring-faxinei-verde-agua"
              />
              <span className="font-medium text-gray-700">Quero trabalhar</span>
            </label>
          </div>

          {/* DADOS BÁSICOS (Para ambos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
              <input 
                type="text" name="nome" required value={formData.nome} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
              <input 
                type="email" name="email" required value={formData.email} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha *</label>
              <input 
                type="password" name="senha" required value={formData.senha} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
              <input 
                type="text" name="telefone" required value={formData.telefone} onChange={handleChange} placeholder="(XX) XXXXX-XXXX"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço (Bairro/Cidade) *</label>
            <input 
              type="text" name="endereco" required value={formData.endereco} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
            />
          </div>

          {formData.tipo === 'prestador' && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-200 mt-4">
              <h3 className="font-semibold text-faxinei-ciano">Informações Profissionais</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço Base (R$) *</label>
                  <input 
                    type="number" name="preco_servico" step="0.01" required={formData.tipo === 'prestador'} 
                    value={formData.preco_servico} onChange={handleChange} placeholder="Ex: 150.00"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Horário de Atendimento *</label>
                  <input 
                    type="text" name="horario_atendimento" required={formData.tipo === 'prestador'} 
                    value={formData.horario_atendimento} onChange={handleChange} placeholder="Ex: Seg a Sex, 08h às 18h"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição / Experiência</label>
                <textarea 
                  name="descricao" rows="3" value={formData.descricao} onChange={handleChange}
                  placeholder="Conte um pouco sobre seu serviço..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-faxinei-ciano focus:ring-1 focus:ring-faxinei-ciano"
                ></textarea>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={carregando}
            className={`w-full py-3 rounded-lg text-white font-bold transition-colors mt-6 ${carregando ? 'bg-gray-400 cursor-not-allowed' : 'bg-faxinei-ciano hover:bg-faxinei-verde-agua'}`}
          >
            {carregando ? 'Cadastrando...' : 'Finalizar Cadastro'}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Já tem uma conta? <Link to="/login" className="text-faxinei-ciano font-semibold hover:underline">Faça login aqui</Link>
        </p>
      </div>
    </div>
  );
}