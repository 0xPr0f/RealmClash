"use client";
import { useState, useEffect } from "react";
import { CHARACTERCARD_ABI } from "../ABI";
import { CHARACTERCARD_CONTRACTADDRESS } from "../ADDRESSES";
import CardBox from "../components/cardBox/cardBox";
import "./portfolio.css";
import { useReadContract, useAccount } from "wagmi";
import { config } from "../charactercard/[id]/page";
import { opBNBTestnet } from "viem/chains";
import { useRouter } from "next/navigation";
import { TextHelper } from "../charactercard/[id]/helper";

export default function Portfolio() {
  const account = useAccount();
  const { address } = useAccount();
  const router = useRouter();
  const [alltokenId, setAlltokenId] = useState([]);
  const characterCardBalance = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: "balanceOf",
    args: [account],
    account: account,
  });
  const characterCardTokenID = (index) =>
    useReadContract({
      abi: CHARACTERCARD_ABI,
      address: CHARACTERCARD_CONTRACTADDRESS,
      functionName: "_tokenOfOwnerByIndex",
      args: [account, index],
      account: account,
    });
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

  return (
    <div>
      <div className="centeredcontainer">
        <div className="centereddiv">
          <TextHelper lhsv="Your character cards, click to view" />
          <div className="padbox">
            <div className="gridcontainer">
              <div className="grid">
                {alltokenId?.map((cardId) => (
                  <CardBox
                    showStats={false}
                    key={cardId}
                    height={300}
                    width={200}
                    onClick={() => {
                      router.push(`/charactercard/${cardId.toString()}`, {
                        scroll: false,
                      });
                    }}
                  >
                    Card {cardId.toString()}
                  </CardBox>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
