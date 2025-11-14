import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs'; // <--- 1. IMPORTE O BCRYPT AQUI

const prisma = new PrismaClient();

// --- CONFIGURAÇÃO DO MAILTRAP ---
const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "296f74f409b9bd", 
    pass: "48a6a2ee4991a8" 
  }
});

// Rota 1: Esqueci a Senha
export const esqueciSenha = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'E-mail não encontrado.' });
    }

    const token = crypto.randomInt(100000, 999999).toString();
    const agora = new Date();
    agora.setHours(agora.getHours() + 1);

    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        resetToken: token,
        resetTokenExpires: agora
      }
    });

    await transport.sendMail({
      from: 'Suporte <nao-responda@app.com>',
      to: email,
      subject: 'Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Recuperação de Senha</h2>
          <p>Olá, <strong>${user.nome}</strong>!</p>
          <p>Seu código para redefinir a senha é:</p>
          <h1 style="color: #007bff; letter-spacing: 5px;">${token}</h1>
          <p>Este código expira em 1 hora.</p>
        </div>
      `
    });

    return res.json({ message: 'E-mail enviado com sucesso!' });

  } catch (error) {
    return res.status(500).json({ error: 'Erro ao enviar e-mail.' });
  }
};

// Rota 2: Redefinir Senha
export const redefinirSenha = async (req: Request, res: Response) => {
  const { email, token, novaSenha } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (user.resetToken !== token) {
      return res.status(400).json({ error: 'Código inválido.' });
    }

    const agora = new Date();
    // @ts-ignore 
    if (agora > user.resetTokenExpires!) {
      return res.status(400).json({ error: 'Código expirado.' });
    }

    // --- 2. FAÇA O HASH DA NOVA SENHA ---
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    
    await prisma.usuario.update({
      where: { id: user.id },
      data: {
        senha: senhaHash, // <--- 3. SALVE O HASH (NÃO O TEXTO PURO)
        resetToken: null,
        resetTokenExpires: null
      }
    });

    return res.json({ message: 'Senha alterada com sucesso!' });

  } catch (error) {
    console.error(error); // Adicionado para ver erros no terminal
    return res.status(500).json({ error: 'Erro ao redefinir senha.' });
  }
};