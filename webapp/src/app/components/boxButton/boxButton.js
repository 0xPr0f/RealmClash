import styles from "./boxButton.module.css";
export const BoxButton = ({
  border,
  children,
  onClick,
  width,
  height,
  borderRadius,
  padding,
  cursor = "pointer",
  disabled,
  outsidePadding,
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: borderRadius,
          padding: padding,
          cursor: cursor,
        }}
        className={[styles.button].join(" ")}
      >
        <span className={styles.spaninside}> {children}</span>
      </button>
    </div>
  );
};

export default BoxButton;
