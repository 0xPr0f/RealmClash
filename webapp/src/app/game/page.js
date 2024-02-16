"use client";
import React, { useEffect, useRef, useState } from "react";
import InputField from "../components/inputField/inputField";
import styles from "./game.module.css";
import BoxButton from "../components/boxButton/boxButton";
import { writeContract } from "@wagmi/core";
import {
  CHARACTERCARD_CONTRACTADDRESS,
  GAMEFACTORY_CONTRACTADDRESS,
} from "../ADDRESSES";
import { CHARACTERCARD_ABI, GAMEFACTORY_ABI } from "../ABI";
import CardBox from "../components/cardBox/cardBox";
import { useReadContract, useAccount, useWriteContract } from "wagmi";
import { config } from "../charactercard/[id]/page";
import { opBNBTestnet } from "viem/chains";
import { isValidAddress } from "../components/utilities/utilities";

export default function Game() {
  const [challengee, setChallengee] = useState("");
  const account = useAccount();
  const { address } = useAccount();
  //const { data: hash, writeContract } = useWriteContract();
  const [selectedCards, setSelectedCards] = useState([]);
  const [alltokenId, setAlltokenId] = useState([]);

  const handleCardClick = (cardId) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter((id) => id !== cardId));
    } else {
      if (selectedCards.length < 3) {
        setSelectedCards([...selectedCards, cardId]);
      }
    }
  };

  const requestChallenge = () => {
    if (selectedCards.length === 3 && isValidAddress(challengee)) {
      console.log("game started", challengee, selectedCards);
      challengePlayerByID(challengee, selectedCards);
    } else {
      console.log("you need three characters");
    }
  };

  const challengePlayerByID = (_2ndPlayeraddress, _1stPlayerCharDeck) => {
    const call = writeContract({
      abi: GAMEFACTORY_ABI,
      address: GAMEFACTORY_CONTRACTADDRESS,
      functionName: "createNewGameManual",
      args: [_2ndPlayeraddress, _1stPlayerCharDeck],
      chainId: opBNBTestnet.id,
    });
    console.log(call);
  };
  // test address 0x772A4f348d85FDd00e89fDE4C7CAe8628c8DAd19
  const allCharacterToken = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: "returnAllOwnerTokenId",
    config: config,
    args: [address],
    account: account,
    chainId: opBNBTestnet.id,
  });
  useEffect(() => {
    setAlltokenId(allCharacterToken?.data);
  }, [allCharacterToken]);

  const test = async () => {
    const result = await writeContract(config, {
      abi: GAMEFACTORY_ABI,
      address: GAMEFACTORY_CONTRACTADDRESS,
      functionName: "createNewGameManual",
      args: [challengee, selectedCards],
      chainId: opBNBTestnet.id,
    });
    console.log(result);
  };

  return (
    <div>
      <div className={styles.centeredcontainer}>
        <div className={styles.centereddiv}>
          <div className="pt-10 pb-1">
            <span>Challengee</span>
          </div>
          <div>
            <InputField
              value={challengee}
              onChange={(e) => {
                const re = /(?:0[xX])?[0-9a-fA-F]+/;
                if (e.target.value === "" || re.test(e.target.value)) {
                  setChallengee(e.target.value);
                }
              }}
              placeholder="Player ID"
            />
          </div>
          <div>
            <div className="pt-6 pb-1">
              <span>Select 3 Cards</span>
            </div>
            <div className="pb-5">
              <div className={styles.scrollablegridcontainer}>
                <div className={styles.cardgrid}>
                  {alltokenId?.map((cardId) => (
                    <CardBox
                      showStats={false}
                      key={cardId}
                      onClick={() => handleCardClick(cardId)}
                      style={{
                        backgroundColor: selectedCards.includes(cardId)
                          ? "#c3073f"
                          : "#1a1a1d",

                        padding: "5px",
                        margin: "5px",
                        cursor: "pointer",
                      }}
                      height={80}
                      width={67}
                    >
                      Card {cardId.toString()}
                    </CardBox>
                  ))}
                </div>
              </div>
              {selectedCards.length > 0 ? (
                <div>
                  <h3>Selected Cards:</h3>
                  <ul style={{ display: "flex" }}>
                    {selectedCards.map((id) => (
                      <li style={{ paddingRight: "10px" }} key={id}>
                        Token ID#{id.toString()}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <BoxButton
            onClick={() => {
              //requestChallenge();
              test();
            }}
          >
            Request Challenge
          </BoxButton>
        </div>
      </div>
    </div>
  );
}
