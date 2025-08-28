import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import './App.css'

// Componente para proteger rotas
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    )
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Componente principal da aplicação
function AppContent() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-800"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
        />
        
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Dashboard">
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Pessoas */}
        <Route 
          path="/usuarios" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Usuários">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Usuários</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/funcionarios" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Funcionários">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Funcionários</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/clientes" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Clientes">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Clientes</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/fornecedores" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Fornecedores">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Fornecedores</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Cadastros */}
        <Route 
          path="/servicos" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Serviços">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Serviços</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Produtos */}
        <Route 
          path="/produtos" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Produtos">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Produtos</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Financeiro */}
        <Route 
          path="/vendas" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Vendas">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Vendas</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rotas de Agendamentos */}
        <Route 
          path="/agendamentos" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Agendamentos">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Agendamentos</h2>
                  <p className="text-gray-600">Módulo em desenvolvimento</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rota padrão */}
        <Route 
          path="/" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
        
        {/* Rota 404 */}
        <Route 
          path="*" 
          element={
            <ProtectedRoute>
              <Layout currentPage="Página não encontrada">
                <div className="text-center py-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">404 - Página não encontrada</h2>
                  <p className="text-gray-600">A página que você está procurando não existe.</p>
                </div>
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App

