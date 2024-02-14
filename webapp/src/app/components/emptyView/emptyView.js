import React from "react";
import styles from "./emptyView.module.css";
export default function EmptyView({ children }) {
  return (
    <div>
      <div className={styles.centeredcontainer}>
        <div className={styles.centereddiv}>
          <div className="pt-10 pb-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
