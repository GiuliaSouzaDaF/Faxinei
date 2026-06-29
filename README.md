# 🧼 Faxinei.
O **Faxinei.** é uma plataforma web moderna desenvolvida para desburocratizar e conectar diretamente profissionais de limpeza autônomos a clientes que buscam um lar impecável e mais praticidade no dia a dia.

---

## 🚀 Funcionalidades Principais

### Para Clientes
* **Busca Inteligente:** Encontre prestadores filtrando por localização/bairro diretamente na página inicial.
* **Agendamento Descomplicado:** Escolha o profissional ideal, visualize o preço base e selecione data e hora no sistema.
* **Sistema de Avaliações (Estrelas):** Avalie os serviços concluídos com notas de 1 a 5 e deixe depoimentos reais.

### Para Prestadores de Serviço
* **Gestão de Perfil:** Controle total sobre suas informações, descrição profissional, preço cobrado e horários de atendimento.
* **Painel de Controle:** Gerenciamento interativo de status de agendamentos (pendente, aceito, concluído ou cancelado).

### Segurança e Institucional
* **Autenticação Segura:** Rotas e ações protegidas via tokens JWT (*JSON Web Tokens*).
* **Seção Sobre Nós:** Página institucional dedicada a detalhar a missão e os valores da plataforma.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
* **React** (com Vite)
* **Tailwind CSS** (Estilização responsiva e moderna)
* **React Router Dom** (Navegação dinâmica)
* **Axios** (Integração e requisições HTTP)

### Backend
* **Node.js** com **Express**
* **MySQL** (Persistência de dados com pool de conexões assíncronas)
* **JWT (JSON Web Tokens)** & **Bcrypt** (Autenticação e criptografia de senhas)
* **Nodemon** (Ambiente de desenvolvimento fluido)

---

## 💾 Estrutura do Banco de Dados

O banco de dados armazena as informações através de relações seguras e regras de integridade (`ON DELETE CASCADE`):

* `usuarios`: Gerencia credenciais, senhas criptografadas, contatos e o tipo de conta (`cliente` ou `prestador`).
* `perfil_prestador`: Armazena dados específicos do profissional (preço base, descrição e horários).
* `agendamentos`: Controla o fluxo de serviços prestados e status de horários entre clientes e prestadores.


---

## 🔧 Como Rodar o Projeto

### Pré-requisitos
* Node.js instalado (versão 18 ou superior recomendada)
* MySQL Server ativo

### 1. Configurando o Banco de Dados
Abra o seu gerenciador MySQL e execute os scripts de criação de tabelas (`usuarios`, `perfil_prestador`, `agendamentos` e `avaliacoes`).

### 2. Configurando o Backend
1. Navegue até a pasta do backend:
   ```bash
   cd backend
### 🛠️ 2. Comandos de Auxílio e Sobrevivência (Guia Rápido)

Aqui estão os comandos fundamentais que você usa no terminal para controlar o projeto:

#### ⚡ Para Ligar o Projeto (Sempre em Terminais Separados)
* **Ligar o Backend:**
  ```bash
  cd backend
  npm run dev
