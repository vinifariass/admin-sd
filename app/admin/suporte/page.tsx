'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Bug, 
  Lightbulb, 
  FileText,
  ExternalLink,
  Github,
  Users,
  Zap,
  PlayCircle,
  ChevronRight,
  ChevronDown,
  User,
  Shield,
  MapPin,
  QrCode,
  Calendar,
  CreditCard,
  Home,
  Settings
} from "lucide-react";

// Metadata for the page
const metadata = {
    title: 'Suporte - Admin SD',
    description: 'Central de suporte e ajuda do sistema Admin SD',
};

export default function SuportePage() {
    const [expandedTutorial, setExpandedTutorial] = useState<string | null>(null);

    const toggleTutorial = (tutorialTitle: string) => {
        setExpandedTutorial(expandedTutorial === tutorialTitle ? null : tutorialTitle);
    };
    const faq = [
        {
            question: "Como redefinir minha senha?",
            answer: "Entre em contato com o administrador do sistema. Apenas ADMINs podem redefinir senhas de usuários.",
            category: "Conta"
        },
        {
            question: "Não consigo ver todos os módulos do sistema",
            answer: "Isso é normal. O acesso aos módulos depende do seu tipo de usuário (ADMIN, FUNCIONARIO, MORADOR). Verifique suas permissões com o administrador.",
            category: "Permissões"
        },
        {
            question: "Como funciona a Portaria Digital?",
            answer: "A Portaria Digital gera QR Codes únicos para controle de acesso. Cadastre o visitante, defina horário e apartamento, e o sistema criará um QR Code válido por 24h. O código pode ser usado na portaria para verificação.",
            category: "Portaria"
        },
        {
            question: "O QR Code não está funcionando na portaria",
            answer: "Verifique se o código ainda está válido (24h por padrão). Cada QR Code é único e pode expirar. Verifique também se foi gerado corretamente no sistema.",
            category: "Portaria"
        },
        {
            question: "Como reservar os espaços comuns?",
            answer: "Acesse 'Espaços Comuns', vá na aba 'Reservar', escolha o espaço (Churrasco Gourmet R$ 200 ou Salão de Festas R$ 150), defina data/horário e confirme. A reserva aguardará aprovação.",
            category: "Espaços"
        },
        {
            question: "Qual a diferença de preço entre os espaços?",
            answer: "Churrasco Gourmet custa R$ 200 por dia e Salão de Festas R$ 150 por dia. Os valores são fixos independente do horário de uso.",
            category: "Espaços"
        },
        {
            question: "Como associar um morador a um usuário?",
            answer: "No módulo 'Moradores', edite um morador existente e selecione um usuário no campo 'Usuário Associado'. Isso permite que o usuário veja dados específicos do apartamento.",
            category: "Moradores"
        },
        {
            question: "Os boletos não estão aparecendo para o morador",
            answer: "Verifique se o boleto foi associado ao apartamento correto e se o morador está vinculado ao usuário. Boletos podem ser visualizados na área '/boletos'.",
            category: "Boletos"
        },
        {
            question: "Como gerar relatórios?",
            answer: "Atualmente, os relatórios são gerados automaticamente no dashboard. Funcionalidades de exportação estão em desenvolvimento.",
            category: "Relatórios"
        },
        {
            question: "O sistema funciona no celular?",
            answer: "Sim! O sistema é totalmente responsivo e funciona perfeitamente em dispositivos móveis. Use o menu hambúrguer para navegar no mobile.",
            category: "Mobile"
        },
        {
            question: "Como alterar o tema do sistema?",
            answer: "Use o botão de alternância de tema (lua/sol) no canto superior direito da tela para alternar entre tema claro e escuro.",
            category: "Interface"
        },
        {
            question: "Posso excluir registros?",
            answer: "Apenas usuários ADMIN podem excluir registros. Outros tipos de usuário podem apenas visualizar e editar conforme suas permissões.",
            category: "Permissões"
        }
    ];

    const supportChannels = [
        {
            title: "Email Suporte",
            description: "Envie um email detalhando sua dúvida ou problema",
            icon: Mail,
            contact: "suporte@adminsd.com",
            responseTime: "24-48 horas",
            color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
        },
        {
            title: "WhatsApp",
            description: "Contato direto para suporte rápido",
            icon: MessageCircle,
            contact: "(11) 99147-9705",
            responseTime: "2-4 horas",
            color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
        },
        {
            title: "Telefone",
            description: "Suporte por telefone em horário comercial",
            icon: Phone,
            contact: "(11) 3333-4444",
            responseTime: "Imediato",
            color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
        }
    ];

    const issueTypes = [
        {
            type: "Bug/Erro",
            icon: Bug,
            description: "Problemas técnicos ou comportamentos inesperados",
            examples: ["Sistema não carrega", "Erro ao salvar dados", "QR Code não gera", "Reserva não confirma"],
            priority: "Alta",
            color: "text-red-600"
        },
        {
            type: "Dúvida",
            icon: HelpCircle,
            description: "Perguntas sobre como usar o sistema",
            examples: ["Como cadastrar morador", "Como usar Portaria Digital", "Como reservar espaços", "Onde encontrar relatórios"],
            priority: "Média",
            color: "text-blue-600"
        },
        {
            type: "Sugestão",
            icon: Lightbulb,
            description: "Ideias para melhorar o sistema",
            examples: ["Nova funcionalidade", "Melhoria na interface", "Novos espaços comuns", "Integração com outros sistemas"],
            priority: "Baixa",
            color: "text-yellow-600"
        },
        {
            type: "Treinamento",
            icon: Users,
            description: "Solicitação de treinamento ou capacitação",
            examples: ["Treinamento para novos usuários", "Workshop de funcionalidades", "Manual personalizado"],
            priority: "Média",
            color: "text-green-600"
        }
    ];

    const systemStatus = [
        {
            service: "Sistema Principal",
            status: "Operacional",
            icon: CheckCircle,
            color: "text-green-600",
            uptime: "99.9%"
        },
        {
            service: "Banco de Dados",
            status: "Operacional",
            icon: CheckCircle,
            color: "text-green-600",
            uptime: "99.8%"
        },
        {
            service: "Portaria Digital",
            status: "Operacional",
            icon: CheckCircle,
            color: "text-green-600",
            uptime: "99.7%"
        },
        {
            service: "Espaços Comuns",
            status: "Operacional",
            icon: CheckCircle,
            color: "text-green-600",
            uptime: "99.9%"
        },
        {
            service: "Notificações",
            status: "Operacional",
            icon: CheckCircle,
            color: "text-green-600",
            uptime: "99.5%"
        },
        {
            service: "Backup Automático",
            status: "Operacional",
            icon: CheckCircle,
            color: "text-green-600",
            uptime: "100%"
        }
    ];

    const tutorials = [
        {
            title: "Primeiros Passos",
            description: "Como começar a usar o sistema",
            duration: "5 min",
            level: "Iniciante",
            icon: Home,
            topics: ["Login no sistema", "Navegação básica", "Perfil do usuário"],
            steps: [
                {
                    title: "1. Fazendo Login",
                    content: "Acesse o sistema com suas credenciais. Se não tiver acesso, entre em contato com o administrador.",
                    details: [
                        "Digite seu email e senha na tela de login",
                        "Clique em 'Entrar' para acessar o sistema",
                        "Se esquecer a senha, entre em contato com o administrador"
                    ]
                },
                {
                    title: "2. Navegação Básica",
                    content: "Use o menu lateral para navegar entre os módulos. No mobile, use o botão hambúrguer.",
                    details: [
                        "Menu lateral esquerdo: principais funcionalidades",
                        "Topo direito: perfil do usuário e configurações",
                        "Botão de tema: alterne entre claro e escuro",
                        "No mobile: clique no ícone ☰ para abrir o menu"
                    ]
                },
                {
                    title: "3. Configurando seu Perfil",
                    content: "Acesse seu perfil para personalizar suas informações e preferências.",
                    details: [
                        "Clique no avatar no canto superior direito",
                        "Selecione 'Perfil' no menu dropdown",
                        "Atualize suas informações pessoais",
                        "Defina suas preferências de notificação"
                    ]
                }
            ]
        },
        {
            title: "Gestão de Moradores",
            description: "Cadastro e gerenciamento completo",
            duration: "10 min",
            level: "Intermediário",
            icon: Users,
            topics: ["Cadastrar moradores", "Associar usuários", "Histórico de locação"],
            steps: [
                {
                    title: "1. Cadastrando Moradores",
                    content: "Acesse 'Moradores' no menu lateral e clique em 'Adicionar Morador'.",
                    details: [
                        "Preencha nome, CPF e apartamento (obrigatórios)",
                        "Adicione email e telefone para contato",
                        "Defina se é Proprietário ou Inquilino",
                        "Informe data de locação se aplicável"
                    ]
                },
                {
                    title: "2. Associando Usuários",
                    content: "Vincule moradores a usuários do sistema para acesso personalizado.",
                    details: [
                        "Edite um morador existente",
                        "No campo 'Usuário Associado', selecione um usuário",
                        "O usuário poderá ver apenas dados do seu apartamento",
                        "Útil para que moradores vejam seus próprios boletos"
                    ]
                },
                {
                    title: "3. Histórico e Controle",
                    content: "Acompanhe mudanças e histórico de locação.",
                    details: [
                        "Use filtros para buscar moradores específicos",
                        "Visualize histórico de locação",
                        "Controle datas de entrada e saída",
                        "Exporte relatórios quando necessário"
                    ]
                }
            ]
        },
        {
            title: "Portaria Digital",
            description: "Controle de acesso com QR Code",
            duration: "8 min",
            level: "Intermediário",
            icon: Shield,
            topics: ["Criar acesso para visitantes", "Gerar QR Code", "Verificar códigos na portaria"],
            steps: [
                {
                    title: "1. Criando Acesso para Visitantes",
                    content: "Acesse 'Portaria Digital' e clique na aba 'Novo Acesso'.",
                    details: [
                        "Selecione o tipo: Visitante, Prestador de Serviço, Delivery, etc.",
                        "Preencha nome, CPF e telefone do visitante",
                        "Informe o apartamento de destino",
                        "Defina data e horário de visita"
                    ]
                },
                {
                    title: "2. Gerando QR Code",
                    content: "O sistema gera automaticamente um QR Code único para cada acesso.",
                    details: [
                        "Clique em 'Gerar Acesso' após preencher os dados",
                        "O QR Code aparecerá em um modal automaticamente",
                        "Código é válido por 24 horas por padrão",
                        "Cada código é único e não pode ser reutilizado"
                    ]
                },
                {
                    title: "3. Usando na Portaria",
                    content: "O porteiro pode verificar o código usando o sistema ou app mobile.",
                    details: [
                        "Acesse a aba 'Verificar QR' na portaria",
                        "Escaneie o QR Code ou digite o código manualmente",
                        "Sistema mostrará dados do visitante e validade",
                        "Registre a entrada quando autorizada"
                    ]
                }
            ]
        },
        {
            title: "Espaços Comuns",
            description: "Reserva de áreas comuns",
            duration: "12 min",
            level: "Intermediário",
            icon: MapPin,
            topics: ["Visualizar espaços disponíveis", "Fazer reservas", "Acompanhar aprovações"],
            steps: [
                {
                    title: "1. Conhecendo os Espaços",
                    content: "Acesse 'Espaços Comuns' para ver os espaços disponíveis.",
                    details: [
                        "Churrasco Gourmet: R$ 200/dia (20 pessoas)",
                        "Salão de Festas: R$ 150/dia (50 pessoas)",
                        "Veja equipamentos inclusos em cada espaço",
                        "Leia as regras e restrições de uso"
                    ]
                },
                {
                    title: "2. Fazendo uma Reserva",
                    content: "Clique na aba 'Reservar' para fazer sua reserva.",
                    details: [
                        "Selecione o espaço desejado",
                        "Escolha data e horário (mínimo 4h, máximo 12h)",
                        "Informe número de convidados",
                        "Adicione observações sobre o evento",
                        "Valor é fixo por dia, não por hora"
                    ]
                },
                {
                    title: "3. Acompanhando Aprovações",
                    content: "Use a aba 'Minhas Reservas' para acompanhar o status.",
                    details: [
                        "Status: Pendente, Aprovada, Rejeitada, Cancelada",
                        "Reservas precisam ser aprovadas pelo administrador",
                        "Você receberá notificações sobre mudanças de status",
                        "Pode cancelar reservas pendentes se necessário"
                    ]
                }
            ]
        },
        {
            title: "Controle Financeiro",
            description: "Boletos e gestão de gastos",
            duration: "15 min",
            level: "Intermediário",
            icon: CreditCard,
            topics: ["Gerar boletos", "Controlar pagamentos", "Relatórios financeiros"],
            steps: [
                {
                    title: "1. Gerando Boletos",
                    content: "Acesse 'Boletos' e clique em 'Novo Boleto'.",
                    details: [
                        "Preencha número do boleto e código de barras",
                        "Defina valor e data de vencimento",
                        "Associe a um apartamento específico",
                        "Opcionalmente, vincule a um morador"
                    ]
                },
                {
                    title: "2. Controlando Pagamentos",
                    content: "Acompanhe quais boletos foram pagos e quais estão pendentes.",
                    details: [
                        "Use filtros para ver boletos por status",
                        "Marque como 'Pago' quando receber o pagamento",
                        "Informe a data de pagamento",
                        "Adicione observações se necessário"
                    ]
                },
                {
                    title: "3. Relatórios Financeiros",
                    content: "Gere relatórios para análise financeira.",
                    details: [
                        "Acesse 'Relatórios' no menu principal",
                        "Selecione período e tipo de relatório",
                        "Exporte em PDF para análise externa",
                        "Acompanhe tendências de pagamento"
                    ]
                }
            ]
        },
        {
            title: "Administração Avançada",
            description: "Funcionalidades para administradores",
            duration: "20 min",
            level: "Avançado",
            icon: Settings,
            topics: ["Gestão de usuários", "Permissões", "Configurações do sistema"],
            steps: [
                {
                    title: "1. Gestão de Usuários",
                    content: "Apenas ADMINs podem criar e gerenciar usuários.",
                    details: [
                        "Acesse 'Usuários' no menu (só para ADMINs)",
                        "Crie usuários com email e senha",
                        "Defina o tipo: ADMIN, FUNCIONARIO, MORADOR",
                        "Ative/desative contas conforme necessário"
                    ]
                },
                {
                    title: "2. Configurando Permissões",
                    content: "Cada tipo de usuário tem acesso a diferentes funcionalidades.",
                    details: [
                        "ADMIN: acesso total a todas as funcionalidades",
                        "FUNCIONARIO: acesso limitado a operações básicas",
                        "MORADOR: acesso apenas a dados do próprio apartamento",
                        "Permissões são automáticas baseadas no tipo"
                    ]
                },
                {
                    title: "3. Configurações do Sistema",
                    content: "Ajuste configurações gerais do sistema.",
                    details: [
                        "Configure notificações automáticas",
                        "Defina regras de negócio específicas",
                        "Configure integrações (Telegram, etc.)",
                        "Monitore logs e atividades do sistema"
                    ]
                }
            ]
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-full">
                    <HelpCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Central de Suporte
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Encontre ajuda e suporte para o sistema Admin SD
                    </p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div>
                            <h3 className="font-semibold">Documentação</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Guia completo</p>
                        </div>
                    </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                        <div>
                            <h3 className="font-semibold">Chat Suporte</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Ajuda online</p>
                        </div>
                    </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <Github className="w-8 h-8 text-gray-600" />
                        <div>
                            <h3 className="font-semibold">Código Fonte</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">GitHub</p>
                        </div>
                    </div>
                </Card>
                
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center space-x-3">
                        <Zap className="w-8 h-8 text-yellow-600" />
                        <div>
                            <h3 className="font-semibold">Status</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Sistema</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* System Status */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Status do Sistema</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {systemStatus.map((service) => {
                            const Icon = service.icon;
                            return (
                                <div key={service.service} className="p-4 border rounded-lg">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Icon className={`w-5 h-5 ${service.color}`} />
                                        <span className="font-medium">{service.service}</span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Status: <span className={service.color}>{service.status}</span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Uptime: {service.uptime}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Support Channels */}
                <Card>
                    <CardHeader>
                        <CardTitle>Canais de Suporte</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {supportChannels.map((channel) => {
                                const Icon = channel.icon;
                                return (
                                    <div key={channel.title} className="p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <Icon className="w-6 h-6" />
                                            <h3 className="font-semibold">{channel.title}</h3>
                                            <Badge className={channel.color}>
                                                {channel.responseTime}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {channel.description}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-sm">{channel.contact}</span>
                                            <Button size="sm" variant="outline">
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                Contatar
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Issue Types */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tipos de Solicitação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {issueTypes.map((issue) => {
                                const Icon = issue.icon;
                                return (
                                    <div key={issue.type} className="p-4 border rounded-lg">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <Icon className={`w-5 h-5 ${issue.color}`} />
                                            <h3 className="font-semibold">{issue.type}</h3>
                                            <Badge variant="outline">
                                                Prioridade: {issue.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {issue.description}
                                        </p>
                                        <div className="text-xs text-gray-500">
                                            <strong>Exemplos:</strong> {issue.examples.join(", ")}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tutorials */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <PlayCircle className="w-5 h-5" />
                        <span>Tutoriais Interativos</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tutorials.map((tutorial) => {
                            const Icon = tutorial.icon;
                            const isExpanded = expandedTutorial === tutorial.title;
                            
                            return (
                                <div key={tutorial.title} className="border rounded-lg">
                                    <div 
                                        className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        onClick={() => toggleTutorial(tutorial.title)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Icon className="w-5 h-5 text-primary" />
                                                <div>
                                                    <h3 className="font-semibold">{tutorial.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {tutorial.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Badge variant="outline">{tutorial.duration}</Badge>
                                                <Badge className={
                                                    tutorial.level === 'Iniciante' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                                                    tutorial.level === 'Intermediário' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
                                                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                                }>
                                                    {tutorial.level}
                                                </Badge>
                                                {isExpanded ? (
                                                    <ChevronDown className="w-4 h-4" />
                                                ) : (
                                                    <ChevronRight className="w-4 h-4" />
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="mt-2 text-xs text-gray-500">
                                            <strong>Tópicos:</strong> {tutorial.topics.join(" • ")}
                                        </div>
                                    </div>
                                    
                                    {isExpanded && (
                                        <div className="border-t bg-gray-50 dark:bg-gray-800">
                                            <div className="p-4 space-y-6">
                                                {tutorial.steps.map((step, stepIndex) => (
                                                    <div key={stepIndex} className="space-y-3">
                                                        <h4 className="font-medium text-primary flex items-center space-x-2">
                                                            <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                                                {stepIndex + 1}
                                                            </span>
                                                            <span>{step.title}</span>
                                                        </h4>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400 ml-8">
                                                            {step.content}
                                                        </p>
                                                        <ul className="ml-8 space-y-1">
                                                            {step.details.map((detail, detailIndex) => (
                                                                <li key={detailIndex} className="text-sm text-gray-500 flex items-start space-x-2">
                                                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                                                    <span>{detail}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                                
                                                <div className="mt-6 pt-4 border-t">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-500">
                                                            Tutorial completo em {tutorial.duration}
                                                        </span>
                                                        <Button size="sm" variant="outline" onClick={() => toggleTutorial(tutorial.title)}>
                                                            Fechar Tutorial
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Perguntas Frequentes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {faq.map((item, index) => (
                            <details key={index} className="group border rounded-lg p-4">
                                <summary className="flex items-center justify-between cursor-pointer">
                                    <h3 className="font-medium">{item.question}</h3>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline">{item.category}</Badge>
                                        <HelpCircle className="w-4 h-4 group-open:rotate-180 transition-transform" />
                                    </div>
                                </summary>
                                <div className="mt-4 pt-4 border-t text-sm text-gray-600 dark:text-gray-400">
                                    {item.answer}
                                </div>
                            </details>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Contact Form Placeholder */}
            <Card className="mt-8">
                <CardHeader>
                    <CardTitle>Não encontrou o que procura?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-8">
                        <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Entre em contato conosco</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Nossa equipe está pronta para ajudá-lo com qualquer dúvida ou problema.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button>
                                <Mail className="w-4 h-4 mr-2" />
                                Enviar Email
                            </Button>
                            <Button variant="outline">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat Online
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
