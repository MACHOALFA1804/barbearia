-- Políticas RLS (Row Level Security) para Sistema de Barbearia

-- Habilitar RLS em todas as tabelas
ALTER TABLE config ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE grupo_acessos ENABLE ROW LEVEL SECURITY;
ALTER TABLE acessos ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios_permissoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE cat_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE cat_produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE dias ENABLE ROW LEVEL SECURITY;
ALTER TABLE horarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE entradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE saidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE textos_index ENABLE ROW LEVEL SECURITY;

-- Função para verificar se o usuário está autenticado
CREATE OR REPLACE FUNCTION auth.user_id() RETURNS UUID AS $$
  SELECT auth.uid()
$$ LANGUAGE SQL STABLE;

-- Função para verificar se o usuário é administrador
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios 
    WHERE email = auth.jwt() ->> 'email' 
    AND nivel = 'Administrador'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Função para verificar se o usuário é funcionário
CREATE OR REPLACE FUNCTION is_funcionario() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuarios 
    WHERE email = auth.jwt() ->> 'email' 
    AND ativo = 'Sim'
  );
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

-- Políticas para tabela config (apenas admin pode modificar)
CREATE POLICY "Admin pode ver config" ON config FOR SELECT USING (is_admin());
CREATE POLICY "Admin pode atualizar config" ON config FOR UPDATE USING (is_admin());

-- Políticas para tabela cargos
CREATE POLICY "Funcionários podem ver cargos" ON cargos FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar cargos" ON cargos FOR ALL USING (is_admin());

-- Políticas para tabela usuarios
CREATE POLICY "Funcionários podem ver usuários" ON usuarios FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar usuários" ON usuarios FOR ALL USING (is_admin());
CREATE POLICY "Usuário pode ver próprio perfil" ON usuarios FOR SELECT USING (email = auth.jwt() ->> 'email');
CREATE POLICY "Usuário pode atualizar próprio perfil" ON usuarios FOR UPDATE USING (email = auth.jwt() ->> 'email');

-- Políticas para tabela grupo_acessos
CREATE POLICY "Admin pode gerenciar grupos" ON grupo_acessos FOR ALL USING (is_admin());

-- Políticas para tabela acessos
CREATE POLICY "Funcionários podem ver acessos" ON acessos FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar acessos" ON acessos FOR ALL USING (is_admin());

-- Políticas para tabela usuarios_permissoes
CREATE POLICY "Funcionários podem ver permissões" ON usuarios_permissoes FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar permissões" ON usuarios_permissoes FOR ALL USING (is_admin());

-- Políticas para tabela clientes
CREATE POLICY "Funcionários podem gerenciar clientes" ON clientes FOR ALL USING (is_funcionario());

-- Políticas para tabela fornecedores
CREATE POLICY "Funcionários podem gerenciar fornecedores" ON fornecedores FOR ALL USING (is_funcionario());

-- Políticas para tabela cat_servicos
CREATE POLICY "Funcionários podem ver categorias serviços" ON cat_servicos FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar categorias serviços" ON cat_servicos FOR ALL USING (is_admin());

-- Políticas para tabela servicos
CREATE POLICY "Todos podem ver serviços ativos" ON servicos FOR SELECT USING (ativo = 'Sim');
CREATE POLICY "Funcionários podem gerenciar serviços" ON servicos FOR ALL USING (is_funcionario());

-- Políticas para tabela cat_produtos
CREATE POLICY "Funcionários podem ver categorias produtos" ON cat_produtos FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar categorias produtos" ON cat_produtos FOR ALL USING (is_admin());

-- Políticas para tabela produtos
CREATE POLICY "Funcionários podem gerenciar produtos" ON produtos FOR ALL USING (is_funcionario());

-- Políticas para tabela dias
CREATE POLICY "Funcionários podem ver dias" ON dias FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar dias" ON dias FOR ALL USING (is_admin());
CREATE POLICY "Funcionário pode gerenciar próprios dias" ON dias FOR ALL USING (
  funcionario = (SELECT id FROM usuarios WHERE email = auth.jwt() ->> 'email')
);

-- Políticas para tabela horarios
CREATE POLICY "Funcionários podem ver horários" ON horarios FOR SELECT USING (is_funcionario());
CREATE POLICY "Admin pode gerenciar horários" ON horarios FOR ALL USING (is_admin());
CREATE POLICY "Funcionário pode gerenciar próprios horários" ON horarios FOR ALL USING (
  funcionario = (SELECT id FROM usuarios WHERE email = auth.jwt() ->> 'email')
);

-- Políticas para tabela agendamentos
CREATE POLICY "Todos podem ver agendamentos" ON agendamentos FOR SELECT USING (true);
CREATE POLICY "Funcionários podem gerenciar agendamentos" ON agendamentos FOR ALL USING (is_funcionario());

-- Políticas para tabela receber
CREATE POLICY "Funcionários podem gerenciar contas a receber" ON receber FOR ALL USING (is_funcionario());

-- Políticas para tabela pagar
CREATE POLICY "Funcionários podem gerenciar contas a pagar" ON pagar FOR ALL USING (is_funcionario());

-- Políticas para tabela entradas
CREATE POLICY "Funcionários podem gerenciar entradas" ON entradas FOR ALL USING (is_funcionario());

-- Políticas para tabela saidas
CREATE POLICY "Funcionários podem gerenciar saídas" ON saidas FOR ALL USING (is_funcionario());

-- Políticas para tabela comentarios
CREATE POLICY "Todos podem ver comentários ativos" ON comentarios FOR SELECT USING (ativo = 'Sim');
CREATE POLICY "Funcionários podem gerenciar comentários" ON comentarios FOR ALL USING (is_funcionario());

-- Políticas para tabela textos_index
CREATE POLICY "Todos podem ver textos index" ON textos_index FOR SELECT USING (true);
CREATE POLICY "Admin pode gerenciar textos index" ON textos_index FOR ALL USING (is_admin());

-- Triggers para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas que têm updated_at
CREATE TRIGGER update_config_updated_at BEFORE UPDATE ON config FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cargos_updated_at BEFORE UPDATE ON cargos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grupo_acessos_updated_at BEFORE UPDATE ON grupo_acessos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_acessos_updated_at BEFORE UPDATE ON acessos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON fornecedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cat_servicos_updated_at BEFORE UPDATE ON cat_servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON servicos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cat_produtos_updated_at BEFORE UPDATE ON cat_produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON agendamentos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_receber_updated_at BEFORE UPDATE ON receber FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagar_updated_at BEFORE UPDATE ON pagar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_comentarios_updated_at BEFORE UPDATE ON comentarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_textos_index_updated_at BEFORE UPDATE ON textos_index FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

