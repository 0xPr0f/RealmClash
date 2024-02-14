"use client";
import React, { useEffect, useRef, useState } from "react";
import InputField from "../components/inputField/inputField";
import styles from "./game.module.css";
import BoxButton from "../components/boxButton/boxButton";
export default function Game() {
  const [challengee, setChallengee] = useState("");

  const requestChallenge = () => {
    console.log("requested challenge", challengee);
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
              <div>This is were the cards will be, they can be much lmao</div>
            </div>
          </div>
          <BoxButton onClick={requestChallenge}> Request Challenge</BoxButton>
        </div>
      </div>
    </div>
  );
}
