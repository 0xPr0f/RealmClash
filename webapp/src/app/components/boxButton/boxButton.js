import styles from './boxButton.module.css'
export const BoxButton = ({
  border,
  children,
  onClick,
  width,
  height,
  borderRadius,
  padding,
  cursor = 'pointer',
  disabled,
  customloading,
  outsidePadding,
  className,
  spinSharply = false,
  wantText,
}) => {
  return (
    <div style={{ padding: outsidePadding }}>
      <button
        onClick={onClick}
        disabled={disabled}
        style={{
          border: border,
          width: width,
          height: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: borderRadius,
          padding: padding,
          cursor: cursor,
        }}
        className={
          spinSharply
            ? [styles.buttonSharp, className].join(' ')
            : [styles.button, className].join(' ')
        }
      >
        <span>{children}</span>
      </button>
      {wantText && (
        <span
          style={{
            fontWeight: '200',
            fontSize: '15px',
          }}
        >
          {wantText}
        </span>
      )}
    </div>
  )
}

export default BoxButton
