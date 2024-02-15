import React from "react";
import "../../styles/headers.css";
import BoxButton from "./components/boxButton/boxButton";
export default function Home() {
  return (
    <div>
      <div className="container">
        <div className="header">
          <h1 style={{ fontSize: 30 }}>Realm Clash</h1>
          <p>
            Experience the ultimate trading card game on the OpBNB blockchain!
          </p>
        </div>
        <div className="feature">
          <h2>Current Features</h2>
          <ul>
            <li>Equip powerful weapons to your heroes</li>
            <li>Engage in intense battle challenge mode</li>
            <li>Master attack and defend strategies</li>
            <li>
              Experience randomness and minimalist UI for immersive gameplay
            </li>
            <li>Participate in 3 v 3 and 2 player duel modes</li>
            <li>
              A complete representation of the envisioned project as a Proof of
              Concept
            </li>
          </ul>
        </div>
        <div className="feature">
          <h2>Features Coming Soon</h2>
          <ul>
            <li>Player lobby system for finding random matchups</li>
            <li>Introduction of new game modes for added excitement</li>
            <li>On-chain store and upgrade system using smart contracts</li>
            <li>Improved character, weapon contracts</li>
            <li>
              Gas optimizations and unit computational testing for improved
              performance
            </li>
            <li>Enhanced game mechanics and logics</li>
            <li>
              Introduction of armor and boosts (spells) for enhanced gameplay
            </li>
            <li>
              Tiers and rarity for all cards, plus advanced multipier metrics
            </li>
            <li>
              Quality of Life (QOL) improvements, including better UI and
              smarter contracts (no pun intended)
            </li>
          </ul>
        </div>
        <div className="feature">
          <h2>OpBNB - Optimistic Rollup</h2>
          <p>
            OpBNB is an optimistic rollup solution built on top of the Binance
            Smart Chain (BSC). It leverages Ethereum Virtual Machine (EVM)
            compatibility and optimistic execution to provide high throughput,
            low latency, and reduced transaction costs for decentralized
            applications like Realm Clash.
          </p>
          <p>
            As an optimistic rollup, OpBNB processes transactions off-chain in a
            scalable manner, periodically committing them to the Binance Smart
            Chain for security and decentralization. This approach allows for
            fast and efficient gameplay experiences, ensuring that players can
            enjoy seamless battles and card trading with minimal friction.
          </p>
        </div>
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="cta"
        >
          <BoxButton className="ctabutton">Read Rules</BoxButton>
          <BoxButton className="ctabutton">Mechanics</BoxButton>
          <BoxButton className="ctabutton">Play Game</BoxButton>
        </div>
      </div>
    </div>
  );
}
