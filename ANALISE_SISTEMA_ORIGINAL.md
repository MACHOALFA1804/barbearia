# Análise do Sistema de Barbearia Original

## Estrutura do Banco de Dados

O sistema original possui as seguintes tabelas principais:

### 1. Usuários e Permissões
- **usuarios**: Usuários do sistema (funcionários, admin)
- **usuarios_permissoes**: Permissões específicas por usuário
- **acessos**: Módulos/funcionalidades do sistema
- **grupo_acessos**: Grupos de permissões
- **cargos**: Cargos dos funcionários

### 2. Clientes
- **clientes**: Dados dos clientes (nome, telefone, endereço, data nascimento, cartões fidelidade)

### 3. Funcionários
- **funcionarios**: Dados dos funcionários (vinculados a usuários)
- **dias**: Dias de trabalho dos funcionários
- **horarios**: Horários de trabalho dos funcionários

### 4. Serviços
- **servicos**: Serviços oferecidos (corte, barba, etc.)
- **cat_servicos**: Categorias de serviços

### 5. Produtos
- **produtos**: Produtos vendidos (pomadas, cremes, etc.)
- **cat_produtos**: Categorias de produtos
- **entradas**: Entradas de produtos no estoque
- **saidas**: Saídas de produtos do estoque

### 6. Agendamentos
- **agendamentos**: Agendamentos de serviços

### 7. Financeiro
- **receber**: Contas a receber (serviços, vendas)
- **pagar**: Contas a pagar (compras, comissões, contas)
- **fornecedores**: Fornecedores

### 8. Configurações
- **config**: Configurações gerais do sistema
- **comentarios**: Comentários/depoimentos para o site
- **textos_index**: Textos do banner da página inicial

## Funcionalidades Principais

1. **Gestão de Usuários**: Controle de acesso com diferentes níveis
2. **Gestão de Clientes**: Cadastro com sistema de fidelidade (cartões)
3. **Gestão de Funcionários**: Horários e dias de trabalho
4. **Agendamentos**: Sistema completo de agendamento de serviços
5. **Controle de Estoque**: Produtos com entrada/saída
6. **Financeiro**: Contas a pagar/receber, comissões
7. **Relatórios**: Diversos relatórios (produtos, comissões, lucro, etc.)
8. **Site Público**: Página inicial com agendamento online

## Características Técnicas

- **Backend**: PHP com PDO (MySQL)
- **Frontend**: HTML, CSS, JavaScript, Bootstrap 3
- **Banco**: MySQL/MariaDB
- **Autenticação**: Sistema próprio com MD5 (será migrado para bcrypt)
- **Upload de Arquivos**: Sistema de upload para fotos e documentos
- **Relatórios**: Geração de PDF com DomPDF

## Sistema de Fidelidade

- Clientes ganham cartões a cada serviço
- Ao completar a quantidade configurada, ganham serviço gratuito
- Controle de data de retorno para alertas

## Comissões

- Sistema de comissões para funcionários
- Pode ser por valor fixo (R$) ou porcentagem
- Geração automática de contas a pagar para comissões

