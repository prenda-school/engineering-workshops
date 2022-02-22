export const Spinner = ({
  /** color of spinning part */
  color = "var(--color-dark-text)",
  /** becomes width and height, so use regular width and height values */
  size = 20,
  ...props
}: {
  color?: string
  size?: number | string
} & React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className="spinner"
      {...props}
      style={{
        borderLeftColor: color,
        width: size,
        height: size,
        ...props.style,
      }}
    ></div>
  )
}
