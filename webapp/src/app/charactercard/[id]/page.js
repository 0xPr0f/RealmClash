"use client";
import { CHARACTERCARD_CONTRACTADDRESS } from "@/app/ADDRESSES";
import { shortenText } from "@/app/components/utilities/utilities";
import React, { useEffect } from "react";
import { useReadContract, useAccount, useWriteContract } from "wagmi";
import { readContract } from "@wagmi/core";
import { TextHelper } from "./helper";
import BoxButton from "@/app/components/boxButton/boxButton";
import { CHARACTERCARD_ABI } from "@/app/ABI";
import { opBNBTestnet } from "@wagmi/core/chains";
import { http, createConfig } from "@wagmi/core";

export const config = createConfig({
  chains: [opBNBTestnet],
  transports: {
    [opBNBTestnet.id]: http(),
  },
});

export default function CharacterCardViewFullPage({ params }) {
  const account = useAccount();
  const { writeContract } = useWriteContract();
  //getCharacterStats
  const { data, error, isPending } = useReadContract(config, {
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: "characterStats",
    args: [BigInt(1)],
    account: account,
    chainId: opBNBTestnet.id,
  });

  const getCharacterStats = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: "characterStats",
    args: [BigInt(1)],
    account: account,
    chainId: opBNBTestnet.id,
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.log(error);
    },
  });

  const equipWeapon = (tokenIdofCharacter, tokenIdofWeapon) =>
    writeContract({
      abi: CHARACTERCARD_ABI,
      address: CHARACTERCARD_CONTRACTADDRESS,
      functionName: "equipWeapon",
      args: [BigInt(tokenIdofCharacter), BigInt(tokenIdofWeapon)],
      account: account,
    });
  const equipWeapon1 = (tokenIdofCharacter, tokenIdofWeapon, account) => {
    try {
      writeContract({
        abi: CHARACTERCARD_ABI,
        address: CHARACTERCARD_CONTRACTADDRESS,
        functionName: "equipWeapon",
        args: [tokenIdofCharacter, tokenIdofWeapon],
        account: account,
      });
    } catch (error) {
      // Handle error
      console.error("Error while equipping weapon:", error);
      // Optionally, you can rethrow the error to propagate it further
      throw error;
    }
  };

  const detachWeapon = (tokenIdofCharacter, tokenIdofWeapon) =>
    writeContract({
      abi: CHARACTERCARD_ABI,
      address: CHARACTERCARD_CONTRACTADDRESS,
      functionName: "equipWeapon",
      args: [BigInt(tokenIdofCharacter), BigInt(tokenIdofWeapon)],
      account: account,
    });

  const runUpdates = async () => {
    const result = await readContract(config, {
      abi: CHARACTERCARD_ABI,
      address: CHARACTERCARD_CONTRACTADDRESS,
      functionName: "characterStats",
      args: [BigInt(1)],
      account: account,
      chainId: opBNBTestnet.id,
    });
    return result;
  };
  return (
    <div>
      <div style={{ padding: "20px" }}>
        Token ID : {JSON.stringify(params.id)}
      </div>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              maxWidth: "1500px",
              backgroundColor: "#1a1a1d",
              gap: "40px",
              color: "#c3073f",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.5)",
            }}
          >
            <div>
              <div
                style={{
                  paddingBottom: "10px",
                }}
              >
                <span>
                  Card Address :{" "}
                  {shortenText(CHARACTERCARD_CONTRACTADDRESS, 6, 6)}
                </span>
              </div>
              <div
                style={{
                  width: "300px",
                  padding: "20px",
                  backgroundColor: "#950740",
                }}
              >
                {/* Placeholder for image */}
                <div
                  style={{
                    width: "100%",
                    height: "400px",
                    backgroundColor: "#1a1a1d",
                  }}
                >
                  {/* You can replace the background color with the actual image */}
                </div>
              </div>
            </div>
            <div style={{ flex: "1", padding: "20px" }}>
              <div style={{ paddingTop: "20px" }}>
                <TextHelper lhsv="Name" rhsv="Henry SitWelth" />
                <TextHelper lhsv="Base Health" rhsv="200" />
                <TextHelper lhsv="Base Attack" rhsv="19" />
                <TextHelper lhsv="Base Magic Power" rhsv="4" />
                <TextHelper lhsv="Base Skill Multipier" rhsv="2" />
                <TextHelper lhsv="Class Name" rhsv="Knight" />
                <TextHelper lhsv="Is Usable" rhsv="true" />
                <TextHelper lhsv="TokenId" rhsv="1167" />
                <TextHelper lhsv="WeaponId" rhsv="0" />
                <TextHelper lhsv="ULT 2 power" rhsv="15" />
                <TextHelper lhsv="ULT 3 power" rhsv="40" />
                <TextHelper lhsv="Owner" rhsv="0x0000000001" />
              </div>
              <div>
                {/*
                {
                  Object.entries(attributes)[1, 2, 3, 4].map(
                    ([key, value]) => (
                      <p key={key}>
                        <strong>{key}:</strong> {value}
                      </p>
                    )
                  )
                } */}
              </div>
              <div
                style={{
                  paddingTop: "10px",
                  display: "flex",
                }}
              >
                <BoxButton
                  onClick={() => {
                    console.log(getCharacterStats);
                  }}
                >
                  Equip Weapon
                </BoxButton>
                <BoxButton>RemoveWeapon</BoxButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
