import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma, redis } from '../../lib'

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

    if (!poll) {
      return reply.status(404).send({ error: 'Poll not found' })
    }

    // O zrange retorna um ranking(array) atraves de uma chave(da enquete que tem como objeto os obejtos das opções com os scores dentro) e intervalo(da posição 0 ate -1, ou seja, todas as opções, daria pra fazer por exemplo top 3 das opções mais votadas: 0, 3). WITHSCORES -> isso faz com que o zrange retorne os scores das opções tambem, alem de mostrar as opções
    const result = await redis.zrange(
      `poll:${pollId}:votes`,
      0,
      -1,
      'WITHSCORES'
    )

    // Para manipular o array que foi retornado pelo zrange, eu posso usar o reduce, que é uma função que transforma(converter) um array em um unico valor, no caso eu quero transformar o array em um objeto, onde o id da opção é a chave String e o score é o valor Number
    // Primeiro parametro é o objeto que eu quero que seja retornado, o segundo é cada item(linha) do array, o terceiro é o index do array
    // A logica: os indices pares do array são os ids das opções, os indices impares são os scores das opções
    const votes = result.reduce((obj, lineItem, index) => {
      // Se o index for par, ou seja, se na divisão o restante sobrar 0(% 2 === 0), eu pego o id da opção e coloco como chave do objeto, aproveito o index para pegar o score que esta na proxima posição(index) do array.
      /*
      Exemplo:
      index 0: id da opção
            + 1: score da opção = index 1 proxima linha do array, score do id da opção
      index 1: score da opção

      index 2: id da opção
            + 1: score da opção = index 3 proxima linha do array, score do id da opção
      index 3: score da opção

      index 4: ...
      */
      if (index % 2 === 0) {
        // const score = Number(result[index + 1])

        // obj[lineItem] = score

        // Pode fazer assim tambem. Porque esse metodo assign ele mescla dois objetos, no caso o obj e o objeto que esta sendo retornado, que é o objeto que tem a chave como id da opção e o valor como score da opção
        const score = result[index + 1]
        // Usamos a linha(lineItem) atual como chave e o score como valor, que nada mais é a proxima linha do array(index + 1) que é retornado pelo zrange(result). ou seja, se na linha do index 0 tem o id da opção, na linha 1 tem o score da opção
        Object.assign(obj, { [lineItem]: Number(score) })
      }
      return obj
    }, {} as Record<string, number>)

    return reply.send({
      poll: {
        id: poll.id,
        title: poll.title,
        options: poll.options.map(option => ({
          id: option.id,
          title: option.title,
          // score: option.id in votes ? votes[option.id] : 0
          // Se o id da opção esta no objeto votes, eu pego o score dela, se nao eu coloco 0
          // Ou seja o votes é um objeto que tem como chave o id da opção e como valor dessa chave é o score da opção
          score: votes[option.id] || 0
        }))
      }
    })
  })
}
