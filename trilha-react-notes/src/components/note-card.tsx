export function NoteCard() {
  return (
    // Ring é uma borda que aparece quando o elemento é focado, mas que na real é um shadow
    // o focus visible é para quando o elemento é focado, ele aparece, por exemplo com tab
    // o focus normal aplica o css quando o elemento é focado ou clicado
    <button className="rounded-md text-left bg-slate-800 p-5 space-y-3 overflow-hidden relative hover:ring-2  hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
      <span className="text-sm font-medium text-slate-300">há 2 dias</span>
      <p className="text-sm leading-6 text-slate-400">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores aliquam
        quod deleniti provident debitis quisquam quas voluptatum, ad eaque. Eum
        ratione ea vitae cum blanditiis ipsa error. Alias, quibusdam dicta.
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores aliquam
        quod deleniti provident debitis quisquam quas voluptatum, ad eaque. Eum
        ratione ea vitae cum blanditiis ipsa error. Alias, quibusdam dicta.
      </p>

      {/*Cria um sombreamento dando ideia que tem mais coisa ara baixo
      h-1/2 -> ocupa metade da altura do elemento 50%
      bg-gradient-to-t -> gradiente de baixo para cima
      from-black/60 to-black/0 -> de preto com 60% de opacidade para preto com 0% de opacidade
    */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
    </button>
  )
}
