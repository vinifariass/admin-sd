"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Minimize2, Maximize2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface AdminChatbotProps {
  userRole: string;
}

// Componente para renderizar texto com markdown básico
const MarkdownText: React.FC<{ text: string }> = ({ text }) => {
  const renderText = (text: string) => {
    // Substitui **texto** por <strong>texto</strong>
    const parts = text.split(/(\*\*.*?\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return <span>{renderText(text)}</span>;
};

const AdminChatbot: React.FC<AdminChatbotProps> = ({ userRole }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '🤖 **Olá! Sou seu assistente do Admin SD!**\n\nSou especializado em gestão de condomínios e posso ajudar com **todas as funcionalidades** do sistema.\n\n**📚 Conhecimento disponível:**\n• **Navegação** e uso do sistema\n• **Agendamentos** de espaços comuns\n• **Gestão de moradores** e apartamentos\n• **Controle de visitantes** e portaria\n• **Sistema financeiro** e boletos\n• **Relatórios** e dashboard\n• **Configurações** e personalização\n\n**⚡ Funcionamento 100% offline** - sempre disponível!\n\n**Como posso ajudá-lo hoje?**',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Não renderizar para usuários que não são admin
  if (userRole !== 'admin') {
    return null;
  }

  // Respostas locais otimizadas
  const generateLocalResponse = (userMessage: string): string => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes('navegar') || msg.includes('menu') || msg.includes('onde') || msg.includes('encontrar')) {
      return '🧭 **Navegação do Sistema:**\n\n**Menu Principal (Sidebar):**\n• **Overview** - Dashboard com estatísticas\n• **Agendamentos** - Reservas de espaços\n• **Boletos** - Gestão financeira\n• **Moradores** - Gestão de residentes\n• **Visitantes** - Controle de acesso\n• **Portaria** - QR Codes e segurança\n• **Relatórios** - Dashboard e exportação\n• **Configurações** - Personalização\n\n**Dica:** Use o ícone ☰ para expandir/recolher!';
    }
    
    if (msg.includes('agendamento') || msg.includes('reserva') || msg.includes('espaço')) {
      return '📅 **Agendamentos:**\n\n**Como reservar:**\n1. Menu **"Agendamentos"**\n2. Clique **"Nova Reserva"**\n3. Escolha o espaço\n4. Defina data/horário\n5. Confirme\n\n**Espaços:**\n• **Churrasqueira** - R$ 200/dia\n• **Salão de Festas** - R$ 150/dia\n• **Quadra, Piscina, Playground**\n\n**Cancelamento:** Até 24h antes';
    }
    
    if (msg.includes('morador') || msg.includes('apartamento')) {
      return '🏠 **Moradores:**\n\n**Funcionalidades:**\n• Cadastrar novos moradores\n• Associar a apartamentos\n• Gerenciar proprietários/inquilinos\n• Controlar pets e veículos\n• Histórico de atividades\n\n**Como cadastrar:**\n1. Menu **"Moradores"**\n2. **"Adicionar"**\n3. Preencha dados\n4. Selecione apartamento\n5. Salvar';
    }
    
    if (msg.includes('visitante') || msg.includes('portaria') || msg.includes('qr')) {
      return '🚪 **Portaria Digital:**\n\n**QR Code para visitantes:**\n1. Menu **"Portaria"**\n2. **"Cadastrar Visitante"**\n3. Dados do visitante\n4. Apartamento destino\n5. **QR Code gerado automaticamente**\n\n**Validade:** 24h\n**Segurança:** Códigos únicos\n**Controle:** Entrada/saída automática';
    }
    
    if (msg.includes('boleto') || msg.includes('financeiro')) {
      return '💰 **Sistema Financeiro:**\n\n**Boletos:**\n• Geração automática\n• Controle vencimentos\n• Status: Pendente/Pago/Vencido\n• Notificações automáticas\n\n**Como gerar:**\n1. Menu **"Boletos"**\n2. **"Novo Boleto"**\n3. Selecione apartamento\n4. Valor e vencimento\n5. Descrição\n6. Confirmar';
    }
    
    if (msg.includes('relatório') || msg.includes('dashboard') || msg.includes('overview')) {
      return '📊 **Relatórios e Dashboard:**\n\n**Overview:**\n• Estatísticas gerais do condomínio\n• Gráficos interativos\n• Indicadores financeiros\n• Status dos apartamentos\n\n**Relatórios:**\n• Financeiro detalhado\n• Ocupação de espaços\n• Controle de visitantes\n• Exportação PDF/Excel\n\n**Acesso:** Menu lateral **"Relatórios"**';
    }
    
    if (msg.includes('funcionário') || msg.includes('colaborador') || msg.includes('porteiro')) {
      return '👥 **Gestão de Funcionários:**\n\n**Tipos:**\n• Porteiros\n• Zeladores\n• Segurança\n• Limpeza\n• Manutenção\n\n**Funcionalidades:**\n• Cadastro completo\n• Escalas de trabalho\n• Controle de acesso\n• Histórico de atividades\n\n**Acesso:** Menu **"Funcionários"**';
    }
    
    if (msg.includes('encomenda') || msg.includes('entrega') || msg.includes('correspondência')) {
      return '📦 **Controle de Encomendas:**\n\n**Funcionalidades:**\n• Registro de entregas\n• Notificação automática aos moradores\n• Status: Pendente/Retirada\n• Histórico completo\n• Comprovante de entrega\n\n**Como registrar:**\n1. Menu **"Encomendas"**\n2. **"Nova Entrega"**\n3. Dados da encomenda\n4. Apartamento destinatário\n5. Confirmar';
    }
    
    if (msg.includes('documentação') || msg.includes('ata') || msg.includes('convenção')) {
      return '📋 **Documentação:**\n\n**Documentos disponíveis:**\n• Convenção do condomínio\n• Regimento interno\n• Atas de reunião\n• Documentos legais\n• Manuais do sistema\n\n**Funcionalidades:**\n• Upload de arquivos\n• Organização por categorias\n• Controle de versões\n• Acesso controlado\n\n**Acesso:** Menu **"Documentação"**';
    }
    
    if (msg.includes('gastos') || msg.includes('despesa') || msg.includes('contas')) {
      return '💸 **Controle de Gastos:**\n\n**Categorias:**\n• Manutenção\n• Limpeza\n• Segurança\n• Energia\n• Água\n• Outros\n\n**Funcionalidades:**\n• Registro de despesas\n• Upload de comprovantes\n• Relatórios por período\n• Controle orçamentário\n\n**Acesso:** Menu **"Gastos"**';
    }
    
    if (msg.includes('ouvidoria') || msg.includes('reclamação') || msg.includes('sugestão')) {
      return '🗣️ **Ouvidoria:**\n\n**Tipos de solicitação:**\n• Reclamações\n• Sugestões\n• Denúncias\n• Elogios\n• Solicitações gerais\n\n**Processo:**\n• Registro da solicitação\n• Análise pela administração\n• Resposta ao solicitante\n• Acompanhamento do status\n\n**Acesso:** Menu **"Ouvidoria"**';
    }
    
    if (msg.includes('parking') || msg.includes('vaga') || msg.includes('estacionamento')) {
      return '🚗 **Controle de Parkings:**\n\n**Tipos de vaga:**\n• Fixas (proprietários)\n• Rotativas (visitantes)\n• Especiais (deficientes)\n• Motocicletas\n\n**Funcionalidades:**\n• Associação morador-vaga\n• Controle de ocupação\n• Relatórios de uso\n• Gestão de multas\n\n**Acesso:** Menu **"Parkings"**';
    }
    
    if (msg.includes('reunião') || msg.includes('assembleia') || msg.includes('videoconferência')) {
      return '🎥 **Reunião Online:**\n\n**Funcionalidades:**\n• Agendar assembleias\n• Videoconferências\n• Controle de presença\n• Gravação de reuniões\n• Atas automáticas\n\n**Como agendar:**\n1. Menu **"Reunião Online"**\n2. **"Nova Reunião"**\n3. Data e horário\n4. Pauta da reunião\n5. Enviar convites\n\n**Plataforma integrada** para facilitar a participação.';
    }
    
    if (msg.includes('serviço') || msg.includes('prestador') || msg.includes('manutenção')) {
      return '🔧 **Serviços:**\n\n**Prestadores cadastrados:**\n• Eletricistas\n• Encanadores\n• Pintores\n• Jardineiros\n• Técnicos diversos\n\n**Funcionalidades:**\n• Cadastro de prestadores\n• Avaliações e comentários\n• Histórico de serviços\n• Agendamento\n• Controle de acesso\n\n**Acesso:** Menu **"Serviços"**';
    }
    
    if (msg.includes('usuário') || msg.includes('user') || msg.includes('permissão')) {
      return '� **Gestão de Usuários:**\n\n**Tipos de usuário:**\n• **ADMIN** - Acesso total\n• **FUNCIONARIO** - Portaria, visitantes, encomendas\n• **MORADOR** - Perfil, boletos, reservas próprias\n\n**Funcionalidades:**\n• Criar/editar usuários\n• Definir permissões\n• Resetar senhas\n• Controle de acesso\n\n**Acesso:** Menu **"Users"**';
    }
    
    if (msg.includes('configuração') || msg.includes('personalização') || msg.includes('sistema')) {
      return '⚙️ **Configurações do Sistema:**\n\n**Personalizações:**\n• Dados do condomínio\n• Logo e cores\n• Notificações\n• Backup automático\n• Integrações\n\n**Configurações gerais:**\n• Horários de funcionamento\n• Regras de agendamento\n• Valores de taxas\n• Políticas de uso\n\n**Acesso restrito** a administradores.';
    }
    
    if (msg.includes('oi') || msg.includes('olá') || msg.includes('hello') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite')) {
      return '👋 **Olá! Bem-vindo ao Admin SD!**\n\nSou seu assistente especializado em gestão de condomínios.\n\n🏠 **Áreas que domino:**\n• Moradores e Apartamentos\n• Agendamentos e Espaços\n• Portaria e Visitantes\n• Boletos e Financeiro\n• Relatórios e Dashboard\n• Encomendas e Correspondências\n• Funcionários e Serviços\n• Documentação e Ouvidoria\n• Configurações do Sistema\n\n**Como posso ajudar?** 😊\n\n*Exemplo: "Como fazer agendamentos" ou "Onde cadastrar moradores"*';
    }
    
    if (msg.includes('help') || msg.includes('ajuda') || msg.includes('como usar') || msg.includes('tutorial')) {
      return '🆘 **Como usar o Sistema:**\n\n**Navegação:**\n• Use o **menu lateral** para acessar as áreas\n• **Dashboard** mostra informações resumidas\n• **Filtros** facilitam a busca\n\n**Ações comuns:**\n• **Adicionar** - Botões verdes\n• **Editar** - Ícone lápis\n• **Excluir** - Ícone lixeira\n• **Visualizar** - Ícone olho\n\n**Dicas:**\n• Use **Ctrl+F** para buscar na página\n• **Dark mode** disponível no canto superior\n• **Notificações** no sino superior direito';
    }
    
    return '🤔 **Posso ajudar com:**\n\n**📍 Navegação:**\n• "Como navegar no sistema"\n• "Onde encontrar agendamentos"\n\n**🏠 Gestão:**\n• "Como cadastrar moradores"\n• "Como gerar boletos"\n• "Como controlar visitantes"\n\n**📊 Relatórios:**\n• "Como gerar relatórios"\n• "Dashboard do sistema"\n\n**⚙️ Configurações:**\n• "Como configurar o sistema"\n• "Gestão de usuários"\n\n**Seja mais específico** para uma resposta detalhada! 💪';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = inputMessage.trim();
    setInputMessage('');
    setIsTyping(true);

    try {
      // Simular delay de processamento para melhor UX
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      const responseText = generateLocalResponse(messageText);

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: '❌ **Erro temporário.** Tente novamente em alguns instantes.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botão flutuante */}
      {!isOpen && (
        <div className="relative">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg animate-pulse"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <div className="absolute -top-2 -left-2 bg-green-500 text-white text-xs rounded-full px-2 py-1 animate-bounce font-bold">
            BOT
          </div>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <Card 
          className={cn(
            "w-96 shadow-2xl transition-all duration-300",
            isMinimized ? "h-14" : "h-[600px]"
          )}
        >
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <CardTitle className="text-lg">
                Assistente Admin
              </CardTitle>
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                Online
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Content */}
          {!isMinimized && (
            <CardContent className="p-0 flex flex-col h-[536px]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-2",
                      message.sender === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                          <MessageCircle className="h-4 w-4 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[280px] p-3 rounded-lg text-sm",
                        message.sender === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="whitespace-pre-wrap">
                        {message.sender === 'bot' ? (
                          <MarkdownText text={message.text} />
                        ) : (
                          message.text
                        )}
                      </div>
                      <div className={cn(
                        "text-xs mt-1 opacity-70",
                        message.sender === 'user' ? "text-right" : "text-left"
                      )}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                          <MessageCircle className="h-4 w-4" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-2 justify-start">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                        <MessageCircle className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input area - POSIÇÃO FIXA */}
              <div className="border-t p-4 bg-background flex-shrink-0">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua pergunta sobre o sistema..."
                    className="flex-1"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  ⚡ Assistente local especializado em Admin SD - 100% offline
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
};

export default AdminChatbot;
