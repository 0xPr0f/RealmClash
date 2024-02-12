import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import "../styles/headers.css";
export default function Header() {
  return (
    <div>
      <div className="navbar">
        <a>Realm Clash</a>
        <Link href="/game">Game</Link>
        <Link href="/portfolio">Portfolio</Link>
        <Link href="/leaderboard">Leaderboard</Link>
        <Link href="/activity">Activity</Link>

        <div className="connectclass">
          <ConnectButton
            accountStatus={{
              smallScreen: "address",
              largeScreen: "address",
            }}
            chainStatus={{ smallScreen: "icon", largeScreen: "full" }}
            showBalance={true}
          />
        </div>
      </div>
      <hr
        style={{
          background: "#6f2232",
          color: "#6f2232",
          borderColor: "#6f2232",
          height: "2px",
        }}
      />
    </div>
  );
}
