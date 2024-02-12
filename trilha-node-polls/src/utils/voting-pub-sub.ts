// Parametros que são passados para a função que se inscreve no canal. Sao as informações que estamos carregando para enviar para o front, pra dizer quais são nos novos votos, qual opção foi votada, quantos votos tem, etc
// Ou seja, cada vez que uma mensagem for publicada dentro de um canal, essa mensagem vai conter sempre essas informações: qual foi a opção que recebeu o voto(pollOptionId) e quantos votos ela tem naquele momentos(votes)
type Message = {
  pollOptionId: string
  votes: number
}

// As funções que se inscrevem no canal, ou seja, que estão visualizando os resultados daquela enquete
// Cada inscrito recebe uma mensagem no formato do type Message
type Subscriber = (message: Message) => void

// Estrutura de um PubSub simples para votação
// Basicamente o pattern pub/sub é isso, eu tenho uma função que publica as mensagens e eu tenho uma função que se inscreve para receber as mensagens.
class VotingPubSub {
  // toda estrutura de pub/sub é baseada em canais, ou seja, eu tenho um canal e eu tenho mensagens que são publicadas nesse canal e eu tenho pessoas que estão inscritas nesse canal para receber essas mensagens. E canais é como se fossem chats, e a pessoa so quer receber mensagem de um chat ou chats especificos, ou seja, ela so quer receber de uma enquete especifica, ela so quer acompanhar uma enquete especifica em tempo real e nao de todas, somente aquela ou aquelas que ele esta acompanhando(conversado) que ele se inscreveu.

  // Entao entendendo isso, eu crio uma estrutura onde cada enquete vai ter o seu proprio canal e somente as pessoas que estao visualizando os resultados daquela enquete vão receber essas infos  em tempo real.
  // Os canais são objetos, onde a chave é o id da enquete e o valor é um array de funções, as funçãos são as pessoas que estão inscritas naquele canal, ou seja, que estão visualizando os resultados daquela enquete. Entao toda vez que eu enviar uma mensagem para aquele canal, eu vou chamar todas as funções que estão inscritas naquele canal, ou seja, todas as pessoas que estão visualizando os resultados daquela enquete vao receber a mensagem que eu enviei.
  // Se eu tiver dois usuarios na tela de resultados daquela enquete aberta, são dois inscritos(user) naquele canal, recebendo a mensagem de votos daquela enquete
  // private channels: { [key: string]: Function[] } = {}
  private channels: Record<string, Subscriber[]> = {}

  // Função que se inscreve no canal
  subscribe(pollId: string, subscriber: Subscriber) {
    // Se dentro dos canais nao existir um canal com o id da enquete, eu crio um canal com o id da enquete. Ou seja se nenhuma pessoa não assinou os resultados daquela enquete, eu crio um canal para ela
    if (!this.channels[pollId]) {
      this.channels[pollId] = []
    }

    // Adiciono a função(user) inscrita no canal
    this.channels[pollId].push(subscriber)
  }

  // Envia as mensagens para todos inscritos no canal
  publish(pollId: string, message: Message) {
    // Se o canal nao existir, eu nao faço nada. Se nao tiver nenhum inscrito naquele canal com aquele id, eu nao faço nada
    if (!this.channels[pollId]) {
      return
    }

    // Mando a mensagem para todos inscritos no canal. Para cada inscrito naquele canal(pollId), eu chamo a função dele e passo a mensagem. Porque o canal é um objeto como chave(id da poll) e como valor ele tem um array de funções, ou seja, cada inscrito é uma função, entao eu chamo a função dele e como parametro eu passo a mensagem
    this.channels[pollId].forEach(subscriber => subscriber(message))
    // for(const subscriber of this.channels[pollId]) {
    //   subscriber(message)
    // }
  }
}


export const voting = new VotingPubSub()