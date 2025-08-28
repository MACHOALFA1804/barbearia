#!/usr/bin/env python3
import os
from supabase import create_client, Client
import hashlib

# Configurações do Supabase
SUPABASE_URL = "https://uaxzaluudmjaructrlya.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVheHphbHV1ZG1qYXJ1Y3RybHlhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzU2MTcsImV4cCI6MjA3MTkxMTYxN30.nzRN-7VmZXuc0sT7dopcigccJ4-B0JpSJMOIZCtlQrI"

def create_admin_user():
    try:
        # Criar cliente Supabase
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        print("Conectado ao Supabase...")
        
        # Dados do usuário administrador
        email = "admin@barbearia.com"
        password = "123456"
        
        # Primeiro, tentar criar o usuário no Supabase Auth
        print("Criando usuário no Supabase Auth...")
        try:
            auth_response = supabase.auth.sign_up({
                "email": email,
                "password": password
            })
            print(f"Usuário criado no Auth: {auth_response}")
        except Exception as auth_error:
            print(f"Erro ao criar no Auth (pode já existir): {auth_error}")
        
        # Criar hash da senha (simples para demonstração)
        senha_hash = hashlib.md5(password.encode()).hexdigest()
        
        # Inserir na tabela usuarios
        print("Inserindo usuário na tabela usuarios...")
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
        print(f"❌ Erro ao criar usuário: {e}")
        return False

if __name__ == "__main__":
    create_admin_user()

