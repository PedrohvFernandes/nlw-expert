import fastify from 'fastify'
import { fastifyCookie } from '@fastify/cookie'
import { fastifyWebsocket } from '@fastify/websocket'

import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import { pollResults } from './ws/poll-results'

// Servidor HTTP
// const app = fastify({ logger: true });
const app = fastify()

// Ajuda a trabalhar com cookies
// https://www.npmjs.com/package/@fastify/cookie
app.register(fastifyCookie, {
  secret: 'polls-app-nlw', // for cookies signature -> é para que algum  usuario nao consiga alterar o seu id para outro id de outro usuario. Assinar o cookie é uma forma de garantir que aquele cookie que o usuario esta enviando foi gerado pela nossa aplicação e ai o usuario nao pode ir la colocar o id de outro usuario e votar por outro usuario, ele não vai conseguir fazer isso, porque a nossa aplicação vai saber que aquele cookie foi alterado
  hook: 'onRequest' // set to false to disable cookie autoparsing or set autoparsing on any of the following hooks: 'onRequest', 'preParsing', 'preHandler', 'preValidation'. default: 'onRequest' --> essa função ela faz com que antes de todas as requisições feitas para o nosso back-end, no momento da requisição(onRequest), esse plugin entre em ação e faça o parse dos cookies, ou seja, busque ali nas requisições quais são os cookies e coloque ele num objeto para ser de mais facil acesso dentro da minha rota

  // parseOptions: {} // options for parsing cookies
})

app.register(fastifyWebsocket)

// Minhas rotas
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)

// ws
app.register(pollResults)

app.listen({ port: 3333, host: '' }, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})
