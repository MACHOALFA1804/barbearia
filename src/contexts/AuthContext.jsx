import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    // Verificar se há login local (para demonstração)
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    const storedUserData = localStorage.getItem('userData')
    
    if (isLoggedIn && storedUserData) {
      const parsedUserData = JSON.parse(storedUserData)
      setUser({ email: parsedUserData.email })
      setUserData(parsedUserData)
      setLoading(false)
      return
    }

    // Verificar sessão atual do Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserData(session.user.email)
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserData(session.user.email)
        } else {
          setUserData(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserData = async (email) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          cargo:cargos(nome)
        `)
        .eq('email', email)
        .eq('ativo', 'Sim')
        .single()

      if (error) throw error
      setUserData(data)
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      // Limpar dados locais
      localStorage.removeItem('isLoggedIn')
      localStorage.removeItem('userData')
      
      // Logout do Supabase
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setUserData(null)
      
      // Recarregar a página para voltar ao login
      window.location.reload()
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (error) throw error

      // Criar registro na tabela usuarios
      if (data.user) {
        const { error: userError } = await supabase
          .from('usuarios')
          .insert([{
            nome: userData.nome,
            email: email,
            cpf: userData.cpf,
            nivel: userData.nivel || 'Funcionário',
            cargo: userData.cargo,
            telefone: userData.telefone,
            endereco: userData.endereco,
            ativo: 'Sim'
          }])

        if (userError) throw userError
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const updateProfile = async (updates) => {
    try {
      if (!userData) throw new Error('Usuário não encontrado')

      const { error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', userData.id)

      if (error) throw error

      // Atualizar dados locais
      setUserData({ ...userData, ...updates })
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    userData,
    loading,
    signIn,
    signOut,
    signUp,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

