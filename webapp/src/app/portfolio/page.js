"use client";
import { CHARACTERCARD_ABI } from "../ABI";
import { CHARACTERCARD_CONTRACTADDRESS } from "../ADDRESSES";
import CardBox from "../components/cardBox/cardBox";
import "./portfolio.css";
import { useReadContract, useAccount } from "wagmi";

export default function Portfolio() {
  const account = useAccount();

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
    args: [account],
    account: account,
  });
  return (
    <div>
      This is the portfolio page
      <div className="centeredcontainer">
        <div className="centereddiv">
          <span>Your character cards, click to view</span>
          <div className="padbox">
            <div className="gridcontainer">
              <div className="grid">
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
                <CardBox height={300} width={200} showStats={false} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
