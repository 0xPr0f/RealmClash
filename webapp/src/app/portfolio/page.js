import CardBox from "../components/cardBox/cardBox";
import "./portfolio.css";
import { useAccount } from "wagmi";

export default function Portfolio() {
  const { address } = useAccount();
  return (
    <div>
      This is the portfolio page
      <div className="centeredcontainer">
        <div className="centereddiv">
          <span>Your character cards, click to view</span>
          <div className="grid-container">
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
  );
}
