# Documentação do Projeto Zero Waste

## 1. Introdução ao Projeto ^

O **Zero Waste** é um sistema de gestão de estoque e produção desenvolvido para auxiliar no controle de produtos, especialmente voltado para o setor alimentício. O projeto foi desenvolvido com arquitetura full-stack, separando backend e frontend para facilitar manutenção e escalabilidade.

O sistema permite que usuários cadastrem produtos no estoque, registrem produções que consomem esses produtos, visualizem o histórico de operações e gerenciem suas contas através de um sistema completo de autenticação.

### 1.1. Objetivos do Projeto

O Zero Waste foi criado para resolver problemas comuns na gestão de estoque de pequenos e médios negócios:

- **Controle de Entrada**: Cadastro de produtos recebidos com informações detalhadas (nome, quantidade, unidade de medida, fornecedor, data de recebimento)
- **Gestão de Produção**: Registro de produções que consomem produtos do estoque, com atualização automática dos saldos
- **Histórico Completo**: Visualização de todo o histórico de produções realizadas
- **Correção de Erros**: Sistema flexível de exclusão que permite estornar produtos ao estoque quando necessário
- **Segurança**: Sistema de autenticação completo com recuperação de senha via e-mail

### 1.2. Arquitetura do Sistema

O projeto segue uma arquitetura de **aplicação móvel híbrida** com backend RESTful:

```
┌─────────────────┐
│  React Native   │  ← Frontend (Mobile App)
│     (Expo)      │
└────────┬────────┘
         │ HTTP/REST
         │
┌────────▼────────┐
│  Node.js/Express│  ← Backend (API REST)
│   + Prisma      │
└────────┬────────┘
         │
┌────────▼────────┐
│   PostgreSQL    │  ← Banco de Dados
└─────────────────┘
```

## 2. Tecnologias Utilizadas ^

### 2.1. Backend

O backend foi desenvolvido utilizando tecnologias modernas e robustas:

**Node.js com Express**: Framework web rápido e minimalista para construção da API REST. O Express facilita o roteamento, tratamento de requisições e integração com middlewares.

```typescript
// Exemplo de rota da API
app.post('/produtos', async (req, res) => {
  try {
    const { nome, unidadeMedida, quantidadeRecebida, fornecedor, dataRecebimento } = req.body;
    
    if (!nome || !unidadeMedida || !quantidadeRecebida) {
      return res.status(400).json({ error: 'Nome, Unidade e Quantidade são obrigatórios.' });
    }
    
    const novoProduto = await prisma.produto.create({
      data: { nome, unidadeMedida, quantidade: quantidadeNumero, fornecedor, dataRecebimento }
    });
    
    return res.status(201).json(novoProduto);
  } catch (error) {
    return res.status(500).json({ error: 'Não foi possível cadastrar o produto.' });
  }
});
```

**Prisma ORM**: ORM (Object-Relational Mapping) que simplifica o acesso ao banco de dados PostgreSQL. O Prisma oferece type-safety, migrations automáticas e uma API intuitiva para operações de banco de dados.

**PostgreSQL**: Banco de dados relacional robusto e confiável, escolhido por sua performance e suporte a transações ACID, essenciais para operações críticas como atualização de estoque.

**bcryptjs**: Biblioteca para hash de senhas, garantindo que as senhas dos usuários sejam armazenadas de forma segura no banco de dados.

**Nodemailer**: Biblioteca para envio de e-mails, utilizada no sistema de recuperação de senha.

### 2.2. Frontend

O frontend foi desenvolvido como aplicativo móvel multiplataforma:

**React Native com Expo**: Framework que permite desenvolver aplicativos nativos para iOS e Android usando JavaScript e React. O Expo simplifica o processo de desenvolvimento e deploy.

**Expo Router**: Sistema de roteamento baseado em arquivos, similar ao Next.js, que facilita a navegação entre telas do aplicativo.

**Axios**: Cliente HTTP para realizar requisições à API backend.

**FontAwesome5**: Biblioteca de ícones utilizada para melhorar a interface visual do aplicativo.

### 2.3. Ferramentas de Desenvolvimento

- **TypeScript**: Superset do JavaScript que adiciona tipagem estática, melhorando a qualidade e manutenibilidade do código
- **ESLint**: Ferramenta de linting para manter a consistência do código
- **Git**: Sistema de controle de versão

## 3. Estrutura do Projeto ^

O projeto está organizado em uma estrutura modular que separa claramente as responsabilidades:

