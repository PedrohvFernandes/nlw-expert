import { FastifyInstance } from 'fastify'
import { voting } from '../../utils/voting-pub-sub'
import z from 'zod'

//npm i @fastify/websocket, primeiro configuramos no server.ts o websocket e depois podemos usar ele aqui
// Agora estamos criando uma rota que utiliza o websocket
export async function pollResults(app: FastifyInstance) {
  app.get(
    '/polls/:pollId/results',
    { websocket: true },
    async (connection, request) => {
      // https://www.npmjs.com/package/@fastify/websocket
      // connection.socket.on('message', (message: string) => {
      //   connection.socket.send(`You sent ${message}`)
      // })

      const getPollParams = z.object({
        pollId: z.string().uuid()
      })

      const { pollId } = getPollParams.parse(request.params)

      // Pub/Sub - publish subscribers
      // Inscrever apenas nas mensagens publicadas no canal específico, ou seja, canal com o ID da enquete(`{pollId}`)
      // Usando WS para ouvir a mensagem que foi publicada no canal da enquete, na rota vote-on-poll.ts
      voting.subscribe(pollId, subscribeMessage => {
        // Envia a mensagem para o cliente
        connection.socket.send(JSON.stringify(subscribeMessage))
      })
    }
  )
}

// Pub/Sub - publish subscribers  -> pattern para trabalhar com aplicações que lidam com eventos. eventos nada mais que algo aconteceu na minha aplicação e eu quero que outras partes da minha aplicação saibam que isso aconteceu. Ex: alguem se cadastra e é enviado um email para o usuario, o cadastro é um evento e o envio do email é outro evento. O pub/sub é um pattern que nos ajuda a lidar com esses eventos, ele é um intermediario entre quem esta emitindo o evento e quem esta ouvindo o evento. Ele é um intermediario que recebe os eventos e distribui para quem esta ouvindo. O pub/sub é um pattern muito utilizado em aplicações que precisam lidar com eventos, como por exemplo, chat, notificações, etc. Ou seja, esse pattern ta relacionado a efeitos colaterais na aplicação, que por uma coisa fez outra coisa.

//pub/sub -> é um pattern onde eu publico mensagens em uma lista, essas mensagens podem ter formatos especificos, so que o mais importante é eu dividir essa mensagens em canais. Quando eu uso esse pattern eu começo a criar canais, canais é como se fossem chats, eu consigo categorizar minhas mensagens
