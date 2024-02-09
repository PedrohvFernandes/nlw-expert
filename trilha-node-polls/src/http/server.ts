import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

// Servidor HTTP
// const app = fastify({ logger: true });
const app = fastify()

// Conexão com o banco de dados
const prisma = new PrismaClient()

// Minhas rotas
app.post('/polls', async (request, reply) => {
  const createPollSchemaBody = z.object({
    title: z.string()
  })

  //O ZOD ja Valida o corpo da requisição e o zod ja me retorna essas informações ja tipadas
  const { title } = createPollSchemaBody.parse(request.body)

  if (!title) {
    return reply.status(400).send({ error: 'Title is required' })
  }

  if (title.length < 3) {
    return reply
      .status(400)
      .send({ error: 'Title must be at least 3 characters' })
  }

  if (!title.trim()) {
    return reply.status(400).send({ error: 'Title must not be empty' })
  }

  // Com a conexao feita com o banco de dados, eu posso criar um novo poll acessando a tabela(model), passando somente o title como dado obrigatório
  // Lembrando que o banco de dados esta no docker, e o prisma ja esta configurado para acessar o banco de dados dentro da instancia do docker, entao verifique se o docker esta rodando e com as instancias ligadas dando o comando docker ps
  const poll = await prisma.poll.create({
    data: {
      title
    }
  })

  // Http codes
  // Esse status code 201 é o status code de created e 200 é o status code de ok deu certo
  return reply.status(201).send({ pollId: poll.id, title: poll.title })
})

app.listen({ port: 3333, host: '' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})
