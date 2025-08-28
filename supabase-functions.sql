-- Funções auxiliares para Sistema de Barbearia no Supabase

-- Função para criar usuário administrador inicial
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS VOID AS $$
BEGIN
  INSERT INTO usuarios (nome, email, cpf, senha, nivel, data_cad, ativo, foto)
  VALUES ('Admin', 'admin@admin.com', '000.000.000-00', crypt('123', gen_salt('bf')), 'Administrador', CURRENT_DATE, 'Sim', 'sem-foto.jpg')
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar estoque de produto
CREATE OR REPLACE FUNCTION atualizar_estoque_produto(
  produto_id INTEGER,
  quantidade INTEGER,
  tipo VARCHAR(10), -- 'entrada' ou 'saida'
  motivo VARCHAR(100),
  usuario_id INTEGER
)
RETURNS VOID AS $$
BEGIN
  IF tipo = 'entrada' THEN
    UPDATE produtos SET estoque = estoque + quantidade WHERE id = produto_id;
    INSERT INTO entradas (produto, quantidade, motivo, usuario, data)
    VALUES (produto_id, quantidade, motivo, usuario_id, CURRENT_DATE);
  ELSIF tipo = 'saida' THEN
    UPDATE produtos SET estoque = estoque - quantidade WHERE id = produto_id;
    INSERT INTO saidas (produto, quantidade, motivo, usuario, data)
    VALUES (produto_id, quantidade, motivo, usuario_id, CURRENT_DATE);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Função para calcular comissão
CREATE OR REPLACE FUNCTION calcular_comissao(
  servico_id INTEGER,
  valor_servico DECIMAL(8,2)
)
RETURNS DECIMAL(8,2) AS $$
DECLARE
  comissao_servico DECIMAL(8,2);
  tipo_comissao VARCHAR(25);
  valor_comissao DECIMAL(8,2);
BEGIN
  -- Buscar comissão do serviço
  SELECT comissao INTO comissao_servico FROM servicos WHERE id = servico_id;
  
  -- Buscar tipo de comissão da configuração
  SELECT config.tipo_comissao INTO tipo_comissao FROM config LIMIT 1;
  
  IF tipo_comissao = 'Porcentagem' THEN
    valor_comissao := (valor_servico * comissao_servico) / 100;
  ELSE
    valor_comissao := comissao_servico;
  END IF;
  
  RETURN valor_comissao;
END;
$$ LANGUAGE plpgsql;

-- Função para finalizar agendamento e gerar comissão
CREATE OR REPLACE FUNCTION finalizar_agendamento(
  agendamento_id INTEGER,
  valor_pago DECIMAL(8,2)
)
RETURNS VOID AS $$
DECLARE
  agend RECORD;
  valor_comissao DECIMAL(8,2);
  nome_servico VARCHAR(50);
  nome_funcionario VARCHAR(50);
BEGIN
  -- Buscar dados do agendamento
  SELECT a.*, s.nome as servico_nome, s.valor, u.nome as funcionario_nome
  INTO agend
  FROM agendamentos a
  JOIN servicos s ON a.servico = s.id
  JOIN usuarios u ON a.funcionario = u.id
  WHERE a.id = agendamento_id;
  
  -- Atualizar status do agendamento
  UPDATE agendamentos SET status = 'Concluído' WHERE id = agendamento_id;
  
  -- Criar conta a receber
  INSERT INTO receber (descricao, tipo, valor, data_lanc, data_venc, data_pgto, usuario_lanc, usuario_baixa, pago, servico, funcionario)
  VALUES (agend.servico_nome, 'Serviço', valor_pago, CURRENT_DATE, CURRENT_DATE, CURRENT_DATE, agend.usuario, agend.usuario, 'Sim', agend.servico, agend.funcionario);
  
  -- Calcular e criar comissão
  valor_comissao := calcular_comissao(agend.servico, valor_pago);
  
  IF valor_comissao > 0 THEN
    INSERT INTO pagar (descricao, tipo, valor, data_lanc, data_venc, usuario_lanc, pago, funcionario, servico, cliente)
    VALUES ('Comissão - ' || agend.servico_nome, 'Comissão', valor_comissao, CURRENT_DATE, CURRENT_DATE, agend.usuario, 'Não', agend.funcionario, agend.servico, agend.cliente);
  END IF;
  
  -- Atualizar cartões fidelidade do cliente
  UPDATE clientes SET cartoes = cartoes + 1 WHERE id = agend.cliente;
  
  -- Verificar se completou cartões fidelidade
  DECLARE
    cartoes_cliente INTEGER;
    quantidade_cartoes_config INTEGER;
  BEGIN
    SELECT cartoes INTO cartoes_cliente FROM clientes WHERE id = agend.cliente;
    SELECT quantidade_cartoes INTO quantidade_cartoes_config FROM config LIMIT 1;
    
    IF cartoes_cliente >= quantidade_cartoes_config THEN
      UPDATE clientes SET cartoes = 0 WHERE id = agend.cliente;
      -- Aqui poderia enviar notificação de cartão completo
    END IF;
  END;
