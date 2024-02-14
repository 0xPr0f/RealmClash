import styles from "./cardBox.module.css";

export default function CardBox({
  children = "card 1",
  className,
  onClick,
  showStats = true,
  width,
  height,
  borderRadius,
  health,
  attack,
  style,
}) {
  return (
    <div
      style={style}
      className={[styles.cardHolder, className ? className : ""].join(" ")}
    >
      {showStats ? (
        <div className={styles.StatusBar}>
          <span>H:{health}</span>

          <span>A:{attack}</span>
        </div>
      ) : (
        ""
      )}
      <div
        className={styles.card}
        style={{ width: width, height: height, borderRadius: borderRadius }}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
}
