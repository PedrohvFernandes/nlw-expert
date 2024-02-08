import * as Dialog from '@radix-ui/react-dialog'
import { X, Mic } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import profanity from 'profanity-js'

import { ButtonOptions } from './button-options'

interface INewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: Readonly<INewNoteCardProps>) {
  // Por que should no começo ? porque é uma variavel que vai dizer se algo deve ser feito ou não(uma pergunta de sim ou nao) ou seja, é uma variavel que vai dizer se algo deve ser mostrado ou não. Regra de clean code
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  // Quando uma ação que vier do usuario começar o nome da fuction com handle indicando ação
  function handleStartEditor() {
    setShouldShowOnboarding(prev => !prev)
  }

  // <> -> generic, ou seja, é um tipo generico, que pode ser qualquer coisa, nesse caso é um tipo generico de um evento do tipo ChangeEvent que é um evento de mudança, que é o textarea
  function handleContentChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value)
    if (event.target.value === '') {
      setShouldShowOnboarding(prev => !prev)
    }
  }

  // function handleSaveNote(event: React.FormEvent<HTMLFormElement>) {
  function handleSaveNote() {
    // event.preventDefault()

    if (content.trim() === '') {
      toast.error('Conteúdo da nota não pode ser vazio')
      return
    }
    // const regexSwearword = /^((?!\b(palavrao1|palavrao2|palavrao3)\b).)+$/i

    // if (!regexSwearword.test(content)) {
    //   toast.error('Palavras ofensivas foram censuradas')
    //   return
    // }

    // https://github.com/rodgeraraujo/profanity
    const isSwearword = new profanity()

    if (isSwearword.isProfane(content)) {
      toast.error('Palavras ofensivas foram censuradas')
      // return
    }

    onNoteCreated(isSwearword.censor(content))

    // event.currentTarget.reset()
    setContent('')
    setShouldShowOnboarding(true)

    toast.success('Nota salva com sucesso')
  }

  function handleStartRecording() {
    // webkitSpeechRecognition é para quem esta no chrome
    const isSpeechRecognitionSupported =
      'SpeechRecognition' in window || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionSupported) {
      toast.error('Seu navegador não suporta gravação de áudio')
      return
    }

    if (isRecording) {
      toast.info('Você já está gravando')
      return
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)
    toast.success('Gravação iniciada')

    // npm i -d @types/dom-speech-recognition
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition

    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    // Ele so vai parar quando eu decidir parar manualmente, se eu não passar isso, ele vai parar até eu parar de falar
    speechRecognition.continuous = true
    // Ele vai retornar apenas uma alternativa, ou seja, ele vai retornar apenas uma transcrição. por exemplo typeScript, ele vai retornar apenas typeScript, se eu não passar isso, ele vai retornar varias alternativas, do que ele acha que eu falei
    speechRecognition.maxAlternatives = 1
    // Ele vai retornando o que eu falei a cada instante e não so no final quando eu parar de falar
    speechRecognition.interimResults = true

    // Essa vai ser chamada toda vez que a api de reconhecimento de voz retornar um resultado/ouvir algo
    speechRecognition.onresult = event => {
      // O array.from é para transformar o resultado em um array. o events.results é um interator(lista) mas nao é um array. Usando reduce para transformar o array de resultados em uma string. Para cada info do array ele vai concatenar o resultado com o texto que ja tem
      const transcript = Array.from(event.results).reduce(
        // O result basicamente é o que o usuario falou no microfone, e api tem somente uma alternativa nesse array result, ou seja sempre tendo uma posição, a posição 0. Entao cada palavra/frase é um array diferente, que vai ser concatenando com o que ja foi dito e repassado para o text
        (text, result) => {
          // Entao basicamente o text vai acumular os resultados gerados. Posição 0 porque a primeira posição do array, porque foi ditado que as alternativas vão ter somente uma alternativa ou seja sempre na posição 0 do array vai estar o que foi dito no microfone. E o transcript é a string(palavra) dita que a API entendeu com uma so alternativa, se tivesse mais, o result poderia ser um array enorme com varias alternativas do que o usuario falou
          return text.concat(result[0].transcript)
        },
        // O text é essa string vazia(estado inicial), que é o texto que vai ser concatenado com o resultado, ou seja, que eu estou criando
        ''
      )
      setContent(transcript)
    }

    speechRecognition.onerror = event => {
      console.error(event.error)
      toast.error(`Erro ao gravar áudio: ${event.error}`)
    }

    speechRecognition.start()

    return {
      speechRecognition
    }
  }

  function handleStopRecording() {
    if (speechRecognition !== null) {
      setIsRecording(false)
      speechRecognition.stop()
      toast.success('Gravação finalizada com sucesso')
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 text-left p-5 gap-3 outline-none hover:ring-2  hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute top-5 right-5 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
            <X className="size-5" />
          </Dialog.Close>

          {/*Por boa pratica deveria ser por aqui a função de envia da nota  */}
          {/* <form onSubmit={handleSaveNote}  className="flex flex-col flex-1"> */}
          <form onSubmit={handleSaveNote} className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar Nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{' '}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartRecording}
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    type="button"
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <>
                  <ButtonOptions onClick={handleStartRecording}>
                    <Mic className=" size-5" />
                  </ButtonOptions>
                  <textarea
                    // Ja deixa o usuario no foco para digitar
                    autoFocus
                    value={content}
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                    onChange={handleContentChange}
                  />
                </>
              )}
            </div>

            {isRecording ? (
              <button
                type="button"
                className="w-full bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100 focus-visible:text-slate-100 transition-colors duration-200 ease-in-out relative"
                onClick={handleStopRecording}
              >
                <span className="animate-ping absolute inline-flex size-6 -top-2  right-4 rounded-full bg-lime-500 opacity-75" />
                <span className="animate-pulse absolute inline-flex size-6 -top-2 right-4 rounded-full bg-red-500 opacity-75" />
                <span>Gravando! (Clique p/ interromper)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 focus-visible:bg-lime-500  transition-colors duration-200 ease-in-out"
              >
                Salvar Nota
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
