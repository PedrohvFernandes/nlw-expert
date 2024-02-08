interface IButtonOptionsProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function ButtonOptions({
  children,
  ...rest
}: Readonly<IButtonOptionsProps>) {
  return (
    <button
      type="button"
      className="absolute top-16 right-5 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none"
      {...rest}
    >
      {children}
    </button>
  )
}
