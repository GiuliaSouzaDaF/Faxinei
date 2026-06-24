import React from 'react';

export default function Sobre() {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      <div className="bg-faxinei-ciano text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-opacity-20 bg-black backdrop-blur-[2px]" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-wide">
            Nossa Missão é Facilitar a Sua Vida
          </h1>
          <p className="text-lg md:text-xl text-cyan-100 max-w-2xl mx-auto font-medium">
            Conectando profissionais de limpeza dedicados a clientes que buscam um lar impecável e mais tempo livre.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gray-50 clip-path-wave" />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              O que é o <span className="text-faxinei-ciano">Faxinei.</span>?
            </h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              O Faxinei nasceu da necessidade de desburocratizar a contratação de serviços de limpeza residencial e comercial. Percebemos que encontrar um profissional de confiança nem sempre é fácil, e para os prestadores, divulgar seu trabalho e gerenciar a agenda também é um desafio.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Nossa plataforma serve como uma ponte direta, segura e transparente. Aqui, o cliente pesquisa por região, avalia preços e perfis, e agenda em poucos cliques. Do outro lado, o prestador tem autonomia total sobre seus preços, horários e histórico de serviços.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100 grid grid-cols-1 gap-6">
            <div className="flex items-start space-x-4">
              <div className="bg-cyan-50 p-3 rounded-xl text-faxinei-ciano font-bold text-xl">🤝</div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Autonomia Total</h4>
                <p className="text-sm text-gray-500">Prestadores definem seus próprios valores por diária ou hora, sem taxas abusivas.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-teal-50 p-3 rounded-xl text-faxinei-verde-agua font-bold text-xl">🔍</div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Filtro Inteligente</h4>
                <p className="text-sm text-gray-500">Encontre profissionais que atendem exatamente no seu bairro ou região.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-50 p-3 rounded-xl text-purple-600 font-bold text-xl">📅</div>
              <div>
                <h4 className="font-bold text-gray-800 text-lg">Gestão Descomplicada</h4>
                <p className="text-sm text-gray-500">Um painel interativo para acompanhar agendamentos pendentes, concluídos ou cancelados.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white py-16 border-t border-b border-gray-100">
        <div className="container mx-auto px-4 text-center max-w-5xl">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-12">Nossos Pilares</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Segurança</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Ambiente com rotas autenticadas via JWT, garantindo que seus dados de perfil e agendamentos fiquem protegidos.
              </p>
            </div>

            <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Valorização</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Acreditamos na valorização do profissional de limpeza, dando a eles as ferramentas para gerir seu próprio negócio.
              </p>
            </div>

            <div className="p-6 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="font-bold text-xl text-gray-800 mb-2">Praticidade</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Interface limpa desenvolvida em React e Tailwind CSS para que o agendamento leve menos de um minuto.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 text-center max-w-2xl">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Pronto para começar?</h2>
        <p className="text-gray-500 mb-8">
          Seja para deixar sua casa brilhando ou para conseguir novos clientes, o Faxinei é o seu lugar.
        </p>
        <div className="flex justify-center space-x-4">
          <a href="/cadastro" className="bg-faxinei-ciano text-white px-6 py-3 rounded-xl font-bold hover:bg-faxinei-verde-agua transition-colors shadow-md">
            Criar Minha Conta
          </a>
          <a href="/" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
            Procurar Faxinas
          </a>
        </div>
      </div>

    </div>
  );
}