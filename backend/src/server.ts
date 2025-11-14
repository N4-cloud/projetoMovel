// src/server.ts (VERSÃO FINAL COM RECUPERAÇÃO DE SENHA)

import dotenv from 'dotenv';
import path from 'path'; 
import bcrypt from 'bcryptjs';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';

// --- NOVO IMPORT: Controller de Recuperação de Senha ---
import { esqueciSenha, redefinirSenha } from './controllers/AuthController';
// -------------------------------------------------------

// 1. Carrega o .env manualmente
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// 2. Verifica se a variável foi carregada
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("ERRO CRÍTICO: A variável DATABASE_URL não foi carregada.");
  process.exit(1); 
}

console.log("DATABASE_URL carregada.");

// 3. Injeta a URL no Prisma
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

const app = express();
const port = 3333; 

// Middlewares
app.use(express.json());
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rota de teste
app.get('/', (req, res) => {
  return res.json({ message: 'API do Zero Waste no ar!' });
});

// -----------------------------------------------------
// ROTAS DE PRODUTOS (GET e POST)
// -----------------------------------------------------

// Listar Produtos
app.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({ orderBy: { nome: 'asc' } });
    return res.json(produtos);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
});

// Cadastrar Produto
app.post('/produtos', async (req, res) => {
  try {
    const { nome, unidadeMedida, quantidadeRecebida, fornecedor, dataRecebimento } = req.body;

    if (!nome || !unidadeMedida || !quantidadeRecebida) {
      return res.status(400).json({ error: 'Nome, Unidade e Quantidade são obrigatórios.' });
    }

    const quantidadeNumero = parseFloat(quantidadeRecebida);

    const novoProduto = await prisma.produto.create({
      data: {
        nome, unidadeMedida, quantidade: quantidadeNumero, fornecedor, dataRecebimento
      },
    });

    return res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error); 
    return res.status(500).json({ error: 'Não foi possível cadastrar o produto.' });
  }
});

// -----------------------------------------------------
// ROTAS DE PRODUÇÃO (GET, POST e DELETE)
// -----------------------------------------------------

// Listar Histórico de Produção
app.get('/producao', async (req, res) => {
  try {
    const producoes = await prisma.producao.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.json(producoes);
  } catch (error) {
    console.error("Erro ao buscar produções:", error);
    return res.status(500).json({ error: 'Erro ao buscar histórico.' });
  }
});

// Cadastrar Produção (e Baixar Estoque)
app.post('/producao', async (req, res) => {
  try {
    const { produtoId, nomeProduto, quantidade, dataProducao, observacao } = req.body;

    if (!produtoId || !quantidade) {
      return res.status(400).json({ error: 'Selecione um produto e informe a quantidade.' });
    }

    const qtdUsada = parseFloat(quantidade);

    const produtoNoBanco = await prisma.produto.findUnique({ where: { id: produtoId } });

    if (!produtoNoBanco) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Transação: Cria Produção + Baixa Estoque
    const [producaoCriada, produtoAtualizado] = await prisma.$transaction([
      prisma.producao.create({
        data: { nomeProduto, quantidade: qtdUsada, dataProducao, observacao }
      }),
      prisma.produto.update({
        where: { id: produtoId },
        data: { quantidade: { decrement: qtdUsada } }
      })
    ]);

    return res.status(201).json({
      message: 'Produção registrada e estoque atualizado!',
      novoSaldo: produtoAtualizado.quantidade
    });

  } catch (error) {
    console.error("Erro na produção:", error);
    return res.status(500).json({ error: 'Erro interno ao processar produção.' });
  }
});

// Excluir Produção (Com opção de Estorno)
app.delete('/producao/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { devolver } = req.query; // Lê ?devolver=true/false

    const deveDevolver = devolver === 'true';

    const producao = await prisma.producao.findUnique({ where: { id } });

    if (!producao) {
      return res.status(404).json({ error: 'Registro não encontrado.' });
    }

    if (deveDevolver) {
      // OPÇÃO A: ESTORNO
      const produto = await prisma.produto.findFirst({
        where: { nome: producao.nomeProduto },
      });

      if (produto) {
        await prisma.$transaction([
          prisma.producao.delete({ where: { id } }),
          prisma.produto.update({
            where: { id: produto.id },
            data: { quantidade: { increment: producao.quantidade } }
          })
        ]);
        return res.status(200).json({ message: 'Erro corrigido: Estoque devolvido.' });
      }
    }

    // OPÇÃO B: LIMPEZA APENAS
    await prisma.producao.delete({ where: { id } });
    
    return res.status(200).json({ message: 'Registro limpo do histórico.' });

  } catch (error) {
    console.error("Erro ao excluir:", error);
    return res.status(500).json({ error: 'Erro interno.' });
  }
});

// -----------------------------------------------------
// ROTAS DE AUTENTICAÇÃO (Login, Registro e Recuperação)
// -----------------------------------------------------

// --- NOVAS ROTAS DE "ESQUECI A SENHA" ---
app.post('/auth/esqueci-senha', esqueciSenha);
app.post('/auth/redefinir-senha', redefinirSenha);
// -----------------------------------------

app.post('/auth/registrar', async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ error: 'Dados incompletos.' });
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash }, 
    });
    return res.status(201).json({ id: novoUsuario.id, email: novoUsuario.email });
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Dados incompletos.' });

    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado.' });

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) return res.status(400).json({ error: 'Senha incorreta.' });

    return res.status(200).json({
      id: usuario.id, nome: usuario.nome, email: usuario.email,
      message: 'Login bem-sucedido!',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Erro no login.' });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando em http://localhost:${port}`);
});