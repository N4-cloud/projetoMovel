// src/server.ts (VERSÃO FINAL COMPLETA com CORS)

import dotenv from 'dotenv';
import path from 'path'; 
import bcrypt from 'bcryptjs';

// 1. Carrega o .env manualmente, usando o caminho exato
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// 2. Verifica se a variável foi carregada
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  // Se não carregou, para o app com um erro claro
  console.error("ERRO CRÍTICO: A variável DATABASE_URL não foi carregada.");
  console.error("Verifique se o arquivo .env existe na raiz do projeto.");
  process.exit(1); 
}

// 3. Log de depuração para vermos o que foi lido
console.log("DATABASE_URL foi carregada com sucesso.");
console.log("Valor lido pelo servidor:", databaseUrl);


import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors'; // <-- NOVO: IMPORTA O CORS

// 4. Injeta a URL explicitamente no PrismaClient
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl, // Usa a variável que acabamos de verificar
    },
  },
});

const app = express();
const port = 3333; 

// Middlewares
app.use(express.json()); // Middleware para o servidor "entender" JSON

app.use(cors({
  origin: '*', // Permite QUALQUER origem (bom para desenvolvimento com ngrok)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Permite os métodos comuns + OPTIONS
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite os cabeçalhos comuns
})); // <-- NOVO: HABILITA O CORS (permite conexões do seu app)

// Rota de teste
app.get('/', (request, response) => {
  return response.json({ message: 'API do Zero Waste no ar!' });
});

// Rota para CRIAR um novo produto
// (Esta rota está incompleta, só salva nome e unidade. Vamos corrigir depois)
app.post('/produtos', async (request, response) => {
  try {
    // Vamos atualizar para receber todos os dados (passo da mensagem anterior)
    const { nome, unidadeMedida, quantidadeRecebida, fornecedor, dataRecebimento } = request.body;

    // Validação
    if (!nome || !unidadeMedida || !quantidadeRecebida) {
      return response.status(400).json({ error: 'Nome, Unidade e Quantidade são obrigatórios.' });
    }

    // Conversão de Tipo
    const quantidadeNumero = parseFloat(quantidadeRecebida);

    // Salvar todos os dados
    const novoProduto = await prisma.produto.create({
      data: {
        nome: nome,
        unidadeMedida: unidadeMedida,
        quantidade: quantidadeNumero,
        fornecedor: fornecedor,
        dataRecebimento: dataRecebimento
      },
    });

    return response.status(201).json(novoProduto);

  } catch (error) {
    // Se algo der errado, o erro aparecerá aqui
    console.error("Erro ao cadastrar produto:", error); 
    return response.status(500).json({ error: 'Não foi possível cadastrar o produto.' });
  }
});

// -----------------------------------------------------
// 1. ROTA PARA REGISTRAR UM NOVO USUÁRIO
// -----------------------------------------------------
app.post('/auth/registrar', async (request, response) => {
  try {
    const { nome, email, senha } = request.body;

    // Validação
    if (!nome || !email || !senha) {
      return response.status(400).json({ error: 'Nome, e-mail e senha são obrigatórios.' });
    }

    // Hashear a senha (o "embaralhamento")
    const senhaHash = await bcrypt.hash(senha, 10); // O "10" é o custo do hash

    // Salvar o usuário no banco
    const novoUsuario = await prisma.usuario.create({
      data: {
        nome: nome,
        email: email,
        senha: senhaHash, // Salva a senha hasheada!
      },
    });

    // Não retorne a senha, mesmo hasheada.
    return response.status(201).json({
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
    });

  } catch (error) {
    // Tratamento de erro (ex: e-mail já existe)
    console.error("Erro ao registrar usuário:", error);
    return response.status(500).json({ error: 'Não foi possível registrar o usuário. O e-mail pode já estar em uso.' });
  }
});


// -----------------------------------------------------
// 2. ROTA PARA FAZER LOGIN (A QUE VOCÊ PEDIU)
// -----------------------------------------------------
app.post('/auth/login', async (request, response) => {
  try {
    const { email, senha } = request.body;

    if (!email || !senha) {
      return response.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    // 1. Encontrar o usuário pelo e-mail
    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email,
      },
    });

    // 2. Se o usuário não for encontrado
    if (!usuario) {
      return response.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // 3. Verificar a senha
    // Compara a senha que o usuário digitou (senha) com a senha hasheada no banco (usuario.senha)
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return response.status(400).json({ error: 'Senha incorreta.' });
    }

    // 4. SUCESSO!
    // Não retorne a senha
    return response.status(200).json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      message: 'Login bem-sucedido!',
    });

  } catch (error) {
    console.error("Erro no login:", error);
    return response.status(500).json({ error: 'Ocorreu um erro interno.' });
  }
});


// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});