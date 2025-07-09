import { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Users, 
  Car, 
  Package, 
  CreditCard, 
  Calendar, 
  DollarSign, 
  Wrench, 
  UserCheck, 
  Building,
  Settings,
  Home,
  Bell,
  User,
  Shield,
  Eye,
  Edit,
  Plus,
  Trash2,
  Filter,
  Search,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  QrCode,
  MapPin,
  ChefHat,
  Music
} from "lucide-react";

export const metadata: Metadata = {
    title: 'Como Usar o Sistema - Admin SD',
    description: 'Documentação completa de como usar o sistema de gestão de condomínio',
};

export default function DocumentacaoPage() {
    const modules = [
        {
            title: "Dashboard",
            icon: Home,
            route: "/admin/overview",
            description: "Visão geral do condomínio",
            features: ["Estatísticas gerais", "Gráficos de ocupação", "Resumo de atividades", "Métricas importantes"],
            howTo: [
                "Acesse o dashboard através do menu lateral",
                "Visualize as estatísticas principais no topo",
                "Analise os gráficos de tendências",
                "Verifique os últimos registros na lista de atividades"
            ]
        },
        {
            title: "Moradores",
            icon: Users,
            route: "/admin/moradores",
            description: "Gestão completa dos moradores",
            features: ["Cadastro de moradores", "Histórico de locação", "Associação com usuários", "Controle de apartamentos"],
            howTo: [
                "Clique em 'Novo Morador' para cadastrar",
                "Preencha nome, CPF e apartamento (obrigatórios)",
                "Associe um usuário do sistema (opcional)",
                "Defina datas de locação e saída se necessário",
                "Use os filtros para encontrar moradores específicos"
            ]
        },
        {
            title: "Estacionamento",
            icon: Car,
            route: "/admin/parkings",
            description: "Controle de vagas e veículos",
            features: ["Cadastro de veículos", "Tipos: carro/moto", "Vinculação com moradores", "Controle de vagas"],
            howTo: [
                "Registre novos veículos com placa, modelo e cor",
                "Escolha o tipo (carro ou moto)",
                "Vincule ao morador responsável",
                "Defina se é proprietário ou inquilino",
                "Monitore a ocupação das vagas"
            ]
        },
        {
            title: "Visitantes",
            icon: UserCheck,
            route: "/admin/visitantes",
            description: "Controle de acesso e visitantes",
            features: ["Agendamento de visitas", "Autorização de acesso", "Status de visita", "Histórico completo"],
            howTo: [
                "Agende visitas com nome, CPF e apartamento",
                "Defina data, horário e observações",
                "Autorize ou negue o acesso",
                "Acompanhe o status: Agendado → Autorizado → Chegou → Saiu",
                "Use filtros por data, status ou apartamento"
            ]
        },
        {
            title: "Encomendas",
            icon: Package,
            route: "/admin/encomendas",
            description: "Gestão de entregas",
            features: ["Registro de encomendas", "Controle de entrega", "Assinatura digital", "Histórico de entregas"],
            howTo: [
                "Registre encomendas com número do pedido",
                "Vincule ao morador destinatário",
                "Marque como entregue quando retirado",
                "Registre quem assinou o recebimento",
                "Controle devoluções se necessário"
            ]
        },
        {
            title: "Boletos",
            icon: CreditCard,
            route: "/admin/boletos",
            description: "Gestão financeira de cobrança",
            features: ["Geração de boletos", "Código de barras", "Controle de pagamentos", "Vencimentos"],
            howTo: [
                "Gere boletos com número e código de barras",
                "Defina valor e data de vencimento",
                "Associe a apartamentos específicos (opcional: morador)",
                "Monitore pagamentos e pendências",
                "Marque como pago quando recebido"
            ]
        },
        {
            title: "Agendamentos",
            icon: Calendar,
            route: "/admin/agendamentos",
            description: "Agendamento de serviços",
            features: ["Agendamento de horários", "Tipos de serviço", "Confirmação de agendamentos", "Controle de status"],
            howTo: [
                "Crie agendamentos com nome e apartamento",
                "Defina horário e tipo de serviço",
                "Escolha status: Confirmado ou Pendente",
                "Adicione descrição detalhada",
                "Gerencie agenda de serviços"
            ]
        },
        {
            title: "Funcionários",
            icon: Building,
            route: "/admin/funcionarios",
            description: "Gestão de recursos humanos",
            features: ["Cadastro de funcionários", "Controle salarial", "Departamentos", "Admissão/demissão"],
            howTo: [
                "Cadastre funcionários com dados pessoais",
                "Defina cargo, salário e departamento",
                "Registre data de admissão",
                "Controle status: Ativo, Inativo, Afastado",
                "Gerencie informações de RH completas"
            ]
        },
        {
            title: "Gastos",
            icon: DollarSign,
            route: "/admin/gastos",
            description: "Controle financeiro",
            features: ["Registro de despesas", "Categorização", "Relatórios", "Controle mensal"],
            howTo: [
                "Registre gastos com descrição e valor",
                "Defina a data da despesa",
                "Categorize os gastos por tipo",
                "Acompanhe relatórios mensais",
                "Analise tendências de gastos"
            ]
        },
        {
            title: "Serviços",
            icon: Wrench,
            route: "/admin/servicos",
            description: "Gestão de serviços",
            features: ["Cadastro de serviços", "Vencimentos", "Notificações", "Integração Telegram"],
            howTo: [
                "Cadastre serviços com nome e vencimento",
                "Configure notificações automáticas",
                "Integre com Telegram para alertas",
                "Monitore vencimentos próximos",
                "Renove serviços periodicamente"
            ]
        },
        {
            title: "Portaria Digital",
            icon: Shield,
            route: "/admin/portaria",
            description: "Controle de acesso com QR Code",
            features: ["Geração de QR Code", "Controle de visitantes", "Tipos de acesso", "Códigos temporários", "Verificação de entrada"],
            howTo: [
                "Selecione o tipo de acesso (Visitante, Prestador, Delivery, etc.)",
                "Preencha os dados do visitante (nome, CPF, telefone)",
                "Defina apartamento de destino e horário",
                "Configure data e hora de validade",
                "Gere o QR Code automaticamente",
                "Visualize e copie o código de acesso",
                "Use o QR Code para liberação na portaria"
            ]
        },
        {
            title: "Espaços Comuns",
            icon: MapPin,
            route: "/admin/espacos",
            description: "Agendamento de áreas comuns",
            features: ["Churrasco Gourmet (R$ 200/dia)", "Salão de Festas (R$ 150/dia)", "Controle de reservas", "Equipamentos inclusos", "Gestão de eventos"],
            howTo: [
                "Visualize os espaços disponíveis na primeira aba",
                "Verifique equipamentos e regras de cada espaço",
                "Na aba 'Reservar', selecione o espaço desejado",
                "Escolha data e horário de uso",
                "Informe número de convidados e telefone",
                "Adicione observações sobre o evento",
                "Confirme a reserva (valor fixo por dia)",
                "Acompanhe status na aba 'Minhas Reservas'"
            ]
        },
        {
            title: "Usuários",
            icon: Settings,
            route: "/admin/users",
            description: "Gestão de usuários do sistema",
            features: ["Criação de usuários", "Permissões", "Tipos de acesso", "Ativação/desativação"],
            howTo: [
                "Crie usuários com email e senha",
                "Defina tipo: ADMIN, FUNCIONARIO, MORADOR",
                "Configure permissões específicas",
                "Ative ou desative contas conforme necessário",
                "Monitore acessos e atividades"
            ]
        }
    ];

    const userTypes = [
        {
            type: "ADMIN",
            icon: Shield,
            color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
            description: "Acesso completo ao sistema",
            permissions: [
                "Todos os módulos administrativos",
                "Criação e edição de usuários",
                "Relatórios e estatísticas",
                "Configurações do sistema",
                "Gestão de permissões"
            ]
        },
        {
            type: "FUNCIONARIO",
            icon: User,
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
            description: "Acesso a módulos específicos",
            permissions: [
                "Agendamentos e visitantes",
                "Encomendas e boletos",
                "Consulta de moradores",
                "Estacionamento",
                "Sem acesso a configurações"
            ]
        },
        {
            type: "MORADOR",
            icon: Home,
            color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
            description: "Área pessoal do morador",
            permissions: [
                "Perfil pessoal",
                "Consulta de boletos",
                "Notificações",
                "Configurações da conta",
                "Histórico pessoal"
            ]
        }
    ];

    const commonActions = [
        { icon: Plus, label: "Criar", description: "Adicionar novos registros" },
        { icon: Edit, label: "Editar", description: "Modificar registros existentes" },
        { icon: Eye, label: "Visualizar", description: "Ver detalhes dos registros" },
        { icon: Trash2, label: "Excluir", description: "Remover registros (apenas ADMIN)" },
        { icon: Filter, label: "Filtrar", description: "Buscar registros específicos" },
        { icon: Search, label: "Pesquisar", description: "Busca por texto" },
        { icon: Download, label: "Exportar", description: "Baixar relatórios" },
        { icon: Upload, label: "Importar", description: "Carregar dados em lote" }
    ];

    const statusTypes = [
        { icon: CheckCircle, label: "Ativo/Concluído", color: "text-green-600", description: "Status positivo" },
        { icon: Clock, label: "Pendente", color: "text-yellow-600", description: "Aguardando ação" },
        { icon: XCircle, label: "Cancelado/Inativo", color: "text-red-600", description: "Status negativo" },
        { icon: AlertTriangle, label: "Atenção", color: "text-orange-600", description: "Requer atenção" },
        { icon: Info, label: "Informação", color: "text-blue-600", description: "Status informativo" }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-full">
                    <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Como Usar o Sistema
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Guia completo para utilizar todas as funcionalidades do Admin SD
                    </p>
                </div>
            </div>

            {/* Quick Navigation */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Navegação Rápida</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {modules.slice(0, 6).map((module) => {
                            const Icon = module.icon;
                            return (
                                <a
                                    key={module.title}
                                    href={`#${module.title.toLowerCase()}`}
                                    className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <Icon className="w-8 h-8 text-primary mb-2" />
                                    <span className="text-sm font-medium text-center">{module.title}</span>
                                </a>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* User Types */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Tipos de Usuário</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {userTypes.map((user) => {
                            const Icon = user.icon;
                            return (
                                <div key={user.type} className="p-4 border rounded-lg">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <Icon className="w-6 h-6" />
                                        <Badge className={user.color}>{user.type}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        {user.description}
                                    </p>
                                    <div className="space-y-2">
                                        <h4 className="font-medium text-sm">Permissões:</h4>
                                        <ul className="space-y-1">
                                            {user.permissions.map((permission, index) => (
                                                <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                                                    <CheckCircle className="w-3 h-3 text-green-600" />
                                                    <span>{permission}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Common Actions */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Ações Comuns</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {commonActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <div key={action.label} className="flex items-center space-x-3 p-3 border rounded-lg">
                                    <Icon className="w-5 h-5 text-primary" />
                                    <div>
                                        <div className="font-medium text-sm">{action.label}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{action.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Status Guide */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Guia de Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {statusTypes.map((status) => {
                            const Icon = status.icon;
                            return (
                                <div key={status.label} className="flex items-center space-x-2 p-3 border rounded-lg">
                                    <Icon className={`w-5 h-5 ${status.color}`} />
                                    <div>
                                        <div className="font-medium text-sm">{status.label}</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">{status.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Modules Documentation */}
            <div className="space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Módulos do Sistema</h2>
                
                {modules.map((module) => {
                    const Icon = module.icon;
                    return (
                        <Card key={module.title} id={module.title.toLowerCase()}>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-3">
                                    <Icon className="w-6 h-6 text-primary" />
                                    <span>{module.title}</span>
                                    <Badge variant="outline">{module.route}</Badge>
                                </CardTitle>
                                <p className="text-gray-600 dark:text-gray-400">{module.description}</p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Features */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center space-x-2">
                                            <Info className="w-4 h-4" />
                                            <span>Funcionalidades</span>
                                        </h4>
                                        <ul className="space-y-2">
                                            {module.features.map((feature, index) => (
                                                <li key={index} className="flex items-center space-x-2 text-sm">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* How To */}
                                    <div>
                                        <h4 className="font-semibold mb-3 flex items-center space-x-2">
                                            <BookOpen className="w-4 h-4" />
                                            <span>Como Usar</span>
                                        </h4>
                                        <ol className="space-y-2">
                                            {module.howTo.map((step, index) => (
                                                <li key={index} className="flex space-x-3 text-sm">
                                                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <span>{step}</span>
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Tips */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span>Dicas Importantes</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">🔍 Busca e Filtros</h4>
                            <p className="text-sm text-blue-800 dark:text-blue-400">
                                Use os filtros nas listagens para encontrar registros específicos. A busca funciona em tempo real e pode ser combinada com filtros.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">💾 Salvamento Automático</h4>
                            <p className="text-sm text-green-800 dark:text-green-400">
                                Todos os formulários têm validação em tempo real. Dados são salvos automaticamente quando válidos.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <h4 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">🔐 Permissões</h4>
                            <p className="text-sm text-orange-800 dark:text-orange-400">
                                Nem todas as funcionalidades estão disponíveis para todos os tipos de usuário. Verifique suas permissões.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                            <h4 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">📱 Mobile</h4>
                            <p className="text-sm text-purple-800 dark:text-purple-400">
                                O sistema é responsivo e funciona perfeitamente em dispositivos móveis. Use a navegação hambúrguer no mobile.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">🏠 Portaria Digital</h4>
                            <p className="text-sm text-indigo-800 dark:text-indigo-400">
                                QR Codes gerados têm validade de 24h por padrão. Cada código é único e pode ser usado para verificação na portaria.
                            </p>
                        </div>
                        
                        <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
                            <h4 className="font-semibold text-teal-900 dark:text-teal-300 mb-2">🎉 Espaços Comuns</h4>
                            <p className="text-sm text-teal-800 dark:text-teal-400">
                                Valores são fixos por dia: Churrasco Gourmet R$ 200 e Salão de Festas R$ 150. Reservas precisam de aprovação.
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
