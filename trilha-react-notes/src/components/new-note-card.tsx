import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export function NewNoteCard() {
  // Por que should no começo ? porque é uma variavel que vai dizer se algo deve ser feito ou não(uma pergunta de sim ou nao) ou seja, é uma variavel que vai dizer se algo deve ser mostrado ou não. Regra de clean code
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true)
  const [content, setContent] = useState('')

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

  function handleSaveNote(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log(content)

    toast.success('Nota salva com sucesso')
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
        <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close
            className="absolute top-5 right-5 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
            onClick={handleStartEditor}
          >
            <X className="size-5" />
          </Dialog.Close>
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
                  >
                    gravando uma nota
                  </button>{' '}
                  em áudio ou se preferir{' '}
                  <button
                    className="font-medium text-lime-400 hover:underline"
                    onClick={handleStartEditor}
                  >
                    utilize apenas texto
                  </button>
                </p>
              ) : (
                <textarea
                  // Ja deixa o usuario no foco para digitar
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChange}
                />
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500 focus-visible:bg-lime-500  transition-colors duration-200 ease-in-out"
            >
              Salvar Nota
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
