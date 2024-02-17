import { useAccount, useReadContract } from "wagmi";
import styles from "./cardBox.module.css";
import { GAME_ABI } from "@/app/ABI";
import { config } from "@/app/charactercard/[id]/page";
import { opBNBTestnet } from "viem/chains";
import { useEffect, useState } from "react";
import { serialize } from "wagmi";
export default function CardBox({
  children = "card 1",
  className,
  onClick,
  showStats = true,
  width,
  height,
  borderRadius,
  style,
}) {
  return (
    <div
      style={style}
      className={[styles.cardHolder, className ? className : ""].join(" ")}
    >
      {showStats ? (
        <div className={styles.StatusBar}>
          <span>H: 100</span>

          <span>A: 100</span>
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

export function CardBoxGame({
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
  tokenId,
  gameaddress,
}) {
  const account = useAccount();
  const [resultnice, setResultnice] = useState();
  const result = useReadContract({
    abi: GAME_ABI,
    address: gameaddress,
    functionName: "characterStatsInGame",
    config: config,
    args: [tokenId?.toString()],
    account: account,
    chainId: opBNBTestnet.id,
  });

  return (
    <div
      style={style}
      className={[styles.cardHolder, className ? className : ""].join(" ")}
    >
      {showStats ? (
        <div className={styles.StatusBar}>
          {result.data && (
            <span>H: {result.data && result.data[0].toString()}</span>
          )}

          {result.data && (
            <span>A: {result.data && result.data[1].toString()}</span>
          )}
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