```
projetoMovel/
├── backend/                    # Servidor Node.js/Express
│   ├── src/
│   │   ├── controllers/        # Controladores (lógica de negócio)
│   │   │   └── AuthController.ts
│   │   └── server.ts           # Arquivo principal do servidor
│   ├── prisma/
│   │   ├── migrations/         # Migrações do banco de dados
│   │   └── schema.prisma       # Schema do banco de dados
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   └── projeto-app/            # Aplicativo React Native
│       ├── app/                 # Telas (rotas)
│       │   ├── index.tsx       # Tela de login
│       │   ├── register.tsx    # Tela de registro
│       │   ├── home.tsx        # Menu principal
│       │   ├── cadastrarProduto.tsx
│       │   ├── cadastrarProducao.tsx
│       │   ├── estoque.tsx
│       │   ├── esqueciSenha.tsx
│       │   └── verificarCodigo.tsx
│       ├── components/          # Componentes reutilizáveis
│       ├── constants/          # Constantes (ex: URL da API)
│       ├── assets/             # Recursos (fontes, imagens)
│       └── package.json
│
├── documentacao/               # Documentação do projeto
└── README.md
```

### 3.1. Modelos de Dados

O banco de dados possui três modelos principais:

**Produto**: Representa os itens em estoque
- `id`: Identificador único (UUID)
- `nome`: Nome do produto (único)
- `unidadeMedida`: Unidade de medida (Kg, Un, Cx, etc.)
- `quantidade`: Quantidade disponível em estoque
- `fornecedor`: Nome do fornecedor
- `dataRecebimento`: Data de recebimento do produto

**Usuario**: Representa os usuários do sistema
- `id`: Identificador único (UUID)
- `email`: E-mail do usuário (único)
- `nome`: Nome completo
- `senha`: Senha criptografada (hash bcrypt)
- `resetToken`: Token para recuperação de senha
- `resetTokenExpires`: Data de expiração do token

**Producao**: Representa os registros de produção
- `id`: Identificador único (UUID)
- `nomeProduto`: Nome do produto utilizado
- `quantidade`: Quantidade utilizada na produção
- `dataProducao`: Data da produção
- `observacao`: Observações adicionais (opcional)

## 4. Funcionalidades Principais ^

### 4.1. Sistema de Autenticação

O sistema possui um módulo completo de autenticação que inclui:

**Registro de Usuário**: Permite que novos usuários criem contas no sistema. As senhas são criptografadas usando bcrypt antes de serem armazenadas no banco de dados.

**Login**: Autenticação de usuários existentes através de e-mail e senha. O sistema valida as credenciais e retorna informações do usuário autenticado.

**Recuperação de Senha**: Sistema em duas etapas:
1. O usuário solicita a recuperação informando seu e-mail
2. O sistema gera um código de 6 dígitos e envia por e-mail
3. O usuário informa o código recebido e define uma nova senha
4. O código expira após 1 hora por questões de segurança

```typescript
// Exemplo: Geração de token de recuperação
const token = crypto.randomInt(100000, 999999).toString();
const agora = new Date();
agora.setHours(agora.getHours() + 1); // Expira em 1 hora

await prisma.usuario.update({
  where: { id: user.id },
  data: {
    resetToken: token,
    resetTokenExpires: agora
  }
});
```

### 4.2. Gestão de Produtos

**Cadastro de Produtos**: Interface intuitiva que permite cadastrar novos produtos no estoque. O sistema valida os campos obrigatórios (nome, unidade de medida e quantidade) antes de salvar.

**Listagem de Estoque**: Visualização de todos os produtos cadastrados com informações detalhadas, incluindo quantidade atual, unidade de medida e fornecedor.

### 4.3. Gestão de Produção

**Registro de Produção**: Ao registrar uma produção, o sistema:
1. Cria um registro no histórico de produções
2. Automaticamente reduz a quantidade do produto no estoque
3. Utiliza transações do banco de dados para garantir consistência

**Histórico de Produções**: Visualização completa de todas as produções realizadas, ordenadas por data (mais recentes primeiro).

**Exclusão Flexível**: Sistema inteligente de exclusão que oferece duas opções:
- **Limpar Lista**: Remove o registro do histórico, mas mantém a baixa no estoque (útil para limpeza de dados)
- **Excluir e Devolver**: Remove o registro e devolve a quantidade ao estoque (útil para correção de erros)

```typescript
// Exemplo: Exclusão com estorno opcional
if (deveDevolver) {
  await prisma.$transaction([
    prisma.producao.delete({ where: { id } }),
    prisma.produto.update({
      where: { id: produto.id },
      data: { quantidade: { increment: producao.quantidade } }
    })
  ]);
}
```

