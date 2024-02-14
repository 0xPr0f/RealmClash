"use client";
import React, { useEffect, useRef, useState } from "react";
import InputField from "../components/inputField/inputField";
import styles from "./game.module.css";
import BoxButton from "../components/boxButton/boxButton";
import {
  CHARACTERCARD_CONTRACTADDRESS,
  GAMEFACTORY_CONTRACTADDRESS,
} from "../ADDRESSES";
import { CHARACTERCARD_ABI, GAMEFACTORY_ABI } from "../ABI";
import CardBox from "../components/cardBox/cardBox";
import { useReadContract, useAccount, useWriteContract } from "wagmi";

export default function Game() {
  const [challengee, setChallengee] = useState("");
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const [selectedCards, setSelectedCards] = useState([]);

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
    if (selectedCards.length === 3) {
      console.log("game started", challengee, selectedCards);
    } else {
      console.log("you need three characters");
    }
  };

  const challengePlayerByID = (_2ndPlayeraddress, _1stPlayerCharDeck) =>
    writeContract({
      abi: GAMEFACTORY_ABI,
      address: GAMEFACTORY_CONTRACTADDRESS,
      functionName: "createNewGameManual",
      args: [_2ndPlayeraddress, _1stPlayerCharDeck],
      account: account,
    });

  const allCharacterToken = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: "returnAllOwnerTokenId",
    args: [account],
    account: account,
  });

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
                setChallengee(e.target.value);
              }}
              placeholder="Player ID"
            />
          </div>
          <div>
            <div className="pt-6 pb-1">
              <span>Select Cards</span>
            </div>
            <div className="pb-5">
              <div className={styles.scrollablegridcontainer}>
                <div className={styles.cardgrid}>
                  {[1, 2, 4, 5].map((cardId) => (
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
                      Card {cardId}
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
                        Card {id}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <BoxButton onClick={requestChallenge}> Request Challenge</BoxButton>
        </div>
      </div>
    </div>
  );
}
