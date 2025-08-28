import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu'
import { 
  Menu, 
  X, 
  Home, 
  Users, 
  Calendar, 
  Package, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut,
  User,
  Scissors,
  ShoppingCart,
  FileText,
  Clock,
  Star
} from 'lucide-react'

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    path: '/dashboard',
    group: 'main'
  },
  {
    title: 'Pessoas',
    icon: Users,
    group: 'pessoas',
    children: [
      { title: 'Usuários', path: '/usuarios', icon: User },
      { title: 'Funcionários', path: '/funcionarios', icon: Users },
      { title: 'Clientes', path: '/clientes', icon: Users },
      { title: 'Fornecedores', path: '/fornecedores', icon: Users }
    ]
  },
  {
    title: 'Cadastros',
    icon: Settings,
    group: 'cadastros',
    children: [
      { title: 'Serviços', path: '/servicos', icon: Scissors },
      { title: 'Cargos', path: '/cargos', icon: User },
      { title: 'Categoria Serviços', path: '/cat-servicos', icon: Scissors },
      { title: 'Acessos', path: '/acessos', icon: Settings }
    ]
  },
  {
    title: 'Produtos',
    icon: Package,
    group: 'produtos',
    children: [
      { title: 'Produtos', path: '/produtos', icon: Package },
      { title: 'Categorias', path: '/cat-produtos', icon: Package },
      { title: 'Estoque Baixo', path: '/estoque', icon: Package },
      { title: 'Entradas', path: '/entradas', icon: Package },
      { title: 'Saídas', path: '/saidas', icon: Package }
    ]
  },
  {
    title: 'Financeiro',
    icon: DollarSign,
    group: 'financeiro',
    children: [
      { title: 'Vendas', path: '/vendas', icon: ShoppingCart },
      { title: 'Compras', path: '/compras', icon: ShoppingCart },
      { title: 'Contas à Pagar', path: '/pagar', icon: DollarSign },
      { title: 'Contas à Receber', path: '/receber', icon: DollarSign }
    ]
  },
  {
    title: 'Agendamentos',
    icon: Calendar,
    group: 'agendamentos',
    children: [
      { title: 'Agendamentos', path: '/agendamentos', icon: Calendar },
      { title: 'Serviços Agenda', path: '/servicos-agenda', icon: Clock }
    ]
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    group: 'relatorios',
    children: [
      { title: 'Produtos', path: '/rel-produtos', icon: Package },
      { title: 'Entradas', path: '/rel-entradas', icon: Package },
      { title: 'Saídas', path: '/rel-saidas', icon: Package },
      { title: 'Comissões', path: '/rel-comissoes', icon: DollarSign },
      { title: 'Contas', path: '/rel-contas', icon: DollarSign },
      { title: 'Aniversariantes', path: '/rel-aniv', icon: Star },
      { title: 'Lucro', path: '/rel-lucro', icon: BarChart3 }
    ]
  },
  {
    title: 'Site',
    icon: FileText,
    group: 'site',
    children: [
      { title: 'Textos Banner', path: '/textos-index', icon: FileText },
      { title: 'Comentários', path: '/comentarios', icon: Star }
    ]
  }
]

export default function Layout({ children, currentPage = 'Dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState({})
  const { userData, signOut } = useAuth()

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }))
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-800 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        
        {/* Logo */}
        <div className="flex items-center justify-center h-16 bg-slate-900">
          <img 
            src="/logo.png" 
            alt="Logo" 
            className="h-10 w-auto"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <span 
            className="hidden text-white font-bold text-lg ml-2"
            style={{ display: 'none' }}
          >
            Barbearia
          </span>
        </div>

        {/* Menu */}
        <nav className="mt-5 px-2 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleGroup(item.group)}
                    className="w-full flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-slate-700 hover:text-white group"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                    <svg
                      className={`ml-auto h-4 w-4 transform transition-transform ${
                        expandedGroups[item.group] ? 'rotate-90' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  {expandedGroups[item.group] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <a
                          key={child.title}
                          href={child.path}
                          className="flex items-center px-2 py-2 text-sm text-gray-400 rounded-md hover:bg-slate-700 hover:text-white"
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          {child.title}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href={item.path}
                  className="flex items-center px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-slate-700 hover:text-white group"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </a>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900">
                {currentPage}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userData?.foto !== 'sem-foto.jpg' ? userData?.foto : undefined} />
                      <AvatarFallback>
                        {userData?.nome?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium leading-none">{userData?.nome}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData?.cargo?.nome} - {userData?.nivel}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

