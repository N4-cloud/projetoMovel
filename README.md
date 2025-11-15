# Projeto Móvel Projeto Zero Waste

Projeto da disciplina de programação de dispositivos móveis com ReactNative + Expo (Android)

Orientador: Prof. Luiz Gustavo Turatti

A solução compartilhada neste repositório consiste no desenvolvimento de uma plataforma para gestão de estoque e produção, permitindo o controle de produtos, registro de produções com baixa automática de estoque, visualização de histórico e sistema completo de autenticação com recuperação de senha.

## Equipe do projeto

202404093638 - Gabriel Flausino Rodrigues 

202402933973 - Amauri Ferreira de Souza 

## Sumário

- [Requisitos](#-requisitos)
- [Configuração de acesso aos dados](#-configuração-de-acesso-ao-banco-de-dados)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Instale os requisitos do projeto](#-instale-os-requisitos-do-projeto)
- [Executando o projeto](#-execute-o-projeto)
- [Telas do projeto](#-telas-do-projeto)

## 🔧 Requisitos:

- **NodeJS LTS** versão 18.x ou superior
- **React Native** versão 0.81.4
- **Expo** versão ~54.0.10
- **ExpoGo** ([Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)) / ([Apple App Store](https://apps.apple.com/app/expo-go/id982107779))
- **Banco de dados**: PostgreSQL 14+ (com Prisma ORM)

### 🗃️ Tabelas do banco de dados:

**Tabela 'Usuario'** com os seguintes campos:
- `id`: UUID (primary key)
- `email`: text (unique, not null)
- `nome`: text (not null)
- `senha`: text (not null) - hash bcrypt
- `resetToken`: text (nullable) - para recuperação de senha
- `resetTokenExpires`: timestamp (nullable) - expiração do token
- `createdAt`: timestamp
- `updatedAt`: timestamp

**Tabela 'Produto'** com os seguintes campos:
- `id`: UUID (primary key)
- `nome`: text (unique, not null)
- `unidadeMedida`: text (not null)
- `quantidade`: float (nullable)
- `fornecedor`: text (nullable)
- `dataRecebimento`: text (nullable)
- `createdAt`: timestamp
- `updatedAt`: timestamp

**Tabela 'Producao'** com os seguintes campos:
- `id`: UUID (primary key)
- `nomeProduto`: text (not null)
- `quantidade`: float (not null)
- `dataProducao`: text (not null)
- `observacao`: text (nullable)
- `createdAt`: timestamp
- `updatedAt`: timestamp

## 🔐 Configuração de acesso ao banco de dados

No arquivo `backend/.env`, configure:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"
```

**Exemplo:**
```env
DATABASE_URL="postgresql://postgres:senha123@localhost:5432/zero_waste?schema=public"
```

**Nota:** Para desenvolvimento mobile, você precisará expor o backend localmente usando ferramentas como ngrok ou configurar um servidor em nuvem. Atualize a URL no arquivo `frontend/projeto-app/constants/api.ts`:

```typescript
export const API_URL = 'http://seu-backend-url.com';
```

## 📁 Estrutura do projeto:

```
projetoMovel/
├── apresentacao
│   ├── apresentacao.pdf
│   └── apresentacao.pptx
├── backend
│   ├── src
│   │   ├── controllers
│   │   │   └── AuthController.ts
│   │   └── server.ts
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── readme.md
├── documentacao
│   ├── 01_cartaDeApresentacao.pdf
│   ├── 02_cartaDeAutorizacao.pdf
│   ├── 03_declaracaoDeUsoDeDadosPublicos.pdf
│   ├── 04_roteiroDeExtensao.pdf
│   ├── DOCUMENTACAO.md
│   └── INSTALACAO.md
├── frontend
│   └── projeto-app
│       ├── app
│       │   ├── _layout.tsx
│       │   ├── index.tsx
│       │   ├── register.tsx
│       │   ├── esqueciSenha.tsx
│       │   ├── verificarCodigo.tsx
│       │   ├── home.tsx
│       │   ├── cadastrarProduto.tsx
│       │   ├── cadastrarProducao.tsx
│       │   └── estoque.tsx
│       ├── assets
│       │   └── fonts
│       ├── constants
│       │   ├── api.ts
│       │   └── theme.ts
│       ├── hooks
│       ├── .gitignore
│       ├── package.json
│       ├── app.json
│       ├── tsconfig.json
│       └── readme.md
├── video
│   ├── apresentacao.gif
│   ├── apresentacao.mkv
│   ├── apresentacao.mp4
│   └── video.txt
└── readme.md
```

## 📦 Instale os requisitos do projeto:

### Instruções para instalação em um computador com Windows 11

Caso não tenha o chocolatey instalado, inicie o preparo do sistema abrindo um terminal do PowerShell com privilégio de administrador:

```powershell
PS> Set-ExecutionPolicy AllSigned
PS> Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
PS> choco --version
```

Com o chocolatey instalado, continuamos com a instalação dos requisitos do projeto:

```powershell
PS> choco install nodejs-lts -y
PS> choco install openjdk17 -y
PS> choco install nvm -y
```

**Instalação do PostgreSQL:**

```powershell
PS> choco install postgresql -y
```

**Instalação das dependências do projeto:**

**Backend:**
```powershell
PS> cd backend
PS> npm install
PS> npx prisma generate
```

**Frontend:**
```powershell
PS> cd frontend/projeto-app
PS> npm install
```

**Configuração do banco de dados:**

1. Crie um banco de dados PostgreSQL:
```sql
CREATE DATABASE zero_waste;
```

2. Configure o arquivo `backend/.env` com a URL do banco de dados (veja seção [Configuração de acesso ao banco de dados](#-configuração-de-acesso-ao-banco-de-dados))

3. Execute as migrações:
```powershell
PS> cd backend
PS> npx prisma migrate dev
```

## 🚀 Execute o projeto:

### Backend:

```powershell
PS> cd backend
PS> npm run dev
```

O servidor estará rodando em `http://localhost:3333` (ou na porta configurada).

### Frontend:

```powershell
PS> cd frontend/projeto-app
PS> npx expo start
```

Ou simplesmente:

```powershell
PS> npm start
```

Após executar, você verá um QR code no terminal. Escaneie com o aplicativo Expo Go instalado no seu dispositivo Android ou iOS.

**Alternativas:**
- Pressione `a` para abrir no emulador Android
- Pressione `i` para abrir no simulador iOS
- Pressione `w` para abrir no navegador web

## 📱 Telas do projeto

Capture todas as telas do projeto e identifique-as:

**Tela 1: Login** (`app/index.tsx`)
- Tela inicial de autenticação
- Campos: E-mail e Senha
- Links para recuperação de senha e criação de conta

**Tela 2: Criação de Usuário** (`app/register.tsx`)
- Formulário de cadastro de novo usuário
- Campos: Nome, E-mail e Senha

**Tela 3: Recuperação de Senha** (`app/esqueciSenha.tsx`)
- Solicitação de recuperação de senha
- Campo: E-mail
- Envia código de verificação por e-mail

**Tela 4: Verificação de Código** (`app/verificarCodigo.tsx`)
- Validação do código recebido por e-mail
- Campos: Código de verificação e Nova senha

**Tela 5: Tela Inicial / Home** (`app/home.tsx`)
- Menu principal do aplicativo
- Navegação para as funcionalidades principais

**Tela 6: Cadastro de Produto** (`app/cadastrarProduto.tsx`)
- Formulário para cadastrar novos produtos no estoque
- Campos: Nome, Unidade de Medida, Quantidade, Fornecedor, Data de Recebimento

**Tela 7: Cadastro de Produção** (`app/cadastrarProducao.tsx`)
- Registro de produções que consomem produtos do estoque
- Campos: Nome do Produto, Quantidade, Data de Produção, Observação
- Atualiza automaticamente o estoque

**Tela 8: Estoque** (`app/estoque.tsx`)
- Visualização do estoque atual
- Lista todos os produtos cadastrados com suas quantidades
- Histórico de produções realizadas

---


