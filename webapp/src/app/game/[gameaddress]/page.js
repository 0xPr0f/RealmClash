"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./game.css";
import CardBox from "@/src/app/components/cardBox/cardBox";
import BoxButton from "@/src/app/components/boxButton/boxButton";

export default function GameRoom({ params }) {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (index) => {
    setSelectedCard((prevSelectedCard) => {
      console.log(index);
      return prevSelectedCard === index ? null : index;
    });
  };
  return (
    <div>
      {console.log(JSON.stringify(params.gameaddress))}
      <div>Game address : {JSON.stringify(params.gameaddress)}</div>
      <div>
        <div className="game-board">
          <div className="cards-up">
            <CardBox />
            <CardBox />
            <CardBox />
          </div>
          <div className="cards-down">
            <CardBox
              className={`card ${selectedCard === 0 ? "selected" : ""}`}
              onClick={() => handleCardClick(0)}
            />
            <CardBox
              className={`card ${selectedCard === 3 ? "selected" : ""}`}
              onClick={() => handleCardClick(3)}
            />
            <CardBox
              className={`card ${selectedCard === 6 ? "selected" : ""}`}
              onClick={() => handleCardClick(6)}
            />
            {/*You will have to be connected to be able to see the buttons to do stuff*/}
            <div>
              <div className="buttons">
                <BoxButton>Normal</BoxButton>
                <BoxButton>2 ULT</BoxButton>
                <BoxButton>3 ULT</BoxButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
