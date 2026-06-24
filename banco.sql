CREATE DATABASE IF NOT EXISTS faxinei;
USE faxinei;

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(255),
    tipo ENUM('cliente', 'prestador') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS perfil_prestador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL UNIQUE,
    preco_servico DECIMAL(10,2) NOT NULL,
    descricao TEXT,
    horario_atendimento VARCHAR(255) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    prestador_id INT NOT NULL,
    data_agendamento DATETIME NOT NULL,
    status ENUM('pendente', 'concluido', 'cancelado') DEFAULT 'pendente',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (prestador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
CREATE TABLE avaliacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    agendamento_id INT NOT NULL UNIQUE, -- UNIQUE garante que cada faxina só seja avaliada uma vez
    cliente_id INT NOT NULL,
    prestador_id INT NOT NULL,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5), -- Força o banco a aceitar apenas de 1 a 5
    comentario TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agendamento_id) REFERENCES agendamentos(id) ON DELETE CASCADE,
    FOREIGN KEY (cliente_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (prestador_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

ALTER TABLE usuarios ADD COLUMN descricao TEXT;
ALTER TABLE usuarios ADD COLUMN preco_servico DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE usuarios ADD COLUMN horario_atendimento VARCHAR(100);
