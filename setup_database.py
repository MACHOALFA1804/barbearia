#!/usr/bin/env python3
import os
from supabase import create_client, Client
import hashlib

# Configurações do Supabase
SUPABASE_URL = "https://uaxzaluudmjaructrlya.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVheHphbHV1ZG1qYXJ1Y3RybHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzU2MTcsImV4cCI6MjA3MTkxMTYxN30.nzRN-7VmZXuc0sT7dopcigccJ4-B0JpSJMOIZCtlQrI"

def setup_database():
    try:
        # Criar cliente Supabase
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("Conectado ao Supabase...")
        
        # Ler o arquivo SQL do schema
        with open('supabase-schema.sql', 'r', encoding='utf-8') as file:
            schema_sql = file.read()
        
        print("Executando schema do banco de dados...")
        
        # Executar o SQL via RPC (se disponível) ou tentar via query
        try:
            # Tentar executar via query direta
            result = supabase.rpc('exec_sql', {'sql': schema_sql}).execute()
            print(f"Schema executado via RPC: {result}")
        except Exception as rpc_error:
            print(f"RPC não disponível: {rpc_error}")
            print("Você precisará executar o schema manualmente no painel do Supabase.")
            print("Acesse: https://uaxzaluudmjaructrlya.supabase.co")
            print("Vá em SQL Editor e execute o conteúdo do arquivo supabase-schema.sql")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao configurar banco: {e}")
        return False

def create_admin_user_in_table():
    try:
        # Criar cliente Supabase
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("Criando usuário administrador na tabela...")
        
        # Dados do usuário administrador
        email = "admin@barbearia.com"
        password = "123456"
        
        # Criar hash da senha (simples para demonstração)
        senha_hash = hashlib.md5(password.encode()).hexdigest()
        
        # Inserir na tabela usuarios
        user_data = {
            "nome": "Administrador",
            "email": email,
            "cpf": "000.000.000-00",
            "senha": senha_hash,
            "nivel": "Administrador", 
            "cargo": 1,  # ID do cargo Administrador
            "telefone": "(31) 99999-9999",
            "endereco": "Endereço do Admin",
            "ativo": "Sim"
        }
        
        # Verificar se usuário já existe
        existing_user = supabase.table('usuarios').select("*").eq('email', email).execute()
        
        if existing_user.data:
            print("Usuário já existe na tabela usuarios. Atualizando...")
            result = supabase.table('usuarios').update(user_data).eq('email', email).execute()
        else:
            print("Criando novo usuário na tabela usuarios...")
            result = supabase.table('usuarios').insert(user_data).execute()
        
        print(f"Resultado da operação: {result}")
        print("✅ Usuário administrador criado com sucesso!")
        print(f"Email: {email}")
        print(f"Senha: {password}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro ao criar usuário na tabela: {e}")
        return False

if __name__ == "__main__":
    print("=== Configuração do Sistema de Barbearia ===")
    print("1. Configurando banco de dados...")
    
    if setup_database():
        print("2. Criando usuário administrador...")
        create_admin_user_in_table()
    else:
        print("⚠️  Execute o schema manualmente e depois rode novamente este script.")

