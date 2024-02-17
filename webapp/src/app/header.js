import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import '../../styles/headers.css'
import Image from 'next/image'
import logoImage from '../../public/LogoImage-nobg.png'

export default function Header() {
  return (
    <div>
      <div className="navbar">
        <div className="picture">
          <Image
            src={logoImage}
            width={50}
            height={50}
            alt="Picture of the project"
          />
        </div>
        <Link href="/">REALM ClASH</Link>
        <Link href="/game">GAME</Link>
        <Link href="/portfolio">PORTFOLIO</Link>
        <Link href="/leaderboard">LEADERBOARD</Link>
        <Link href="/activity">ACTIVITY</Link>

        <div className="connectclass">
          <ConnectButton
            accountStatus={{
              smallScreen: 'address',
              largeScreen: 'address',
            }}
            chainStatus={{ smallScreen: 'icon', largeScreen: 'icon' }}
            showBalance={true}
          />
        </div>
      </div>
      <hr
        style={{
          background: '#6f2232',
          color: '#6f2232',
          borderColor: '#6f2232',
          height: '2px',
        }}
      />
    </div>
  )
}
