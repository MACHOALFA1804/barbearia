import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import { 
  Users, 
  Calendar, 
  DollarSign, 
  Package, 
  Scissors, 
  UserPlus, 
  CalendarPlus,
  ShoppingCart,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

export default function Dashboard() {
  const { signOut, userData } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    clientes: [],
    agendamentos: [],
    servicos: [],
    produtos: [],
    funcionarios: [],
    financeiro: {
      receber: [],
      pagar: []
    }
  })

  // Estados para formulários
  const [showForm, setShowForm] = useState(false)
  const [formType, setFormType] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      // Carregar dados das principais tabelas
      const [clientesRes, agendamentosRes, servicosRes, produtosRes, funcionariosRes, receberRes, pagarRes] = await Promise.all([
        supabase.from('clientes').select('*').order('created_at', { ascending: false }),
        supabase.from('agendamentos').select(`
          *,
          cliente:clientes(nome),
          funcionario:usuarios(nome),
          servico:servicos(nome, valor)
        `).order('data', { ascending: false }),
        supabase.from('servicos').select(`
          *,
          categoria:cat_servicos(nome)
        `).order('created_at', { ascending: false }),
        supabase.from('produtos').select(`
          *,
          categoria:cat_produtos(nome)
        `).order('created_at', { ascending: false }),
        supabase.from('usuarios').select(`
          *,
          cargo:cargos(nome)
        `).order('created_at', { ascending: false }),
        supabase.from('receber').select('*').order('data_venc', { ascending: false }),
        supabase.from('pagar').select('*').order('data_venc', { ascending: false })
      ])

      setData({
        clientes: clientesRes.data || [],
        agendamentos: agendamentosRes.data || [],
        servicos: servicosRes.data || [],
        produtos: produtosRes.data || [],
        funcionarios: funcionariosRes.data || [],
        financeiro: {
          receber: receberRes.data || [],
          pagar: pagarRes.data || []
        }
      })
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut()
  }

  const openForm = (type, item = null) => {
    setFormType(type)
    setEditingItem(item)
    setFormData(item || {})
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setFormType('')
    setEditingItem(null)
    setFormData({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let table = ''
      switch (formType) {
        case 'cliente':
          table = 'clientes'
          break
        case 'agendamento':
          table = 'agendamentos'
          break
        case 'servico':
          table = 'servicos'
          break
        case 'produto':
          table = 'produtos'
          break
        case 'funcionario':
          table = 'usuarios'
          break
        default:
          return
      }

      if (editingItem) {
        await supabase.from(table).update(formData).eq('id', editingItem.id)
      } else {
        await supabase.from(table).insert([formData])
      }

      await loadData()
      closeForm()
    } catch (error) {
      console.error('Erro ao salvar:', error)
    }
    setLoading(false)
  }

  const handleDelete = async (table, id) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      try {
        await supabase.from(table).delete().eq('id', id)
        await loadData()
      } catch (error) {
        console.error('Erro ao excluir:', error)
      }
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  // Estatísticas do dashboard
  const stats = {
    totalClientes: data.clientes.length,
    agendamentosHoje: data.agendamentos.filter(a => 
      new Date(a.data).toDateString() === new Date().toDateString()
    ).length,
    receitaMes: data.financeiro.receber
      .filter(r => r.pago === 'Sim' && new Date(r.data_pgto).getMonth() === new Date().getMonth())
      .reduce((sum, r) => sum + (r.valor || 0), 0),
    produtosBaixoEstoque: data.produtos.filter(p => p.estoque <= p.nivel_estoque).length
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Scissors className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Barbearia Studio</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Olá, {userData?.nome || 'Usuário'}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Navigation */}
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
            <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          </TabsList>

          {/* Dashboard Overview */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalClientes}</div>
                  <p className="text-xs text-muted-foreground">
                    Clientes cadastrados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.agendamentosHoje}</div>
                  <p className="text-xs text-muted-foreground">
                    Agendamentos para hoje
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.receitaMes)}</div>
                  <p className="text-xs text-muted-foreground">
                    Receita recebida este mês
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estoque Baixo</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.produtosBaixoEstoque}</div>
                  <p className="text-xs text-muted-foreground">
                    Produtos com estoque baixo
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Agendamentos de Hoje */}
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos de Hoje</CardTitle>
              </CardHeader>
              <CardContent>
                {data.agendamentos.filter(a => 
                  new Date(a.data).toDateString() === new Date().toDateString()
                ).length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Horário</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Serviço</TableHead>
                        <TableHead>Funcionário</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.agendamentos
                        .filter(a => new Date(a.data).toDateString() === new Date().toDateString())
                        .map((agendamento) => (
                          <TableRow key={agendamento.id}>
                            <TableCell>{agendamento.hora}</TableCell>
                            <TableCell>{agendamento.cliente?.nome}</TableCell>
                            <TableCell>{agendamento.servico?.nome}</TableCell>
                            <TableCell>{agendamento.funcionario?.nome}</TableCell>
                            <TableCell>
                              <Badge variant={
                                agendamento.status === 'Concluído' ? 'default' :
                                agendamento.status === 'Cancelado' ? 'destructive' : 'secondary'
                              }>
                                {agendamento.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 py-8">
                    Nenhum agendamento para hoje
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clientes */}
          <TabsContent value="clientes" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Clientes</h2>
              <Button onClick={() => openForm('cliente')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Data de Nascimento</TableHead>
                      <TableHead>Cartões</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.clientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell className="font-medium">{cliente.nome}</TableCell>
                        <TableCell>{cliente.telefone}</TableCell>
                        <TableCell>{cliente.data_nasc ? formatDate(cliente.data_nasc) : '-'}</TableCell>
                        <TableCell>{cliente.cartoes}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openForm('cliente', cliente)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('clientes', cliente.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agendamentos */}
          <TabsContent value="agendamentos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Agendamentos</h2>
              <Button onClick={() => openForm('agendamento')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Agendamento
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Serviço</TableHead>
                      <TableHead>Funcionário</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.agendamentos.map((agendamento) => (
                      <TableRow key={agendamento.id}>
                        <TableCell>{formatDate(agendamento.data)}</TableCell>
                        <TableCell>{agendamento.hora}</TableCell>
                        <TableCell>{agendamento.cliente?.nome}</TableCell>
                        <TableCell>{agendamento.servico?.nome}</TableCell>
                        <TableCell>{agendamento.funcionario?.nome}</TableCell>
                        <TableCell>
                          <Badge variant={
                            agendamento.status === 'Concluído' ? 'default' :
                            agendamento.status === 'Cancelado' ? 'destructive' : 'secondary'
                          }>
                            {agendamento.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openForm('agendamento', agendamento)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('agendamentos', agendamento.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Serviços */}
          <TabsContent value="servicos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Serviços</h2>
              <Button onClick={() => openForm('servico')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Serviço
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.servicos.map((servico) => (
                      <TableRow key={servico.id}>
                        <TableCell className="font-medium">{servico.nome}</TableCell>
                        <TableCell>{servico.categoria?.nome}</TableCell>
                        <TableCell>{formatCurrency(servico.valor)}</TableCell>
                        <TableCell>{formatCurrency(servico.comissao)}</TableCell>
                        <TableCell>
                          <Badge variant={servico.ativo === 'Sim' ? 'default' : 'secondary'}>
                            {servico.ativo === 'Sim' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openForm('servico', servico)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('servicos', servico.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Produtos */}
          <TabsContent value="produtos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Produtos</h2>
              <Button onClick={() => openForm('produto')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Valor Compra</TableHead>
                      <TableHead>Valor Venda</TableHead>
                      <TableHead>Estoque</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.produtos.map((produto) => (
                      <TableRow key={produto.id}>
                        <TableCell className="font-medium">{produto.nome}</TableCell>
                        <TableCell>{produto.categoria?.nome}</TableCell>
                        <TableCell>{formatCurrency(produto.valor_compra)}</TableCell>
                        <TableCell>{formatCurrency(produto.valor_venda)}</TableCell>
                        <TableCell>
                          <Badge variant={produto.estoque <= produto.nivel_estoque ? 'destructive' : 'default'}>
                            {produto.estoque}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {produto.estoque <= produto.nivel_estoque && (
                            <Badge variant="destructive">Estoque Baixo</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openForm('produto', produto)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('produtos', produto.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Funcionários */}
          <TabsContent value="funcionarios" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Funcionários</h2>
              <Button onClick={() => openForm('funcionario')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Funcionário
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.funcionarios.map((funcionario) => (
                      <TableRow key={funcionario.id}>
                        <TableCell className="font-medium">{funcionario.nome}</TableCell>
                        <TableCell>{funcionario.email}</TableCell>
                        <TableCell>{funcionario.cargo?.nome}</TableCell>
                        <TableCell>{funcionario.nivel}</TableCell>
                        <TableCell>{funcionario.telefone}</TableCell>
                        <TableCell>
                          <Badge variant={funcionario.ativo === 'Sim' ? 'default' : 'secondary'}>
                            {funcionario.ativo === 'Sim' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openForm('funcionario', funcionario)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete('usuarios', funcionario.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financeiro */}
          <TabsContent value="financeiro" className="space-y-6">
            <h2 className="text-2xl font-bold">Financeiro</h2>
            
            <Tabs defaultValue="receber" className="space-y-4">
              <TabsList>
                <TabsTrigger value="receber">Contas a Receber</TabsTrigger>
                <TabsTrigger value="pagar">Contas a Pagar</TabsTrigger>
                <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
              </TabsList>

              <TabsContent value="receber">
                <Card>
                  <CardHeader>
                    <CardTitle>Contas a Receber</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data Pagamento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.financeiro.receber.map((conta) => (
                          <TableRow key={conta.id}>
                            <TableCell>{conta.descricao}</TableCell>
                            <TableCell>{formatCurrency(conta.valor)}</TableCell>
                            <TableCell>{formatDate(conta.data_venc)}</TableCell>
                            <TableCell>
                              <Badge variant={conta.pago === 'Sim' ? 'default' : 'destructive'}>
                                {conta.pago === 'Sim' ? 'Pago' : 'Pendente'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {conta.data_pgto ? formatDate(conta.data_pgto) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pagar">
                <Card>
                  <CardHeader>
                    <CardTitle>Contas a Pagar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Descrição</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Data Pagamento</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.financeiro.pagar.map((conta) => (
                          <TableRow key={conta.id}>
                            <TableCell>{conta.descricao}</TableCell>
                            <TableCell>{formatCurrency(conta.valor)}</TableCell>
                            <TableCell>{formatDate(conta.data_venc)}</TableCell>
                            <TableCell>
                              <Badge variant={conta.pago === 'Sim' ? 'default' : 'destructive'}>
                                {conta.pago === 'Sim' ? 'Pago' : 'Pendente'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {conta.data_pgto ? formatDate(conta.data_pgto) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="relatorios">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Receita Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-green-600">
                        {formatCurrency(
                          data.financeiro.receber
                            .filter(r => r.pago === 'Sim')
                            .reduce((sum, r) => sum + (r.valor || 0), 0)
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Despesas Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-red-600">
                        {formatCurrency(
                          data.financeiro.pagar
                            .filter(p => p.pago === 'Sim')
                            .reduce((sum, p) => sum + (p.valor || 0), 0)
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Lucro</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {formatCurrency(
                          data.financeiro.receber
                            .filter(r => r.pago === 'Sim')
                            .reduce((sum, r) => sum + (r.valor || 0), 0) -
                          data.financeiro.pagar
                            .filter(p => p.pago === 'Sim')
                            .reduce((sum, p) => sum + (p.valor || 0), 0)
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingItem ? 'Editar' : 'Novo'} {formType}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {formType === 'cliente' && (
                <>
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={formData.nome || ''}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      value={formData.telefone || ''}
                      onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco || ''}
                      onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_nasc">Data de Nascimento</Label>
                    <Input
                      id="data_nasc"
                      type="date"
                      value={formData.data_nasc || ''}
                      onChange={(e) => setFormData({...formData, data_nasc: e.target.value})}
                    />
                  </div>
                </>
              )}

              {formType === 'servico' && (
                <>
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={formData.nome || ''}
                      onChange={(e) => setFormData({...formData, nome: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="valor">Valor</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={formData.valor || ''}
                      onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value)})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="comissao">Comissão</Label>
                    <Input
                      id="comissao"
                      type="number"
                      step="0.01"
                      value={formData.comissao || ''}
                      onChange={(e) => setFormData({...formData, comissao: parseFloat(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descricao">Descrição</Label>
                    <Input
                      id="descricao"
                      value={formData.descricao || ''}
                      onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={closeForm}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

