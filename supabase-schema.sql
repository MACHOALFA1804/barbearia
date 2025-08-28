-- Schema para Sistema de Barbearia no Supabase
-- Baseado no sistema original PHP/MySQL

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de configurações do sistema
CREATE TABLE config (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    telefone_fixo VARCHAR(20),
    telefone_whatsapp VARCHAR(20) NOT NULL,
    endereco VARCHAR(100),
    logo VARCHAR(100),
    icone VARCHAR(100),
    logo_rel VARCHAR(100),
    tipo_rel VARCHAR(10),
    instagram VARCHAR(100),
    tipo_comissao VARCHAR(25) NOT NULL,
    texto_rodape VARCHAR(255),
    img_banner_index VARCHAR(100),
    texto_sobre TEXT,
    imagem_sobre VARCHAR(100),
    icone_site VARCHAR(100) NOT NULL,
    mapa TEXT,
    texto_fidelidade VARCHAR(255),
    quantidade_cartoes INTEGER NOT NULL DEFAULT 10,
    texto_agendamento VARCHAR(30),
    msg_agendamento VARCHAR(5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de cargos
CREATE TABLE cargos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(35) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários (funcionários)
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    cpf VARCHAR(20),
    senha VARCHAR(255) NOT NULL,
    nivel VARCHAR(20) NOT NULL DEFAULT 'Funcionário',
    cargo INTEGER REFERENCES cargos(id),
    data_cad DATE NOT NULL DEFAULT CURRENT_DATE,
    ativo VARCHAR(5) NOT NULL DEFAULT 'Sim',
    foto VARCHAR(100) DEFAULT 'sem-foto.jpg',
    telefone VARCHAR(20),
    endereco VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de grupos de acesso
CREATE TABLE grupo_acessos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(35) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de acessos/módulos
CREATE TABLE acessos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    chave VARCHAR(50) NOT NULL,
    grupo INTEGER REFERENCES grupo_acessos(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de permissões de usuários
CREATE TABLE usuarios_permissoes (
    id SERIAL PRIMARY KEY,
    usuario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    permissao INTEGER REFERENCES acessos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(100),
    data_nasc DATE,
    data_cad DATE NOT NULL DEFAULT CURRENT_DATE,
    cartoes INTEGER NOT NULL DEFAULT 0,
    data_retorno DATE,
    ultimo_servico INTEGER,
    alertado VARCHAR(5) DEFAULT 'Não',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fornecedores
CREATE TABLE fornecedores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    telefone VARCHAR(20),
    endereco VARCHAR(100),
    email VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias de serviços
CREATE TABLE cat_servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de serviços
CREATE TABLE servicos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    categoria INTEGER REFERENCES cat_servicos(id),
    valor DECIMAL(8,2) NOT NULL,
    comissao DECIMAL(8,2) NOT NULL DEFAULT 0,
    descricao TEXT,
    foto VARCHAR(100),
    ativo VARCHAR(5) NOT NULL DEFAULT 'Sim',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de categorias de produtos
CREATE TABLE cat_produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    descricao TEXT,
    categoria INTEGER REFERENCES cat_produtos(id),
    valor_compra DECIMAL(8,2) NOT NULL,
    valor_venda DECIMAL(8,2) NOT NULL,
    estoque INTEGER NOT NULL DEFAULT 0,
    foto VARCHAR(100),
    nivel_estoque INTEGER NOT NULL DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dias de trabalho dos funcionários
CREATE TABLE dias (
    id SERIAL PRIMARY KEY,
    dia VARCHAR(25) NOT NULL,
    funcionario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de horários dos funcionários
CREATE TABLE horarios (
    id SERIAL PRIMARY KEY,
    inicio TIME NOT NULL,
    final TIME NOT NULL,
    funcionario INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id SERIAL PRIMARY KEY,
    funcionario INTEGER REFERENCES usuarios(id),
    cliente INTEGER REFERENCES clientes(id),
    data DATE NOT NULL,
    hora TIME NOT NULL,
    obs VARCHAR(100),
    data_lanc DATE NOT NULL DEFAULT CURRENT_DATE,
    usuario INTEGER REFERENCES usuarios(id),
    status VARCHAR(20) NOT NULL DEFAULT 'Agendado',
    servico INTEGER REFERENCES servicos(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas a receber
CREATE TABLE receber (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50),
    tipo VARCHAR(35),
    valor DECIMAL(8,2) NOT NULL,
    data_lanc DATE NOT NULL DEFAULT CURRENT_DATE,
    data_venc DATE NOT NULL,
    data_pgto DATE,
    usuario_lanc INTEGER REFERENCES usuarios(id),
    usuario_baixa INTEGER REFERENCES usuarios(id),
    foto VARCHAR(100),
    pessoa INTEGER,
    pago VARCHAR(5) NOT NULL DEFAULT 'Não',
    produto INTEGER REFERENCES produtos(id),
    quantidade INTEGER,
    servico INTEGER REFERENCES servicos(id),
    funcionario INTEGER REFERENCES usuarios(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas a pagar
CREATE TABLE pagar (
    id SERIAL PRIMARY KEY,
    descricao VARCHAR(50),
    tipo VARCHAR(35),
    valor DECIMAL(8,2) NOT NULL,
    data_lanc DATE NOT NULL DEFAULT CURRENT_DATE,
    data_venc DATE NOT NULL,
    data_pgto DATE,
    usuario_lanc INTEGER REFERENCES usuarios(id),
    usuario_baixa INTEGER REFERENCES usuarios(id),
    foto VARCHAR(100),
    pessoa INTEGER,
    pago VARCHAR(5) NOT NULL DEFAULT 'Não',
    produto INTEGER REFERENCES produtos(id),
    quantidade INTEGER,
    funcionario INTEGER REFERENCES usuarios(id),
    servico INTEGER REFERENCES servicos(id),
    cliente INTEGER REFERENCES clientes(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de entradas de produtos
CREATE TABLE entradas (
    id SERIAL PRIMARY KEY,
    produto INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    motivo VARCHAR(100),
    usuario INTEGER REFERENCES usuarios(id),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de saídas de produtos
CREATE TABLE saidas (
    id SERIAL PRIMARY KEY,
    produto INTEGER REFERENCES produtos(id),
    quantidade INTEGER NOT NULL,
    motivo VARCHAR(100),
    usuario INTEGER REFERENCES usuarios(id),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de comentários/depoimentos
CREATE TABLE comentarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    texto TEXT NOT NULL,
    foto VARCHAR(100),
    ativo VARCHAR(5) NOT NULL DEFAULT 'Não',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de textos da página inicial
CREATE TABLE textos_index (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    subtitulo VARCHAR(100),
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO config (nome, email, telefone_whatsapp, tipo_comissao, quantidade_cartoes, texto_agendamento, msg_agendamento) 
VALUES ('Barbearia Studio', 'admin@admin.com', '(31) 99999-9999', 'R$', 10, 'Selecionar Barbeiro', 'Não');

INSERT INTO cargos (nome) VALUES 
('Administrador'),
('Gerente'),
('Recepcionista'),
('Barbeiro'),
('Cabelereira'),
('Manicure e Pedicure');

INSERT INTO grupo_acessos (nome) VALUES 
('Pessoas'),
('Cadastros'),
('Produtos'),
('Financeiro'),
('Agendamentos'),
('Relatórios'),
('Site');

INSERT INTO acessos (nome, chave, grupo) VALUES 
('Usuários', 'usuarios', 1),
('Funcionários', 'funcionarios', 1),
('Clientes', 'clientes', 1),
('Clientes Retornos', 'clientes_retorno', 1),
('Fornecedores', 'fornecedores', 1),
('Serviços', 'servicos', 2),
('Cargos', 'cargos', 2),
('Categoria Serviços', 'cat_servicos', 2),
('Grupo Acessos', 'grupos', 2),
('Acessos', 'acessos', 2),
('Produtos', 'produtos', 3),
('Categorias', 'cat_produtos', 3),
('Estoque Baixo', 'estoque', 3),
('Saídas', 'saidas', 3),
('Entradas', 'entradas', 3),
('Vendas', 'vendas', 4),
('Compras', 'compras', 4),
('Contas à Pagar', 'pagar', 4),
('Contas à Receber', 'receber', 4),
('Agendamentos', 'agendamentos', 5),
('Serviços Agendamentos', 'servicos_agenda', 5),
('Home', 'home', 0),
('Relatório Produtos', 'rel_produtos', 6),
('Relatório de Entradas', 'rel_entradas', 6),
('Relatório de Saídas', 'rel_saidas', 6),
('Relatório de Comissões', 'rel_comissoes', 6),
('Relatório de Contas', 'rel_contas', 6),
('Aniversáriantes', 'rel_aniv', 6),
('Relatório de Lucro', 'rel_lucro', 6),
('Textos Banner Index', 'textos_index', 7),
('Comentários / Depoimentos', 'comentarios', 7),
('Configurações do Sistema', 'configuracoes', 0);

INSERT INTO cat_servicos (nome) VALUES 
('Corte'),
('Química'),
('Manicure e Pedicure'),
('Depilação');

INSERT INTO cat_produtos (nome) VALUES 
('Pomadas'),
('Cremes'),
('Lâminas e Giletes'),
('Bebidas'),
('Gel'),
('Esmaltes');