END;
$$ LANGUAGE plpgsql;

-- Função para verificar disponibilidade de horário
CREATE OR REPLACE FUNCTION verificar_disponibilidade(
  funcionario_id INTEGER,
  data_agendamento DATE,
  hora_agendamento TIME
)
RETURNS BOOLEAN AS $$
DECLARE
  agendamento_existente INTEGER;
BEGIN
  SELECT COUNT(*) INTO agendamento_existente
  FROM agendamentos
  WHERE funcionario = funcionario_id
  AND data = data_agendamento
  AND hora = hora_agendamento
  AND status != 'Cancelado';
  
  RETURN agendamento_existente = 0;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar horários disponíveis de um funcionário
CREATE OR REPLACE FUNCTION buscar_horarios_disponiveis(
  funcionario_id INTEGER,
  data_agendamento DATE
)
RETURNS TABLE(hora TIME) AS $$
BEGIN
  RETURN QUERY
  SELECT h.inicio
  FROM horarios h
  WHERE h.funcionario = funcionario_id
  AND NOT EXISTS (
    SELECT 1 FROM agendamentos a
    WHERE a.funcionario = funcionario_id
    AND a.data = data_agendamento
    AND a.hora = h.inicio
    AND a.status != 'Cancelado'
  )
  ORDER BY h.inicio;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar produtos com estoque baixo
CREATE OR REPLACE FUNCTION produtos_estoque_baixo()
RETURNS TABLE(
  id INTEGER,
  nome VARCHAR(50),
  estoque INTEGER,
  nivel_estoque INTEGER,
  categoria_nome VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.nome, p.estoque, p.nivel_estoque, c.nome as categoria_nome
  FROM produtos p
  JOIN cat_produtos c ON p.categoria = c.id
  WHERE p.estoque <= p.nivel_estoque
  ORDER BY p.estoque ASC;
END;
$$ LANGUAGE plpgsql;

-- Função para relatório de vendas por período
CREATE OR REPLACE FUNCTION relatorio_vendas(
  data_inicio DATE,
  data_fim DATE
)
RETURNS TABLE(
  data DATE,
  total_vendas DECIMAL(10,2),
  total_servicos DECIMAL(10,2),
  total_produtos DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    r.data_lanc as data,
    SUM(r.valor) as total_vendas,
    SUM(CASE WHEN r.tipo = 'Serviço' THEN r.valor ELSE 0 END) as total_servicos,
    SUM(CASE WHEN r.tipo = 'Venda' THEN r.valor ELSE 0 END) as total_produtos
  FROM receber r
  WHERE r.data_lanc BETWEEN data_inicio AND data_fim
  AND r.pago = 'Sim'
  GROUP BY r.data_lanc
  ORDER BY r.data_lanc;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar clientes aniversariantes
CREATE OR REPLACE FUNCTION clientes_aniversariantes(mes INTEGER)
RETURNS TABLE(
  id INTEGER,
  nome VARCHAR(50),
  telefone VARCHAR(20),
  data_nasc DATE
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.nome, c.telefone, c.data_nasc
  FROM clientes c
  WHERE EXTRACT(MONTH FROM c.data_nasc) = mes
  AND c.data_nasc IS NOT NULL
  ORDER BY EXTRACT(DAY FROM c.data_nasc);
END;
$$ LANGUAGE plpgsql;

-- Executar função para criar admin inicial
SELECT create_admin_user();

