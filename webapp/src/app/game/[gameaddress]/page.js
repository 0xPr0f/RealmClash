"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./game.css";
import CardBox from "@/app/components/cardBox/cardBox";
import BoxButton from "@/app/components/boxButton/boxButton";
import { useReadContract, useAccount, useWriteContract } from "wagmi";
import { GAME_ABI } from "@/app/ABI";
import Tooltip from "@/app/components/toolTip/toolTip";
import EmptyView from "@/app/components/emptyView/emptyView";
import { GiCrossedSwords, GiSwordWound, GiPointySword } from "react-icons/gi";
import { FaRotate, FaArrowsRotate } from "react-icons/fa6";

export default function GameRoom({ params }) {
  const router = useRouter();
  const account = useAccount();
  const { writeContract } = useWriteContract();
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (index) => {
    setSelectedCard((prevSelectedCard) => {
      console.log(index);
      return prevSelectedCard === index ? null : index;
    });
  };

  const matchDetails = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: "matchDetails",
  });
  const activeCharacter = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: "getActiveCharacter",
    args: [account],
    account: account,
  });
  const charactersTokenIds = (_address) =>
    useReadContract({
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: "matchDetails.addressToCharacterIdIngame",
      args: [_address],
      account: account,
    });
  const returnOtherAddress = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: "returnOtherPlayer",
    args: [account],
    account: account,
  });
  const isAddressInGame = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: "checkAddressIsInGame",
    account: account,
  });
  const powerPointCount = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: "playerToDiceRow",
    account: account,
  });
  const timeToULTCount = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: "timeForUlt",
    args: [account],
    account: account,
  });
  const addressToPlay = useReadContract({
    abi: GAME_ABI,
    address: params.gameaddress,
    functionName: "addressToPlay",
    args: [account],
    account: account,
  });
  const getCharacterStats = (tokenId) =>
    useReadContract({
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: "getCharacterInGameStats",
      args: [BigInt(tokenId)],
      account: account,
    });

  const useNormalAttack = (tokenId) =>
    writeContract({
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: "useNormalAttack",
      args: [BigInt(tokenId)],
      account: account,
    });
  const useULT2Attack = (tokenId) =>
    writeContract({
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: "useUlt2Attack",
      args: [BigInt(tokenId)],
      account: account,
    });
  const useULT3Attack = (tokenId) =>
    writeContract({
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: "useUlt3Attack",
      args: [BigInt(tokenId)],
      account: account,
    });

  const switchCharacter = (tokenId) =>
    writeContract({
      abi: GAME_ABI,
      address: params.gameaddress,
      functionName: "setSwitchActiveCharacter",
      args: [BigInt(tokenId)],
      account: account,
    });

  return (
    <div>
      {console.log(JSON.stringify(params.gameaddress))}
      <div style={{ paddingLeft: "20px" }}>
        address : {JSON.stringify(params.gameaddress)}
      </div>
      {params.gameaddress.length === 42 ? (
        <div>
          <div className="game-board">
            <div className="cards-up">
              <Tooltip text="Tooltip content is awesome for doing stuffs">
                <CardBox />
              </Tooltip>

              <CardBox />
              <CardBox />
            </div>
            <div className="cardsdown">
              <div className="buttons">
                <BoxButton
                  outsidePadding="20px"
                  borderRadius="100%"
                  height="40px"
                  width="40px"
                >
                  <FaArrowsRotate size={20} fontWeight={1} />
                </BoxButton>
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
              </div>
              {/*You will have to be connected to be able to see the buttons to do stuff*/}
              <div className="theAttackButtons">
                <div className="buttons">
                  <BoxButton
                    outsidePadding="20px"
                    borderRadius="100%"
                    height="80px"
                    width="80px"
                  >
                    <GiCrossedSwords size={43} />
                  </BoxButton>
                  <BoxButton borderRadius="100%" height="68px" width="68px">
                    <GiSwordWound size={40} />
                  </BoxButton>
                  <BoxButton
                    outsidePadding="20px"
                    borderRadius="100%"
                    height="60px"
                    width="60px"
                  >
                    <GiPointySword size={40} />
                  </BoxButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <EmptyView>
            <span>No Game Found</span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
            >
              <BoxButton>Home</BoxButton>
            </div>
          </EmptyView>
        </div>
      )}
    </div>
  );
}
