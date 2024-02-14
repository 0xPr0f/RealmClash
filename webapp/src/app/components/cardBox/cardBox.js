import styles from "./cardBox.module.css";

export default function CardBox({
  children = "card 1",
  className,
  onClick,
  showStats = true,
  width,
  height,
  borderRadius,
}) {
  return (
    <div className={[styles.cardHolder, className].join(" ")}>
      {showStats ? (
        <div className={styles.StatusBar}>
          <span>H:100</span>

          <span>A:100</span>
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
