'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminChatbot from "@/components/admin/admin-chatbot";
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

interface SuporteClientProps {
  userRole?: string;
}

export function SuporteClient({ userRole }: SuporteClientProps) {
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
    ];

    const tutorials = [
        {
            title: "Como cadastrar um novo morador",
            icon: User,
            steps: [
                "Acesse Admin > Moradores",
                "Clique em 'Cadastrar Morador'",
                "Preencha os dados pessoais",
                "Selecione o apartamento",
                "Defina tipo (Proprietário/Inquilino)",
                "Clique em 'Salvar'"
            ],
            video: "/videos/cadastrar-morador.mp4",
            duration: "3:45"
        },
        {
            title: "Configurar Portaria Digital",
            icon: Shield,
            steps: [
                "Acesse Admin > Portaria",
                "Clique em 'Cadastrar Visitante'",
                "Preencha dados do visitante",
                "Defina horário de acesso",
                "Sistema gera QR Code automaticamente",
                "Visitante apresenta código na portaria"
            ],
            video: "/videos/portaria-digital.mp4",
            duration: "4:20"
        },
        {
            title: "Gerenciar reservas de espaços",
            icon: MapPin,
            steps: [
                "Acesse Admin > Espaços Comuns",
                "Visualize calendário de reservas",
                "Clique em 'Nova Reserva'",
                "Escolha espaço e horário",
                "Confirme reserva",
                "Gere comprovante se necessário"
            ],
            video: "/videos/espacos-comuns.mp4",
            duration: "5:10"
        },
        {
            title: "Sistema de boletos",
            icon: CreditCard,
            steps: [
                "Acesse Admin > Boletos",
                "Clique em 'Gerar Boleto'",
                "Selecione apartamento",
                "Defina valor e vencimento",
                "Adicione descrição",
                "Boleto é automaticamente disponibilizado"
            ],
            video: "/videos/sistema-boletos.mp4",
            duration: "3:30"
        }
    ];

    const quickActions = [
        {
            title: "Cadastrar Morador",
            description: "Adicionar novo morador ao sistema",
            icon: User,
            href: "/admin/moradores",
            color: "bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800"
        },
        {
            title: "Registrar Visitante",
            description: "Gerar QR Code para acesso",
            icon: QrCode,
            href: "/admin/portaria",
            color: "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800"
        },
        {
            title: "Nova Reserva",
            description: "Reservar espaço comum",
            icon: Calendar,
            href: "/admin/espacos",
            color: "bg-purple-50 border-purple-200 dark:bg-purple-950 dark:border-purple-800"
        },
        {
            title: "Gerar Boleto",
            description: "Criar cobrança para apartamento",
            icon: CreditCard,
            href: "/admin/boletos",
            color: "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800"
        },
        {
            title: "Ver Relatórios",
            description: "Acessar dashboard e dados",
            icon: FileText,
            href: "/admin/relatorios",
            color: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950 dark:border-indigo-800"
        },
        {
            title: "Configurações",
            description: "Ajustar preferências do sistema",
            icon: Settings,
            href: "/admin/settings",
            color: "bg-gray-50 border-gray-200 dark:bg-gray-950 dark:border-gray-800"
        }
    ];

    return (
        <div className="space-y-8">
            {/* Cabeçalho */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    Central de Suporte
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Encontre respostas para suas dúvidas, tutoriais detalhados e canais de atendimento
                </p>
            </div>

            {/* Ações Rápidas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Ações Rápidas
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickActions.map((action, index) => (
                            <Card key={index} className={`transition-all hover:shadow-md cursor-pointer ${action.color}`}>
                                <CardContent className="p-4">
                                    <div className="flex items-start gap-3">
                                        <action.icon className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {action.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Status do Sistema */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Status do Sistema
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {systemStatus.map((service, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                                <service.icon className={`h-5 w-5 ${service.color}`} />
                                <div className="flex-1">
                                    <div className="font-medium text-sm">{service.service}</div>
                                    <div className="text-xs text-gray-500">{service.status}</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                    {service.uptime}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5" />
                        Perguntas Frequentes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {faq.map((item, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {item.question}
                                            </h3>
                                            <Badge variant="outline" className="text-xs">
                                                {item.category}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tutoriais */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PlayCircle className="h-5 w-5" />
                        Tutoriais em Vídeo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {tutorials.map((tutorial, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <div 
                                    className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => toggleTutorial(tutorial.title)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <tutorial.icon className="h-5 w-5 text-primary" />
                                            <div>
                                                <h3 className="font-medium text-gray-900 dark:text-white">
                                                    {tutorial.title}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Clock className="h-3 w-3 text-gray-500" />
                                                    <span className="text-xs text-gray-500">{tutorial.duration}</span>
                                                </div>
                                            </div>
                                        </div>
                                        {expandedTutorial === tutorial.title ? 
                                            <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                        }
                                    </div>
                                </div>
                                
                                {expandedTutorial === tutorial.title && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
                                        <div className="mb-4">
                                            <h4 className="font-medium text-sm text-gray-900 dark:text-white mb-2">
                                                Passos:
                                            </h4>
                                            <ol className="list-decimal list-inside space-y-1">
                                                {tutorial.steps.map((step, stepIndex) => (
                                                    <li key={stepIndex} className="text-sm text-gray-600 dark:text-gray-400">
                                                        {step}
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <PlayCircle className="h-4 w-4 mr-2" />
                                            Assistir Tutorial
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tipos de Solicitação */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Tipos de Solicitação
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {issueTypes.map((issue, index) => (
                            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-start gap-3 mb-3">
                                    <issue.icon className={`h-5 w-5 ${issue.color} mt-1`} />
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-medium text-gray-900 dark:text-white">
                                                {issue.type}
                                            </h3>
                                            <Badge variant={issue.priority === 'Alta' ? 'destructive' : issue.priority === 'Média' ? 'default' : 'secondary'}>
                                                {issue.priority}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                            {issue.description}
                                        </p>
                                        <div>
                                            <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-1">
                                                Exemplos:
                                            </h4>
                                            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                                {issue.examples.map((example, exampleIndex) => (
                                                    <li key={exampleIndex}>• {example}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Canais de Suporte */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Canais de Atendimento
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {supportChannels.map((channel, index) => (
                            <div key={index} className="text-center">
                                <div className={`inline-flex p-3 rounded-full ${channel.color} mb-4`}>
                                    <channel.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                    {channel.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {channel.description}
                                </p>
                                <div className="space-y-2">
                                    <div className="font-medium text-lg text-gray-900 dark:text-white">
                                        {channel.contact}
                                    </div>
                                    <div className="flex items-center justify-center gap-1">
                                        <Clock className="h-3 w-3 text-gray-500" />
                                        <span className="text-xs text-gray-500">
                                            Resposta em {channel.responseTime}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Recursos Adicionais */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="h-5 w-5" />
                        Recursos Adicionais
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Documentação
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                        <ExternalLink className="h-3 w-3" />
                                        Manual do Usuário Completo
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                        <ExternalLink className="h-3 w-3" />
                                        Guia de Melhores Práticas
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                        <ExternalLink className="h-3 w-3" />
                                        API Documentation
                                    </a>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Github className="h-4 w-4" />
                                Comunidade
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                        <ExternalLink className="h-3 w-3" />
                                        Fórum da Comunidade
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                        <ExternalLink className="h-3 w-3" />
                                        Atualizações do Sistema
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                        <ExternalLink className="h-3 w-3" />
                                        Feedback e Sugestões
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* CTA Final */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800">
                <CardContent className="p-8 text-center">
                    <div className="max-w-2xl mx-auto">
                        <Home className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Ainda precisa de ajuda?
                        </h2>
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

            {/* Chatbot - só aparece para administradores */}
            {userRole === 'admin' && <AdminChatbot userRole={userRole} />}
        </div>
    );
}
