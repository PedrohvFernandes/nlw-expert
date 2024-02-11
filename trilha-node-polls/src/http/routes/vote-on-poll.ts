import z from 'zod'

import { randomUUID } from 'node:crypto'

import { FastifyInstance } from 'fastify'
import { prisma } from '../../lib/prisma'

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    })

    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    })

    const { pollOptionId } = voteOnPollBody.parse(request.body)
    const { pollId } = voteOnPollParams.parse(request.params)

    // Verificar se o sessionId está presente nos cookies, se tiver, eu vou pegar o id do usuario
    // let sessionId = request.cookies.sessionId

    // podemos desestruturar o sessionId do request.cookies
    // O primeiro é o uuuid, o segundo é o valor do cookie assinatura do cookie
    // Ex: "sessionId": "8e9ce9ce-8d9e-4585-8fa2-7862ce86ca0f.ihWmYFVQrvH1868GldmUwhpuOtHN6pRF1ugx6kB9v2c"
    let { sessionId } = request.cookies

    // Se o usuario tem um sessionId eu sei que ja votou alguma vez, então eu verifico se ele ja votou nessa enquete
    if (sessionId) {
      // Recuperamos o voto do usuario na enquete
      const userPreviousVoteOnPoll = await prisma.vote.findUnique({
        where: {
          // sessionId e pollId são chaves compostas, onde temos o id do user e o id da enquete. Com esse indice, eu consigo buscar um voto especifico de um usuario em uma enquete de uma forma muito rapida.
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      })

      // Se o usuario ja votou nessa enquete mas a  opção que ele votou é diferente da opção que ele esta tentando votar agora, eu deixo ele votar, apagando a anterior, se não eu retorno um erro
      if (
        userPreviousVoteOnPoll &&
        userPreviousVoteOnPoll.pollOptionId !== pollOptionId
      ) {
        // Eu apago o voto anterior e deixo ele votar de novo. Pelo fato daqui nao ter return eu nao preciso repetir o codigo de criar um voto, pois o codigo vai continuar a execução e a parte de criar um voto vai ser executada
        await prisma.vote.delete({
          where: {
            // Como eu tenho o id do voto, eu posso apagar ele, nao precisa repetir o where que esta em userPreviousVoteOnPoll, so reaproveitar o id do voto achado.
            id: userPreviousVoteOnPoll.id
          }
        })
      } else if (userPreviousVoteOnPoll) {
        return reply.status(400).send({
          message: 'User already voted on this poll'
        })
      }
    }

    // Se o usuario nao tiver um sessionId, é criado um novo
    // Quando o usuario votar, eu vou salvar dentro dos cookies, que é um storage que eu consigo acessar dentro de todas as requisições, um id para ele, um id unico
    if (!sessionId) {
      sessionId = randomUUID()
      // Vamos enviar um cookie, o cookie nada mais é que um cabeçalho
      // É um pouco ruim lidar com cookies, por conta da sua sintaxe diferente, por isso instalamos esse modulo: npm i @fastify/cookie e configurar no server.ts, ele nos ajuda a trabalhar com cookie na nossa aplicação fastify https://www.npmjs.com/package/@fastify/cookie
      // Nome do cookie, valor e algumas opções
      // opções: path -> indica em quais rotas vai estar disponivel meu cookie
      reply.setCookie('sessionId', sessionId, {
        path: '/', //Todas as rotas vão ter acesso a esse cookie
        maxAge: 60 * 60 * 24 * 30, //Por quanto tempo esse cookie vai ficar salvo: 60 segundos(1 min), 60 minutos(1 hora), 24 horas(1 dia) e 30 dias(1 mês) -? 30 days disponivel
        signed: true, // O usuario nao vai conseguir modificar manualmente esse cookie, é um cookie assinado, um cookie assinado, signfica que meu back-end ele vai garantir que essa info foi gerada pelo nosso back-end e nao foi modificada pelo usuario
        httpOnly: true // O cookie nao vai ser acessível pelo js no front-end, só pelo servidor. Caso o user tenha um script malicioso, ele nao vai conseguir acessar o cookie, alguma extensão maliciosa, nao vai conseguir acessar o cookie. Porque muitos ataques são feitos através de varredura de cookies de autenticação
      })
    }

    // Criando um voto na opção selecionada de tal enquete
    await prisma.vote.create({
      data: {
        sessionId,
        pollId,
        pollOptionId
      }
    })

    return reply.status(201).send()
  })
}
