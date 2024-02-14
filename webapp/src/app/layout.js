import { Inter } from "next/font/google";
import "./globals.css";
import Interloop from "./Interloop";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Realm Clash",
  description: "Fully Onchain TCG and alot of unga bunga",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div>
          <Interloop> {children} </Interloop>
        </div>
      </body>
    </html>
  );
}
