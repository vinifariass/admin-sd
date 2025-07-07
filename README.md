# 🏢 Admin SD - Sistema de Gestão de Condomínio

Sistema completo de gestão para condomínios desenvolvido em Next.js 15 com TypeScript, Prisma e shadcn/ui.

## 🚀 Funcionalidades

### 👤 **Sistema de Autenticação**
- Login e cadastro de usuários
- Autenticação com NextAuth.js
- Controle de acesso por tipo de usuário (ADMIN, FUNCIONARIO, MORADOR)
- Páginas protegidas por sessão

### 🏠 **Área Administrativa**

#### **Dashboard**
- `/admin/overview` - Visão geral com estatísticas
- Gráficos e métricas do condomínio
- Resumo de todas as atividades

#### **Gestão de Moradores**
- `/admin/moradores` - Listagem de moradores
- `/admin/moradores/create` - Cadastro de novos moradores
- `/admin/moradores/[id]` - Edição de moradores
- Associação de moradores com usuários do sistema
- Controle de datas de locação e saída

#### **Gestão de Funcionários**
- `/admin/funcionarios` - Listagem de funcionários
- `/admin/funcionarios/create` - Cadastro de funcionários
- `/admin/funcionarios/[id]` - Edição de funcionários
- Controle de salários, cargos e departamentos
- Gestão de admissão e demissão

#### **Estacionamento**
- `/admin/parkings` - Gestão de vagas
- `/admin/parkings/create` - Cadastro de veículos
- `/admin/parkings/[id]` - Edição de vagas
- Controle por tipo de veículo (carro/moto)
- Vinculação com moradores

#### **Visitantes**
- `/admin/visitantes` - Controle de visitantes
- `/admin/visitantes/create` - Agendamento de visitas
- `/admin/visitantes/[id]` - Gestão de autorizações
- Sistema de status (Agendado, Autorizado, Chegou, Saiu, Cancelado)
- Filtros avançados por data e status

#### **Encomendas**
- `/admin/encomendas` - Gestão de encomendas
- `/admin/encomendas/create` - Registro de novas encomendas
- `/admin/encomendas/[id]` - Controle de entregas
- Status de entrega e assinatura

#### **Boletos**
- `/admin/boletos` - Gestão de boletos
- `/admin/boletos/create` - Geração de novos boletos
- `/admin/boletos/[id]` - Edição e controle de pagamentos
- Código de barras e data de vencimento
- Filtros por status de pagamento

#### **Agendamentos**
- `/admin/agendamentos` - Gestão de agendamentos
- `/admin/agendamentos/create` - Novos agendamentos
- `/admin/agendamentos/[id]` - Edição de agendamentos
- Controle de horários e tipos de serviço

#### **Gastos**
- `/admin/gastos` - Controle financeiro
- `/admin/gastos/create` - Registro de despesas
- `/admin/gastos/[id]` - Edição de gastos
- Categorização e relatórios

#### **Serviços**
- `/admin/servicos` - Gestão de serviços
- `/admin/servicos/create` - Cadastro de serviços
- `/admin/servicos/[id]` - Controle de vencimentos
- Integração com Telegram para notificações

#### **Usuários**
- `/admin/users` - Gestão de usuários do sistema
- `/admin/users/[id]` - Edição de perfis e permissões
- Controle de tipos de usuário

#### **Outras Áreas**
- `/admin/ouvidoria` - Canal de comunicação
- `/admin/reuniao-online` - Gestão de reuniões virtuais

### 👥 **Área do Usuário/Morador**

#### **Perfil e Configurações**
- `/user/profile` - Perfil pessoal do usuário
- `/user/settings` - Configurações de conta
- `/user/notifications` - Central de notificações
- Visualização de apartamentos associados
- Edição de dados pessoais

#### **Serviços para Moradores**
- `/boletos` - Consulta de boletos pessoais
- Sistema de marcação de pagamento
- Filtros por período e status

### 🔧 **Funcionalidades Técnicas**

#### **Autenticação e Autorização**
- NextAuth.js com provedores customizados
- Middleware de proteção de rotas
- Controle granular de permissões
- Sessões persistentes

#### **Banco de Dados**
- PostgreSQL com Prisma ORM
- Migrações automáticas
- Relacionamentos complexos entre entidades
- Validação de dados com Zod

#### **Interface e UX**
- Design responsivo com Tailwind CSS
- Componentes reutilizáveis com shadcn/ui
- Tema claro/escuro
- Navegação intuitiva
- Feedback visual para ações do usuário

#### **Integrações**
- Sistema de notificações
- Upload de arquivos (UploadThing)
- Validação de CPF
- Formatação de datas brasileiras