### 4.4. Interface do Usuário

O aplicativo possui uma interface moderna e intuitiva com:
- **Design Responsivo**: Adapta-se a diferentes tamanhos de tela
- **Navegação por Abas**: Facilita a alternância entre Estoque Atual e Histórico
- **Pull-to-Refresh**: Permite atualizar os dados deslizando a tela para baixo
- **Feedback Visual**: Alertas e mensagens claras para todas as operações
- **Ícones Informativos**: Uso de FontAwesome5 para melhorar a compreensão visual

## 5. Como Executar o Projeto ^

> **📌 Guia Completo de Instalação**: Para um guia detalhado com todas as dependências e instruções passo a passo, consulte o arquivo [INSTALACAO.md](./INSTALACAO.md)

### 5.1. Pré-requisitos

Antes de executar o projeto, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)
- **PostgreSQL** (banco de dados)
- **Expo CLI** (para desenvolvimento mobile)
- **Git** (controle de versão)

### 5.2. Configuração do Backend

1. Navegue até a pasta do backend:
```bash
cd backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente criando um arquivo `.env` na raiz da pasta `backend`:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/zero_waste?schema=public"
```

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3333`

### 5.3. Configuração do Frontend

1. Navegue até a pasta do aplicativo:
```bash
cd frontend/projeto-app
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API no arquivo `constants/api.ts`:
```typescript
export const API_URL = 'http://seu-servidor-backend.com';
```

4. Inicie o aplicativo:
```bash
npm start
```

5. Escaneie o QR code com o aplicativo Expo Go (disponível nas lojas de aplicativos) ou pressione `a` para Android ou `i` para iOS no emulador.

### 5.4. Configuração do E-mail (Recuperação de Senha)

Para que a funcionalidade de recuperação de senha funcione, é necessário configurar o Nodemailer no arquivo `backend/src/controllers/AuthController.ts`. O projeto está configurado para usar Mailtrap (serviço de teste de e-mail), mas pode ser adaptado para outros provedores.

## 6. Links Interessantes ^

### 6.1. Documentação Oficial

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)

### 6.2. Ferramentas Úteis

- [Postman](https://www.postman.com/) - Teste de APIs REST
- [DBeaver](https://dbeaver.io/) - Cliente gráfico para PostgreSQL
- [Expo Go](https://expo.dev/client) - Aplicativo para testar apps Expo
- [ngrok](https://ngrok.com/) - Túnel para expor servidor local (útil para desenvolvimento mobile)

### 6.3. Tutoriais e Recursos

- [React Native Tutorial](https://reactnative.dev/docs/tutorial)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Prisma Migrations Guide](https://www.prisma.io/docs/guides/migrate)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)

### 6.4. Comunidades e Suporte

- [React Native Community](https://github.com/facebook/react-native)
- [Expo Forums](https://forums.expo.dev/)
- [Stack Overflow - React Native](https://stackoverflow.com/questions/tagged/react-native)
- [Prisma Discord](https://pris.ly/discord)

## 7. Melhorias Futuras ^

O projeto pode ser expandido com as seguintes funcionalidades:

- **Relatórios e Gráficos**: Visualização de dados de estoque e produção em gráficos
- **Notificações Push**: Alertas quando produtos estão com estoque baixo
- **Múltiplos Usuários e Permissões**: Sistema de roles e permissões
- **Exportação de Dados**: Exportar relatórios em PDF ou Excel
- **Código de Barras**: Leitura de código de barras para cadastro rápido
- **Backup Automático**: Sistema de backup do banco de dados
- **API de Relatórios**: Endpoints para gerar relatórios customizados

## Conclusão ^

O **Zero Waste** é um sistema completo de gestão de estoque e produção que demonstra o uso de tecnologias modernas no desenvolvimento de aplicações full-stack. O projeto utiliza TypeScript para type-safety, Prisma para gerenciamento de banco de dados, React Native para o frontend móvel e Express para a API backend.

A arquitetura modular facilita a manutenção e expansão do sistema, enquanto as funcionalidades implementadas atendem às necessidades básicas de gestão de estoque. O sistema de autenticação robusto e a interface intuitiva tornam o aplicativo adequado para uso em produção.

Este projeto serve como uma base sólida para sistemas de gestão mais complexos e pode ser facilmente estendido conforme as necessidades do negócio evoluem.

---

**Desenvolvido com ❤️ usando tecnologias modernas**

