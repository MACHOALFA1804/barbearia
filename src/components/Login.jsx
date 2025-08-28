import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showRecovery, setShowRecovery] = useState(false)
  const [recoveryEmail, setRecoveryEmail] = useState('')
  const [recoveryMessage, setRecoveryMessage] = useState('')

  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Para demonstração, vamos permitir login com credenciais específicas
    if (email === 'admin@barbearia.com' && password === '123456') {
      // Simular login bem-sucedido
      localStorage.setItem('isLoggedIn', 'true')
      localStorage.setItem('userData', JSON.stringify({
        id: 1,
        nome: 'Administrador',
        email: 'admin@barbearia.com',
        nivel: 'Administrador'
      }))
      window.location.reload()
    } else {
      // Tentar login real com Supabase
      const { data, error } = await signIn(email, password)
      
      if (error) {
        setError('Email ou senha incorretos. Para demonstração, use: admin@barbearia.com / 123456')
      }
    }
    
    setLoading(false)
  }

  const handleRecovery = async (e) => {
    e.preventDefault()
    setRecoveryMessage('')
    
    try {
      // Implementar recuperação de senha via Supabase
      setRecoveryMessage('Se o email existir, você receberá instruções para redefinir sua senha.')
    } catch (error) {
      setRecoveryMessage('Erro ao enviar email de recuperação')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4">
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-20 w-auto mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'block'
                }}
              />
              <div 
                className="hidden text-3xl font-bold text-slate-800"
                style={{ display: 'none' }}
              >
                Barbearia Studio
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {!showRecovery ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="E-mail ou CPF"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                
                <div className="space-y-2 relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-base pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Credenciais de demonstração */}
                <Alert>
                  <AlertDescription>
                    <strong>Para demonstração:</strong><br />
                    Email: admin@barbearia.com<br />
                    Senha: 123456
                  </AlertDescription>
                </Alert>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base bg-slate-800 hover:bg-slate-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowRecovery(true)}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Recuperar Senha
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">
                    Recuperar Senha
                  </h3>
                </div>
                
                <form onSubmit={handleRecovery} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Digite seu Email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                  />

                  {recoveryMessage && (
                    <Alert>
                      <AlertDescription>{recoveryMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                    >
                      Recuperar
                    </Button>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowRecovery(false)
                        setRecoveryMessage('')
                        setRecoveryEmail('')
                      }}
                      className="h-12"
                    >
                      Voltar
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

