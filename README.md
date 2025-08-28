# Sistema de Barbearia - React + Supabase

Sistema completo de gestão para barbearias desenvolvido em React com JavaScript e Supabase, baseado no sistema original PHP/MySQL.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Autenticação**: Sistema de login seguro com Supabase Auth
- **Dashboard**: Painel principal com estatísticas e resumos
- **Layout Responsivo**: Interface moderna e responsiva
- **Estrutura Modular**: Componentes organizados e reutilizáveis

### 🔄 Em Desenvolvimento
- **Gestão de Pessoas**: Usuários, Funcionários, Clientes, Fornecedores
- **Cadastros**: Serviços, Cargos, Categorias
- **Produtos**: Controle de estoque completo
- **Financeiro**: Contas a pagar/receber, vendas, compras
- **Agendamentos**: Sistema completo de agendamento
- **Relatórios**: Diversos relatórios gerenciais
- **Site Público**: Página inicial com agendamento online

## 🛠️ Tecnologias

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Roteamento**: React Router DOM
- **Formulários**: React Hook Form + Zod
- **Estilização**: Tailwind CSS + CSS Variables

## 📋 Pré-requisitos

- Node.js 18+ 
- pnpm (ou npm/yarn)
- Conta no Supabase

## 🔧 Configuração

### 1. Clone e instale dependências

```bash
cd sistema-barbearia
pnpm install
```

### 2. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Copie a URL e a chave anônima do projeto
3. Renomeie `.env.example` para `.env` e configure:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### 3. Configure o banco de dados

Execute os scripts SQL no editor SQL do Supabase na seguinte ordem:

1. **Estrutura do banco**: `supabase-schema.sql`
2. **Políticas RLS**: `supabase-rls-policies.sql`  
3. **Funções auxiliares**: `supabase-functions.sql`

### 4. Configure autenticação

No painel do Supabase:
1. Vá em Authentication > Settings
2. Desabilite "Enable email confirmations" (para desenvolvimento)
3. Configure providers conforme necessário

### 5. Inicie o desenvolvimento

```bash
pnpm run dev
```

Acesse: http://localhost:5173

## 👤 Usuário Padrão

Após executar os scripts SQL, será criado automaticamente:

- **Email**: admin@admin.com
- **Senha**: 123
- **Nível**: Administrador

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes de UI (shadcn/ui)
│   ├── Login.jsx       # Tela de login
│   ├── Layout.jsx      # Layout principal
│   └── Dashboard.jsx   # Dashboard
├── contexts/           # Contextos React
│   └── AuthContext.jsx # Contexto de autenticação
├── lib/               # Utilitários
│   └── supabase.js    # Configuração Supabase
├── App.jsx            # Componente principal
└── main.jsx           # Ponto de entrada
```

## 🗄️ Estrutura do Banco

### Tabelas Principais

- **usuarios**: Funcionários e administradores
- **clientes**: Dados dos clientes
- **servicos**: Serviços oferecidos
- **produtos**: Produtos vendidos
- **agendamentos**: Agendamentos de serviços
- **receber/pagar**: Controle financeiro
- **config**: Configurações do sistema

### Funcionalidades do Banco

- **RLS (Row Level Security)**: Segurança a nível de linha
- **Triggers**: Atualização automática de timestamps
- **Funções**: Lógica de negócio no banco
- **Políticas**: Controle de acesso granular

## 🔐 Segurança

- Autenticação via Supabase Auth
- Políticas RLS para controle de acesso
- Validação de dados com Zod
- Proteção de rotas no frontend

## 🎨 Design System

- **Cores**: Paleta baseada em slate/gray
- **Tipografia**: Sistema consistente de tamanhos
- **Componentes**: shadcn/ui para consistência
- **Ícones**: Lucide React
- **Responsividade**: Mobile-first

## 📱 Responsividade

- **Mobile**: Layout otimizado para celulares
- **Tablet**: Interface adaptada para tablets  
- **Desktop**: Experiência completa para desktop
- **Sidebar**: Colapsível em telas menores

## 🚀 Deploy

### Desenvolvimento
```bash
pnpm run dev --host
```

### Produção
```bash
pnpm run build
pnpm run preview
```

### Deploy no Vercel/Netlify
1. Conecte o repositório
2. Configure as variáveis de ambiente
3. Deploy automático

## 📊 Funcionalidades Avançadas

### Sistema de Fidelidade
- Cartões de fidelidade para clientes
- Configuração de quantidade de cartões
- Serviços gratuitos ao completar cartões

### Sistema de Comissões
- Comissões por funcionário
- Cálculo automático (% ou valor fixo)
- Relatórios de comissões

### Controle de Estoque
- Alertas de estoque baixo
- Entrada e saída de produtos
- Relatórios de movimentação

### Agendamento Online
- Interface pública para agendamentos
- Verificação de disponibilidade
- Notificações automáticas

## 🔄 Migração do Sistema Original

Este sistema foi desenvolvido para ser 100% compatível com o sistema PHP original:

- **Estrutura de dados**: Mantida compatibilidade
- **Funcionalidades**: Todas as features originais
- **Fluxos**: Mesmos processos de negócio
- **Relatórios**: Mesmas informações e formatos

## 🐛 Troubleshooting

### Erro de conexão com Supabase
- Verifique as variáveis de ambiente
- Confirme se o projeto Supabase está ativo
- Verifique as políticas RLS

### Erro de autenticação
- Confirme se o usuário admin foi criado
- Verifique se a autenticação está habilitada
- Teste com email/senha corretos

### Problemas de layout
- Limpe o cache do navegador
- Verifique se o Tailwind CSS está carregando
- Confirme se os componentes UI estão instalados

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique a documentação
2. Consulte os logs do console
3. Verifique a configuração do Supabase
4. Teste com dados de exemplo

## 📄 Licença

Este projeto é uma reimplementação do sistema original de barbearia em tecnologias modernas.

---

**Desenvolvido com ❤️ usando React + Supabase**

