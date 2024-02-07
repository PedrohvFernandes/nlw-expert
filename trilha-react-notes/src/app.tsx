import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

export function App() {
  return (
    // Lembrando que o tailwind os px são divididos por 4 ou multiplicados por 4, ou seja, my-12 por exemplo é 12*4 = 48px ou o inverso 48px/4 = 12
    // space-y-6 coloca espaço entre os elementos independentemente da quantidade que eu tiver, dessa forma não preciso ficar colocando margin-top em todos os elementos
    // mx-auto max-w-6xl -> centraliza o conteudo e limita o tamanho do conteudo
    <div className="mx-auto max-w-6xl my-12 space-y-6">
      <img src={logo} alt="Logo NLW Expert" />

      {/* Se voce quiser ver o tamanho real basta colocar um outline. Por exemplo se voce não acha que o elemento esta ficando 100%, basta colocar outline */}
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>

      <div className="h-px bg-slate-700" />

      {/* divide por 3 colunas e as linhas tem um tamanho de 250px fixos */}
      <div className="grid grid-cols-3 auto-rows-[250px] gap-6">
        <NewNoteCard/>
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />
        <NoteCard />

      </div>
    </div>
  )
}