## 🛠 **Tecnologias Utilizadas**

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Banco de Dados**: PostgreSQL + Prisma ORM
- **Autenticação**: NextAuth.js
- **Validação**: Zod
- **Formulários**: React Hook Form
- **Notificações**: Sonner
- **Upload**: UploadThing
- **Ícones**: Lucide React

## 📁 **Estrutura do Projeto**

```
admin-sd/
├── app/                    # App Router (Next.js 13+)
│   ├── (auth)/            # Grupo de rotas de autenticação
│   │   ├── sign-in/       # Página de login
│   │   └── sign-up/       # Página de cadastro
│   ├── (root)/            # Página inicial
│   ├── admin/             # Área administrativa
│   │   ├── overview/      # Dashboard
│   │   ├── moradores/     # Gestão de moradores
│   │   ├── funcionarios/  # Gestão de funcionários
│   │   ├── parkings/      # Estacionamento
│   │   ├── visitantes/    # Controle de visitantes
│   │   ├── encomendas/    # Gestão de encomendas
│   │   ├── boletos/       # Gestão de boletos
│   │   ├── agendamentos/  # Agendamentos
│   │   ├── gastos/        # Controle financeiro
│   │   ├── servicos/      # Gestão de serviços
│   │   └── users/         # Gestão de usuários
│   ├── user/              # Área do usuário/morador
│   │   ├── profile/       # Perfil pessoal
│   │   ├── settings/      # Configurações
│   │   └── notifications/ # Notificações
│   ├── boletos/           # Consulta de boletos (morador)
│   └── api/               # API Routes
├── components/            # Componentes React
│   ├── admin/             # Componentes administrativos
│   ├── admin-panel/       # Layout do painel admin
│   ├── shared/            # Componentes compartilhados
│   ├── ui/                # Componentes base (shadcn/ui)
│   └── user/              # Componentes da área do usuário
├── lib/                   # Utilitários e configurações
│   ├── actions/           # Server Actions
│   ├── constants/         # Constantes e valores padrão
│   └── db/                # Configuração do banco
├── prisma/                # Schema e migrações do Prisma
├── types/                 # Definições de tipos TypeScript
└── hooks/                 # Custom React Hooks
```

## 🚀 **Como Executar**

### Pré-requisitos
- Node.js 18+
- PostgreSQL
- npm/yarn/pnpm

### Instalação
```bash
# Clone o repositório
git clone <repository-url>
cd admin-sd

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Execute as migrações do banco
npx prisma migrate dev

# Gere o cliente Prisma
npx prisma generate

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
npx prisma studio    # Interface visual do banco
npx prisma migrate   # Executar migrações
```

## 🔐 **Tipos de Usuário**

### **ADMIN**
- Acesso completo ao sistema
- Gestão de todos os módulos
- Criação e edição de usuários
- Acesso a relatórios e estatísticas

### **FUNCIONARIO**
- Acesso a módulos específicos
- Gestão de visitantes e encomendas
- Consulta de informações dos moradores
- Sem acesso a configurações do sistema

### **MORADOR**
- Acesso à área do usuário
- Consulta de boletos pessoais
- Visualização do próprio perfil
- Central de notificações

## 📱 **Funcionalidades por Tela**

### Área Administrativa
- **Dashboard**: Estatísticas, gráficos, resumos
- **Moradores**: CRUD completo + associação com usuários
- **Funcionários**: Gestão de RH + controle salarial
- **Estacionamento**: Controle de vagas + tipos de veículo
- **Visitantes**: Agendamento + autorização + controle de acesso
- **Encomendas**: Registro + entrega + assinatura
- **Boletos**: Geração + pagamento + código de barras
- **Agendamentos**: Horários + tipos + confirmação
- **Gastos**: Despesas + categorização + relatórios
- **Serviços**: Vencimentos + notificações Telegram
- **Usuários**: Permissões + tipos + ativação

### Área do Usuário
- **Perfil**: Dados pessoais + apartamentos associados
- **Configurações**: Tema + idioma + preferências
- **Notificações**: Central de avisos + leitura
- **Boletos**: Consulta pessoal + marcação de pagamento

## 🌟 **Diferenciais**

- ✅ **Sistema Completo**: Todas as necessidades de um condomínio
- ✅ **Interface Moderna**: Design responsivo e intuitivo
- ✅ **Controle Granular**: Permissões detalhadas por tipo de usuário
- ✅ **Integração Telegram**: Notificações automáticas
- ✅ **Validações Robustas**: CPF, datas, formulários
- ✅ **Tema Claro/Escuro**: Experiência personalizada
- ✅ **Mobile First**: Funciona perfeitamente em dispositivos móveis
- ✅ **TypeScript**: Código tipado e seguro
- ✅ **Performance**: Next.js 15 com otimizações

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ para gestão eficiente de condomínios**
