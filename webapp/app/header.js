import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";
import "../styles/headers.css";
export default function Header() {
  return (
    <div>
      <div className="navbar">
        <Link href="/">REALM ClASH</Link>
        <Link href="/game">GAME</Link>
        <Link href="/portfolio">PORTFOLIO</Link>
        <Link href="/leaderboard">LEADERBOARD</Link>
        <Link href="/activity">ACTIVITY</Link>

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
