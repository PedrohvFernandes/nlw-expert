import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../../lib/prisma'

export async function getPoll(app: FastifyInstance) {
  // Route params
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollId } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      // Fazendo um join com a tabela de options, dessa forma eu obtenho as opções que foram criadas para a enquete
      include: {
        // options: true  // vem todas as informações das opções
        options: {
          // Aqui eu posso escolher quais campos eu quero que venha
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return reply.send(poll)
  })
}
