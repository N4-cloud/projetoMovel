# Guia de Instalação - Projeto Zero Waste

Este documento contém todas as dependências e instruções necessárias para configurar o projeto do zero.

## 📋 Pré-requisitos do Sistema

Antes de começar, certifique-se de ter instalado:

### 1. Node.js e npm
- **Node.js**: Versão 18.x ou superior
- **npm**: Vem junto com o Node.js (versão 9.x ou superior)

**Como verificar se está instalado:**
```bash
node --version
npm --version
```

**Como instalar:**
- Windows/Mac: Baixe em [https://nodejs.org/](https://nodejs.org/)
- Linux: 
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. PostgreSQL
- **PostgreSQL**: Versão 14 ou superior

**Como verificar se está instalado:**
```bash
psql --version
```

**Como instalar:**
- Windows: Baixe em [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
- Mac: 
```bash
brew install postgresql@14
```
- Linux:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

### 3. Expo CLI (Global)
```bash
npm install -g expo-cli
```

### 4. Git
- **Git**: Para controle de versão (opcional, mas recomendado)

**Como verificar:**
```bash
git --version
```

---

## 🔧 Instalação do Backend

### Passo 1: Navegar até a pasta do backend
```bash
cd backend
```

### Passo 2: Instalar dependências

Execute o comando:
```bash
npm install
```

Isso instalará automaticamente todas as dependências listadas abaixo:

#### Dependências de Produção (dependencies):
- `@prisma/client` (^6.17.1) - Cliente Prisma para acesso ao banco de dados
- `bcryptjs` (^3.0.2) - Biblioteca para hash de senhas
- `cors` (^2.8.5) - Middleware para habilitar CORS
- `dotenv` (^17.2.3) - Carregamento de variáveis de ambiente
- `express` (^5.1.0) - Framework web para Node.js
- `nodemailer` (^7.0.10) - Biblioteca para envio de e-mails
- `prisma` (^6.17.1) - ORM e ferramenta de migração

#### Dependências de Desenvolvimento (devDependencies):
- `@types/bcryptjs` (^2.4.6) - Tipos TypeScript para bcryptjs
- `@types/cors` (^2.8.19) - Tipos TypeScript para cors
- `@types/express` (^5.0.3) - Tipos TypeScript para express
- `@types/node` (^24.8.1) - Tipos TypeScript para Node.js
- `@types/nodemailer` (^7.0.3) - Tipos TypeScript para nodemailer
- `ts-node-dev` (^2.0.0) - Execução de TypeScript em modo desenvolvimento
- `typescript` (^5.9.3) - Compilador TypeScript

### Passo 3: Configurar variáveis de ambiente

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/zero_waste?schema=public"
```

**Substitua:**
- `usuario`: Seu usuário do PostgreSQL (geralmente `postgres`)
- `senha`: Sua senha do PostgreSQL
- `zero_waste`: Nome do banco de dados (crie se não existir)

**Como criar o banco de dados:**
```bash
# Conecte ao PostgreSQL
psql -U postgres

# Dentro do psql, execute:
CREATE DATABASE zero_waste;
\q
```

### Passo 4: Executar migrações do Prisma

```bash
npx prisma migrate dev
```

Este comando irá:
- Criar todas as tabelas no banco de dados
- Aplicar todas as migrações existentes
- Gerar o cliente Prisma

### Passo 5: (Opcional) Gerar cliente Prisma

Se necessário, gere o cliente Prisma:
```bash
npx prisma generate
```

### Passo 6: Iniciar o servidor

```bash
npm run dev
```

O servidor estará rodando em: `http://localhost:3333`

---

## 📱 Instalação do Frontend

### Passo 1: Navegar até a pasta do frontend
```bash
cd frontend/projeto-app
```

### Passo 2: Instalar dependências

Execute o comando:
```bash
npm install
```

Isso instalará automaticamente todas as dependências listadas abaixo:

#### Dependências de Produção (dependencies):
- `@expo/metro-runtime` (~6.1.2) - Runtime do Metro bundler
- `@expo/vector-icons` (^15.0.2) - Biblioteca de ícones (inclui FontAwesome)
- `@react-native-picker/picker` (^2.11.4) - Componente de seleção
- `@react-navigation/bottom-tabs` (^7.4.0) - Navegação por abas
- `@react-navigation/elements` (^2.6.3) - Elementos de navegação
- `@react-navigation/native` (^7.1.8) - Navegação React Native
- `axios` (^1.13.2) - Cliente HTTP
- `expo` (~54.0.10) - Framework Expo
- `expo-constants` (~18.0.9) - Constantes do Expo
- `expo-font` (~14.0.8) - Carregamento de fontes customizadas
- `expo-haptics` (~15.0.7) - Feedback háptico
- `expo-image` (~3.0.8) - Componente de imagem otimizado
- `expo-linking` (~8.0.8) - Deep linking
- `expo-router` (~6.0.8) - Sistema de roteamento
- `expo-splash-screen` (~31.0.10) - Tela de splash
- `expo-status-bar` (~3.0.8) - Barra de status
- `expo-symbols` (~1.0.7) - Símbolos do sistema
- `expo-system-ui` (~6.0.7) - Controle da UI do sistema
- `expo-web-browser` (~15.0.7) - Navegador web integrado
- `react` (19.1.0) - Biblioteca React
- `react-dom` (19.1.0) - React para web
- `react-native` (0.81.4) - Framework React Native
- `react-native-gesture-handler` (~2.28.0) - Manipulação de gestos
- `react-native-reanimated` (~4.1.1) - Animações performáticas
- `react-native-safe-area-context` (~5.6.0) - Contexto de área segura
- `react-native-screens` (~4.16.0) - Otimização de telas nativas
- `react-native-web` (~0.21.0) - React Native para web
- `react-native-worklets` (0.5.1) - Worklets para animações

#### Dependências de Desenvolvimento (devDependencies):
- `@types/react` (~19.1.0) - Tipos TypeScript para React
- `eslint` (^9.25.0) - Linter de código
- `eslint-config-expo` (~10.0.0) - Configuração ESLint para Expo
- `typescript` (~5.9.2) - Compilador TypeScript

### Passo 3: Configurar URL da API

Edite o arquivo `constants/api.ts` e configure a URL do seu backend:

```typescript
export const API_URL = 'http://localhost:3333';
// ou se estiver usando ngrok/túnel:
// export const API_URL = 'http://seu-tunel.ngrok.io';
```

**Importante para desenvolvimento mobile:**
- Se estiver testando em dispositivo físico, use o IP da sua máquina na rede local
- Exemplo: `http://192.168.1.100:3333`
- Ou use um serviço de túnel como ngrok para expor o servidor local

### Passo 4: Instalar Expo Go no dispositivo (opcional)

Para testar no dispositivo físico:
- **Android**: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store](https://apps.apple.com/app/expo-go/id982107779)

### Passo 5: Iniciar o aplicativo

```bash
npm start
```

Ou use os comandos específicos:
```bash
npm run android    # Para Android
npm run ios        # Para iOS
npm run web        # Para web
```

---

## 🚀 Instalação Completa (Script Rápido)

Se preferir, você pode executar todos os comandos de uma vez:

### Windows (PowerShell):
```powershell
# Backend
cd backend
npm install
# Configure o .env manualmente
npx prisma migrate dev
npm run dev

# Em outro terminal:
# Frontend
cd frontend/projeto-app
npm install
# Configure constants/api.ts manualmente
npm start
```

### Linux/Mac:
```bash
# Backend
cd backend && npm install
# Configure o .env manualmente
npx prisma migrate dev
npm run dev

# Em outro terminal:
# Frontend
cd frontend/projeto-app && npm install
# Configure constants/api.ts manualmente
npm start
```

---

## 🔍 Verificação da Instalação

### Verificar Backend:
1. Acesse `http://localhost:3333` no navegador
2. Deve aparecer: `{"message":"API do Zero Waste no ar!"}`

### Verificar Frontend:
1. Execute `npm start` na pasta do frontend
2. Escaneie o QR code com Expo Go ou abra no emulador
3. O aplicativo deve carregar a tela de login

---

## ⚠️ Problemas Comuns e Soluções

### Erro: "Cannot find module"
**Solução:** Execute `npm install` novamente na pasta correspondente

### Erro: "DATABASE_URL not found"
**Solução:** Verifique se o arquivo `.env` existe na pasta `backend/` e está configurado corretamente

### Erro: "Prisma Client not generated"
**Solução:** Execute `npx prisma generate` na pasta `backend/`

### Erro: "Connection refused" no mobile
**Solução:** 
- Use o IP da sua máquina na rede local em vez de `localhost`
- Ou configure um túnel com ngrok

### Erro: "Port 3333 already in use"
**Solução:** 
- Altere a porta no arquivo `backend/src/server.ts`
- Ou encerre o processo que está usando a porta 3333

---

## 📦 Resumo das Dependências

### Backend - Total: 13 pacotes
- **Produção**: 7 pacotes
- **Desenvolvimento**: 6 pacotes

### Frontend - Total: 32 pacotes
- **Produção**: 28 pacotes
- **Desenvolvimento**: 4 pacotes

### Total do Projeto: 45 pacotes npm

---

## 📝 Notas Importantes

1. **Node Modules**: As pastas `node_modules` não devem ser commitadas no Git (já devem estar no `.gitignore`)

2. **Package Lock**: Os arquivos `package-lock.json` devem ser commitados para garantir versões consistentes

3. **Variáveis de Ambiente**: Nunca commite arquivos `.env` com credenciais reais

4. **Versões**: Este guia foi criado com as versões específicas do projeto. Se houver atualizações, ajuste conforme necessário

5. **Banco de Dados**: Certifique-se de que o PostgreSQL está rodando antes de iniciar o backend

---

## 🆘 Suporte

Se encontrar problemas durante a instalação:

1. Verifique se todas as versões dos pré-requisitos estão corretas
2. Limpe o cache do npm: `npm cache clean --force`
3. Delete `node_modules` e `package-lock.json` e reinstale: `rm -rf node_modules package-lock.json && npm install`
4. Verifique os logs de erro no terminal
5. Consulte a documentação oficial das tecnologias utilizadas

---

**Última atualização:** Baseado nas versões do projeto atual

