# Configuração do Chatbot com IA

## Chaves de API (adicione ao seu .env.local):

# Groq API (Gratuito) - Recomendado para começar
# Cadastre-se em: https://console.groq.com
NEXT_PUBLIC_GROQ_API_KEY=sua_chave_groq_aqui

# OpenAI API (Pago) - Backup caso Groq falhe  
# Cadastre-se em: https://platform.openai.com
NEXT_PUBLIC_OPENAI_API_KEY=sua_chave_openai_aqui

## Como obter as chaves:

### 1. Groq (GRATUITO - Recomendado)
- Acesse: https://console.groq.com
- Cadastre-se com email
- Vá em "API Keys" 
- Clique "Create API Key"
- Copie a chave gerada
- Cole no .env.local como NEXT_PUBLIC_GROQ_API_KEY=gsk_sua_chave...

### 2. OpenAI (PAGO - Backup)
- Acesse: https://platform.openai.com
- Cadastre-se e adicione método de pagamento
- Vá em "API Keys"
- Clique "Create new secret key"
- Copie a chave gerada  
- Cole no .env.local como NEXT_PUBLIC_OPENAI_API_KEY=sk_sua_chave...

## Modelos utilizados:
- Groq: llama-3.1-70b-versatile (gratuito)
- OpenAI: gpt-4o-mini (mais barato)

## Segurança:
- Use apenas NEXT_PUBLIC_ para chaves do frontend
- Para produção, mova as chamadas para API routes do Next.js
- Mantenha as chaves em variáveis de ambiente

## Alternativas gratuitas:
1. **Groq** - Llama 3.1 70B (recomendado)
2. **Hugging Face** - Vários modelos gratuitos
3. **Ollama** - Executar modelos localmente
4. **Google AI Studio** - Gemini gratuito
