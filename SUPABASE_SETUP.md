# Configuração do Supabase - Passo a Passo

## 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta
3. Clique em "New Project"
4. Escolha sua organização
5. Preencha:
   - **Name**: Sistema Barbearia
   - **Database Password**: Crie uma senha forte
   - **Region**: Escolha a região mais próxima
6. Clique em "Create new project"
7. Aguarde a criação (pode levar alguns minutos)

## 2. Obter Credenciais

1. No painel do projeto, vá em **Settings** > **API**
2. Copie:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 3. Configurar Variáveis de Ambiente

1. No projeto React, renomeie `.env.example` para `.env`
2. Substitua os valores:

```env
VITE_SUPABASE_URL=https://seu-projeto-id.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

## 4. Executar Scripts SQL

### 4.1 Estrutura do Banco

1. No painel Supabase, vá em **SQL Editor**
2. Clique em "New query"
3. Copie todo o conteúdo de `supabase-schema.sql`
4. Cole no editor e clique em "Run"
5. Aguarde a execução (pode levar alguns segundos)

### 4.2 Políticas de Segurança

1. Crie uma nova query
2. Copie todo o conteúdo de `supabase-rls-policies.sql`
3. Cole no editor e clique em "Run"
4. Aguarde a execução

### 4.3 Funções Auxiliares

1. Crie uma nova query
2. Copie todo o conteúdo de `supabase-functions.sql`
3. Cole no editor e clique em "Run"
4. Aguarde a execução

## 5. Configurar Autenticação

### 5.1 Configurações Básicas

1. Vá em **Authentication** > **Settings**
2. Em **General settings**:
   - **Site URL**: `http://localhost:5173` (desenvolvimento)
   - **Redirect URLs**: `http://localhost:5173/**`

### 5.2 Configurações de Email (Desenvolvimento)

Para facilitar o desenvolvimento, desabilite a confirmação de email:

1. Em **Authentication** > **Settings**
2. Desmarque **"Enable email confirmations"**
3. Clique em "Save"

### 5.3 Configurações de Email (Produção)

Para produção, configure um provedor de email:

1. Em **Authentication** > **Settings** > **SMTP Settings**
2. Configure seu provedor (Gmail, SendGrid, etc.)
3. Habilite **"Enable email confirmations"**

## 6. Verificar Instalação

### 6.1 Verificar Tabelas

1. Vá em **Table Editor**
2. Verifique se as seguintes tabelas foram criadas:
   - config
   - usuarios
   - clientes
   - servicos
   - produtos
   - agendamentos
   - receber
   - pagar
   - (e outras...)

### 6.2 Verificar Usuário Admin

1. Vá em **Table Editor** > **usuarios**
2. Deve existir um usuário com:
   - **email**: admin@admin.com
   - **nivel**: Administrador
   - **ativo**: Sim

### 6.3 Verificar Dados Iniciais

1. Verifique se existem dados em:
   - **config**: Configurações básicas
   - **cargos**: Cargos padrão
   - **acessos**: Módulos do sistema
   - **cat_servicos**: Categorias de serviços
   - **cat_produtos**: Categorias de produtos

## 7. Testar Conexão

1. Inicie o projeto React: `pnpm run dev`
2. Acesse `http://localhost:5173`
3. Tente fazer login com:
   - **Email**: admin@admin.com
   - **Senha**: 123

Se o login funcionar, a configuração está correta!

## 8. Configurações Avançadas

### 8.1 Storage (Para Upload de Imagens)

1. Vá em **Storage**
2. Crie um bucket chamado "uploads"
3. Configure as políticas de acesso conforme necessário

### 8.2 Edge Functions (Opcional)

Para funcionalidades avançadas como envio de emails:

1. Vá em **Edge Functions**
2. Crie funções conforme necessário
3. Configure as variáveis de ambiente

### 8.3 Webhooks (Opcional)

Para integrações externas:

1. Vá em **Database** > **Webhooks**
2. Configure webhooks para eventos específicos

## 9. Monitoramento

### 9.1 Logs

1. Vá em **Logs** para monitorar:
   - Auth logs
   - Database logs
   - API logs

### 9.2 Métricas

1. Vá em **Reports** para ver:
   - Uso da API
   - Uso do banco
   - Usuários ativos

## 10. Backup e Segurança

### 10.1 Backup Automático

O Supabase faz backup automático, mas você pode:

1. Vá em **Settings** > **Database**
2. Configure backups adicionais se necessário

### 10.2 Segurança

1. **RLS**: Já configurado pelos scripts
2. **API Keys**: Mantenha as chaves seguras
3. **HTTPS**: Sempre use HTTPS em produção

## 11. Troubleshooting

### Erro: "relation does not exist"
- Execute novamente o script `supabase-schema.sql`
- Verifique se todas as tabelas foram criadas

### Erro: "permission denied"
- Execute o script `supabase-rls-policies.sql`
- Verifique se as políticas RLS estão ativas

### Erro: "function does not exist"
- Execute o script `supabase-functions.sql`
- Verifique se as funções foram criadas

### Login não funciona
- Verifique se o usuário admin foi criado
- Confirme as credenciais (admin@admin.com / 123)
- Verifique se a autenticação está habilitada

### Erro de CORS
- Verifique a configuração de Site URL
- Adicione a URL do frontend nas Redirect URLs

## 12. Próximos Passos

Após a configuração:

1. **Teste o sistema**: Faça login e navegue pelas telas
2. **Customize**: Ajuste configurações conforme sua necessidade
3. **Desenvolva**: Implemente funcionalidades adicionais
4. **Deploy**: Configure para produção quando pronto

---

**Dica**: Mantenha as credenciais do Supabase seguras e nunca as compartilhe publicamente!

