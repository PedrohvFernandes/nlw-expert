import { PrismaClient } from '@prisma/client'

// Conexão com o banco de dados
export const prisma = new PrismaClient({
  // quando eu criar uma enquete eu quero que me retorne as opções que foram criadas
  log: ['query']
})
