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
        className={[styles.button, className].join(' ')}
      >
        <span className={styles.spaninside}> {children}</span>
      </button>
    </div>
  )
}

export default BoxButton
