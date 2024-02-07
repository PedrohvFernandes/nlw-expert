// O * pega todas importações do Radix react dialog e coloca no objeto Dialog. Dessa maneira por exemplo se eu precisar usar o root, eu posso usar Dialog.Root, com isso vou saber que é do Radix
import * as Dialog from '@radix-ui/react-dialog'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { X } from 'lucide-react'

interface INoteCardProps {
  // Melhor pratica é usar Readonly para garantir que a propriedade não será alterada
  // Outra pratica boa é ditar o que é esse date e content, no caso note. logo o dev ja vai saber para que essa data e conteudo serve
  note: {
    date: Date
    content: string
  }
}

export function NoteCard({ note }: Readonly<INoteCardProps>) {
  return (
    <Dialog.Root>
      {/* // Ring é uma borda que aparece quando o elemento é focado, mas que na
      real é um shadow // o focus visible é para quando o elemento é focado, ele
      aparece, por exemplo com tab // o focus normal aplica o css quando o
      elemento é focado ou clicado */}
      {/* Trigger nada mais é que um button */}
      <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative hover:ring-2  hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-300">
          {/* Como é uma data é necessario converter ela para string
           O método toISOString() retorna uma cadeia de caracteres (string) simplificada no formato ISO extendido (ISO 8601), que é sempre 24 ou 27 caracteres de tamanho (YYYY-MM-DDTHH:mm:ss.sssZ ou ±YYYYYY-MM-DDTHH:mm:ss.sssZ, respectivamente). O fuso horário é sempre o deslocamento zero UTC, como denotado pelo sufixo "Z".
          */}
          {/* {note.date.toISOString()} */}

          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>
        <p className="text-sm leading-6 text-slate-400">{note.content}</p>

        {/* 
          	Cria um sombreamento dando ideia que tem mais coisa ara baixo
            h-1/2 -> ocupa metade da altura do elemento 50%
            bg-gradient-to-t -> gradiente de baixo para cima
            from-black/60 to-black/0 -> de preto com 60% de opacidade para preto com 0% de opacidade
        */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      {/* O portal faz com que o conteudo nao seja mostrado a onde exatamente estou clicando, como um proximo elemento e sim em outro lugar, por exemplo no final do body, ou seja, ele é renderizado em outro lugar, ou por cima de tudo virando um modal
       */}
      <Dialog.Portal>
        {/* 
          O overlay é o fundo que aparece quando o dialog é aberto, ou seja, quando o dialog é aberto, o fundo fica escuro, e quando é fechado, o fundo volta ao normal
          inset-0 -> ocupa toda a tela, right-0 -> ocupa toda a tela a direita, left-0 -> ocupa toda a tela a esquerda, top-0 -> ocupa toda a tela em cima, bottom-0 -> ocupa toda a tela em baixo
          fixed -> fixa o elemento na tela, ou seja, ele não se move quando a tela é rolada
        */}
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        {/* Content é o conteudo que vai aparecer dentro quando clicar no button 
        
          left-1/2 top-1/2 -> coloca o elemento no meio da tela(quase centralizado), por que quase ? porque o ponto de referencia de um elemento é o canto superior esquerdo, então para centralizar é necessário colocar o ponto de referencia no meio do elemento, para isso é necessário usar o transform translate, que faz com que o ponto de referencia do elemento seja o meio, ou seja, o elemento é deslocado para a esquerda e para cima, dessa forma o ponto de referencia do elemento é o meio. Se eu nao fizer isso e colocar um tamanho fixo no elemento, ele vai parecer que não esta centralizado, porque o ponto de referencia é o canto superior esquerdo

          -translate-x-1/2 -> desloca o elemento horizontalmente para a esquerda em -50% do tamanho do elemento, ou seja, o ponto de referencia do elemento é o meio

          -translate-y-1/2 -> desloca o elemento verticalmente para cima em -50% do tamanho do elemento, ou seja, o ponto de referencia do elemento é o meio

          overflow-hidden -> esconde o conteudo que passa do tamanho do elemento, ou seja, se o conteudo passar do tamanho do elemento, ele vai ser escondido. Nesse caso pela div ter bordas arredondadas, o button por padrão passa por cima disso, então acaba que tira o efeito de borda arredondada no final da div, para resolver isso é necessário colocar overflow-hidden, para que o conteudo que passar do tamanho do elemento seja escondido, porque é como se o button(de apagar a nota) estivesse por cima da div. Entao o overflow-hidden faz com que qualquer elemento interno que ocupe mais espaço do que o elemento pai, seja escondido
        */}
        <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          {/* Close- botão de fechamento 
            p-1.5 -> padding de 1.5 x 4 = 6px(Lembrando que o tailwindCss segue esse padrão por conta dos design systems)
          */}
          <Dialog.Close className="absolute top-5 right-5 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
            {/* <X className='w-5 h-5'/> */}
            <X className="size-5" />
          </Dialog.Close>

          {/* 
            flex-1 -> ocupa todo o espaço disponivel, se tiver mais de um elemento com flex-1, eles vão dividir o espaço igualmente. Se tiver um elemento com flex-1 e outro com flex-2, o que tem flex-2 vai ocupar o dobro do espaço do que tem flex-1.  Se tiver um elemento com flex-1 e outro com flex-auto, o que tem flex-1 vai ocupar todo o espaço disponivel e o que tem flex-auto vai ocupar o espaço que ele precisa. o flex-1 é basicamente 3 coisas, flex-grow: 1, flex-shrink: 1, flex-basis: 0, o flex-grow: 1 faz com que o elemento cresça, o flex-shrink: 1 faz com que o elemento encolha com base no que ele precisa ou quantos irmãos estiverem dentro de uma div(ex: Content) em flex, se nao tiver em flex o flex-1 nao funciona, o flex-basis: 0 faz com que o elemento comece do 0, ou seja, ele começa do 0 e cresce, e encolhe, ou seja, ele ocupa todo o espaço disponivel
          */}
          <div className="flex flex-col flex-1 gap-3 p-5">
            <span className="text-sm font-medium text-slate-300">
              {/* 
                formatDistanceToNow -> formata a data para o tempo que passou desde a data até agora
                ptBR -> é o idioma que vai ser usado para formatar a data
                addSuffix: true -> adiciona um sufixo a data, por exemplo, se a data for 1 minuto atras, ele vai adicionar "há um minuto atrás"
              */}
              {formatDistanceToNow(note.date, {
                locale: ptBR,
                addSuffix: true
              })}
            </span>
            <p className="text-sm leading-6 text-slate-400">{note.content}</p>
          </div>

          {/*
            group -> é um grupo, o que eu colocar como estilo no pai, vai ser aplicado nos filhos, por exemplo, se eu colocar um hover no pai, o filho vai receber o hover... Ou seja, quando o meu group(pai) receber um hover, o button(filho) vai receber um underline
          */}
          <button
            type="button"
            className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group"
          >
            Deseja{' '}
            <span className="text-red-400 group-hover:underline group-focus-visible:underline">
              apagar essa nota
            </span>{' '}
            ?
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
