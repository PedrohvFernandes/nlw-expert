import { useState } from 'react'
import logo from './assets/logo-nlw-expert.svg'
import { NewNoteCard } from './components/new-note-card'
import { NoteCard } from './components/note-card'

// const noteExample = {
//   date: new Date(),
//   content: 'Hello World'
// }

// const noteExample2 = {
//   /*
//    4-1 -> 4 -1 = 4, porque o new Date tem o mes adiantado, logo 4 seria mes 5
//   */
//   date: new Date(2023, 4 - 1, 5),
//   content: 'Hello World'
// }

interface INote {
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<INote[]>(() => {
    const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      // Parse é o caminho contrario do stringify, ou seja, ele transforma uma string em um objeto
      return JSON.parse(notesOnStorage)
    }

    return []
  })

  function onNoteCreated(content: string) {
    const newNote = {
      // Com o crypto eu consigo criar um id unico universal
      id: crypto.randomUUID(),
      date: new Date(),
      content
    }

    const notesArray = [newNote, ...notes]

    // Eu pego todas as notas que eu ja tenho(spread) e coloca a nova nota no inicio
    // setNotes(prev => [newNote, ...prev])
    setNotes(notesArray)

    // O stringify transforma um objeto em uma string
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function onDeleteNote(id: string) {
    const notesArray = notes.filter(note => note.id !== id)
    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const query = event.target.value
    setSearch(query)
  }

  const filteredNotes =
    search !== ''
      ? notes.filter(note =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes

  return (
    // Lembrando que o tailwind os px são divididos por 4 ou multiplicados por 4, ou seja, my-12 por exemplo é 12*4 = 48px ou o inverso 48px/4 = 12
    // space-y-6 coloca espaço entre os elementos independentemente da quantidade que eu tiver, dessa forma não preciso ficar colocando margin-top em todos os elementos
    // mx-auto max-w-6xl -> centraliza o conteudo e limita o tamanho do conteudo
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5 xl:px-0">
      <img src={logo} alt="Logo NLW Expert" />

      {/* Se voce quiser ver o tamanho real basta colocar um outline. Por exemplo se voce não acha que o elemento esta ficando 100%, basta colocar outline */}
      <form className="w-full">
        <input
          type="text"
          placeholder="Busque em suas notas..."
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      {/* divide por 3 colunas e as linhas tem um tamanho de 250px fixos */}
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 sk auto-rows-[250px] gap-6">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {/* 
        <NoteCard note={noteExample} />
        <NoteCard note={noteExample2} /> */}

        {/* <NoteCard
          // Sao duas chaves porque, a primeira é para
          //  dizer que é uma expressão javascript(que vai receber algum valor/variavel) dentro do HTML jsx e a segunda é para dizer que é um objeto
          note={{
            date: new Date(),
            content: 'Hello World'
          }}
        /> */}

        {filteredNotes.map(note => {
          return <NoteCard note={note} key={note.id} onDeleteNote={onDeleteNote} />
        })}
      </div>
    </div>
  )
}
