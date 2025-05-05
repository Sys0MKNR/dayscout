interface LoaderProps {
  size?: string
}

export default function Loader(props: LoaderProps) {
  const { size = 'h-16 w-16' } = props
  return (
    <div className="absolute right-1/2 bottom-1/2  transform translate-x-1/2 translate-y-1/2 ">
      <div
        className={`${size} border-t-transparent border-solid animate-spin  rounded-full border-primary border-8`}
      ></div>
    </div>
  )
}
