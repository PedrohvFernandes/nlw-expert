import { FastifyInstance } from 'fastify'
import z from 'zod'
import { prisma } from '../../lib/prisma'

export async function createPoll(app: FastifyInstance) {
  app.post('/polls', async (request, reply) => {
    const createPollSchemaBody = z.object({
      title: z.string().min(3).max(100),
      // As opções são um array de strings
      // as opções tem que ter no minimo 2 caracteres e no maximo 100 caracteres. E as opções dentro do array deve ter no minimo 2 opções e no maximo 10 opções
      options: z.array(z.string().min(2).max(100)).min(2).max(10)
    })

    // https://blog.rocketseat.com.br/tipos-de-parametros-nas-requisicoes-rest/
    // Body params
    //O ZOD ja Valida o corpo da requisição e o zod ja me retorna essas informações ja tipadas
    const { title, options } = createPollSchemaBody.parse(request.body)

    // if (!title) {
    //   return reply.status(400).send({ error: 'Title is required' })
    // }

    // if (title.length < 3) {
    //   return reply
    //     .status(400)
    //     .send({ error: 'Title must be at least 3 characters' })
    // }

    // if (!title.trim()) {
    //   return reply.status(400).send({ error: 'Title must not be empty' })
    // }

    // if (options.length < 2) {
    //   return reply
    //     .status(400)
    //     .send({ error: 'At least 2 options are required' })
    // }

    // if (options.length > 10) {
    //   return reply.status(400).send({ error: 'At most 10 options are allowed' })
    // }

    // Verifica se tem alguma opção vazia
    // O método some() testa se ao menos um dos elementos no array passa no teste implementado pela função atribuída e retorna um valor true ou false.
    // if (options.some(option => !option.trim())) {
    //   return reply.status(400).send({ error: 'Options must not be empty' })
    // }

    // Um array de objetos com as opções
    const optionsData = options.map(option => {
      // Para cada opção eu retorno um objeto com o title e o id do poll(se for usar a 1 opção de criação)
      return {
        title: option

        // Aqui eu so precisaria passar o id, caso fosse fazer da 1 maneira, porque a poll ja teria sido criada e teria como pegar o id dela, mas como estou fazendo da 2 maneira, eu deixo para o prisma relacionar e identificar automaticamente o id
        // pollId: poll.id
      }
    })

    // Com a conexão feita com o banco de dados, eu posso criar um novo poll acessando a tabela(model), passando somente o title como dado obrigatório
    // Lembrando que o banco de dados esta no docker, e o prisma ja esta configurado para acessar o banco de dados dentro da instancia do docker, entao verifique se o docker esta rodando e com as instancias ligadas dando o comando docker ps
    const poll = await prisma.poll.create({
      data: {
        title,
        // 2 opção de criar as opções para a enquete: dessa maneira ja criamos a tabela com as opções inseridas no bd e ja inserimos as opções relacionadas a enquete que esta sendo criada, o prisma ja faz a relação automaticamente, colocando o id da enquete na opção. Ou seja, as duas coisas estão sendo criadas ao mesmo tempo, se uma der erro a outra vai dar tambem, dando um rollback e desfazendo as operações
        options: {
          // Create many é para criar vários registros de uma vez
          createMany: {
            data: optionsData
          }
        }
      }
    })

    // 1 opção de criar as opções para a enquete: Dessa forma funcionaria, mas imagine se desse erro na criação de uma das opções, a outra opção ja teria sido criada e aí teria um poll sem opções ou com opções faltando. Cenario: A enquete teria sido criada, depois de um tempo a opção seria criada, mas supondo que a parte de opções deu um erro, a enquete continuaria criada no BD, enquanto as opções nao foram criadas, mostrando um erro no front, esse problema no banco de dados se chama transação. Transação basicamente é quando queremos fazer uma operação no bd e ela é atômica, ou seja, temos varias operações acontecendo ao mesmo tempo e a gente quer todos deem certos ou todos errados, ex: tenho 10 inserts(operações) e o ultimo de erro, então quero que de um rollback e desfaça todos os inserts, porque para eu garantir sucesso no front, todos tem que dar certo
    // Create many é para criar varios registros de uma vez
    /*
      await prisma.pollOption.createMany({
        data: optionsData
      })
    */

    // Http codes
    // Esse status code 201 é o status code de created e 200 é o status code de ok deu certo
    return reply.status(201).send({
      pollId: poll.id,
      title: poll.title,
      options
    })
  })
}
