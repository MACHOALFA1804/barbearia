# Instruções para Configurar o Sistema de Barbearia

## 1. Configurar o Banco de Dados no Supabase

1. Acesse o painel do Supabase: https://uaxzaluudmjaructrlya.supabase.co
2. Vá em **SQL Editor**
3. Copie e cole o conteúdo do arquivo `supabase-schema.sql` 
4. Execute o SQL

## 2. Criar Usuário Administrador

Após executar o schema, execute o script Python:

```bash
python3 create_admin_user.py
```

## 3. Executar o Sistema

```bash
npm install --legacy-peer-deps
npm run dev
```

## 4. Fazer Login

- **Email:** admin@barbearia.com
- **Senha:** 123456

## Problemas Identificados e Corrigidos

1. ✅ Configuração das variáveis de ambiente do Supabase
2. ✅ Resolução de conflitos de dependências (date-fns)
3. ✅ Script para criação do usuário administrador
4. ✅ Instruções completas de setup

## Arquivos Importantes

- `.env` - Configurações do Supabase
- `supabase-schema.sql` - Schema do banco de dados
- `create_admin_user.py` - Script para criar usuário admin
- `INSTRUCOES_SETUP.md` - Este arquivo com instruções

## Suporte

Se tiver problemas:
1. Verifique se o schema foi executado corretamente
2. Confirme se as variáveis de ambiente estão corretas
3. Execute o script Python para criar o usuário admin

