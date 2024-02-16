"use client";
import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import { GAMEFACTORY_ABI } from "../ABI";
import { GAMEFACTORY_CONTRACTADDRESS } from "../ADDRESSES";
import { config } from "../charactercard/[id]/page";
import { opBNBTestnet } from "viem/chains";
export default function Activity() {
  const { address } = useAccount();
  const [totalGames, setTotalGames] = useState();

  const getTotalGames = useReadContract({
    abi: GAMEFACTORY_ABI,
    address: GAMEFACTORY_CONTRACTADDRESS,
    functionName: "allGames",
    config: config,
    chainId: opBNBTestnet.id,
  });
  useEffect(() => {
    setTotalGames(getTotalGames.data);
  }, [getTotalGames]);
  return (
    <div>
      <span>
        This is the activity page
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalGames?.map((game) => (
                <ActivityBar key={game}>
                  Game address {game.toString()}
                </ActivityBar>
              ))}
            </div>
          </div>
        </div>
      </span>
    </div>
  );
}

const ActivityBar = ({ children }) => {
  return (
    <div>
      <span key={game}>{children}</span>
    </div>
  );
};
