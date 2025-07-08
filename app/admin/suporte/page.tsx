import { Metadata } from "next";
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
  Zap
} from "lucide-react";

export const metadata: Metadata = {
    title: 'Suporte - Admin SD',
    description: 'Central de suporte e ajuda do sistema Admin SD',
};

export default function SuportePage() {
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
            contact: "(11) 99999-9999",
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
            examples: ["Sistema não carrega", "Erro ao salvar dados", "Funcionalidade quebrada"],
            priority: "Alta",
            color: "text-red-600"
        },
        {
            type: "Dúvida",
            icon: HelpCircle,
            description: "Perguntas sobre como usar o sistema",
            examples: ["Como cadastrar morador", "Onde encontrar relatórios", "Como alterar permissões"],
            priority: "Média",
            color: "text-blue-600"
        },
        {
            type: "Sugestão",
            icon: Lightbulb,
            description: "Ideias para melhorar o sistema",
            examples: ["Nova funcionalidade", "Melhoria na interface", "Otimização de processo"],
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
            topics: ["Login no sistema", "Navegação básica", "Perfil do usuário"]
        },
        {
            title: "Gestão de Moradores",
            description: "Cadastro e gerenciamento completo",
            duration: "10 min",
            level: "Intermediário",
            topics: ["Cadastrar moradores", "Associar usuários", "Histórico de locação"]
        },
        {
            title: "Controle Financeiro",
            description: "Boletos e gestão de gastos",
            duration: "15 min",
            level: "Intermediário",
            topics: ["Gerar boletos", "Controlar pagamentos", "Relatórios financeiros"]
        },
        {
            title: "Administração Avançada",
            description: "Funcionalidades para administradores",
            duration: "20 min",
            level: "Avançado",
            topics: ["Gestão de usuários", "Permissões", "Configurações do sistema"]
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
                    <CardTitle>Tutoriais Disponíveis</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tutorials.map((tutorial) => (
                            <div key={tutorial.title} className="p-4 border rounded-lg">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold">{tutorial.title}</h3>
                                    <div className="flex space-x-2">
                                        <Badge variant="outline">{tutorial.duration}</Badge>
                                        <Badge className={
                                            tutorial.level === 'Iniciante' ? 'bg-green-100 text-green-800' :
                                            tutorial.level === 'Intermediário' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }>
                                            {tutorial.level}
                                        </Badge>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    {tutorial.description}
                                </p>
                                <div className="text-xs text-gray-500 mb-4">
                                    <strong>Tópicos:</strong> {tutorial.topics.join(" • ")}
                                </div>
                                <Button size="sm" variant="outline" className="w-full">
                                    Assistir Tutorial
                                </Button>
                            </div>
                        ))}
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
