'use client'
import { CHARACTERCARD_CONTRACTADDRESS } from '@/app/ADDRESSES'
import { shortenText } from '@/app/components/utilities/utilities'
import React, { useEffect, useState } from 'react'
import { useReadContract, useAccount, useWriteContract } from 'wagmi'
import { readContract } from '@wagmi/core'
import { TextHelper } from './helper'
import BoxButton from '@/app/components/boxButton/boxButton'
import { CHARACTERCARD_ABI } from '@/app/ABI'
import { opBNBTestnet } from '@wagmi/core/chains'
import { config } from '@/app/Interloop'

export default function CharacterCardViewFullPage({ params }) {
  const [characterdetails, setCharacterdetails] = useState()
  const [owner, setowner] = useState()
  const account = useAccount()
  const { writeContract } = useWriteContract()

  const getCharacterStats = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: '_characterStatsMap',
    config: config,
    args: [BigInt(params.id)],
    account: account,
    chainId: opBNBTestnet.id,
  })
  const _owner = useReadContract({
    abi: CHARACTERCARD_ABI,
    address: CHARACTERCARD_CONTRACTADDRESS,
    functionName: 'ownerOf',
    config,
    args: [BigInt(params.id)],
    account: account,
    chainId: opBNBTestnet.id,
  })

  useEffect(() => {
    setCharacterdetails(getCharacterStats.data)
    setowner(_owner.data)
  }, [getCharacterStats])
  const equipWeapon = (tokenIdofCharacter, tokenIdofWeapon) =>
    writeContract({
      abi: CHARACTERCARD_ABI,
      address: CHARACTERCARD_CONTRACTADDRESS,
      functionName: 'equipWeapon',
      args: [BigInt(tokenIdofCharacter), BigInt(tokenIdofWeapon)],
      account: account,
    })
  const equipWeapon1 = (tokenIdofCharacter, tokenIdofWeapon, account) => {
    try {
      writeContract({
        abi: CHARACTERCARD_ABI,
        address: CHARACTERCARD_CONTRACTADDRESS,
        functionName: 'equipWeapon',
        args: [tokenIdofCharacter, tokenIdofWeapon],
        account: account,
      })
    } catch (error) {
      // Handle error
      console.error('Error while equipping weapon:', error)
      // Optionally, you can rethrow the error to propagate it further
      throw error
    }
  }

  const detachWeapon = (tokenIdofCharacter, tokenIdofWeapon) =>
    writeContract({
      abi: CHARACTERCARD_ABI,
      address: CHARACTERCARD_CONTRACTADDRESS,
      functionName: 'equipWeapon',
      args: [BigInt(tokenIdofCharacter), BigInt(tokenIdofWeapon)],
      account: account,
    })

  return (
    <div>
      <div style={{ padding: '20px' }}>
        Token ID : {JSON.stringify(params.id)}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '1500px',
              backgroundColor: '#1a1a1d',
              gap: '40px',
              color: '#c3073f',
              borderRadius: '10px',
              padding: '20px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div>
              <div
                style={{
                  paddingBottom: '10px',
                }}
              >
                <span>
                  Card Address :{' '}
                  {shortenText(CHARACTERCARD_CONTRACTADDRESS, 6, 6)}
                </span>
              </div>
              <div
                style={{
                  width: '300px',
                  padding: '20px',
                  backgroundColor: '#950740',
                }}
              >
                {/* Placeholder for image */}
                <div
                  style={{
                    width: '100%',
                    height: '400px',
                    backgroundColor: '#1a1a1d',
                  }}
                >
                  {/* You can replace the background color with the actual image */}
                </div>
              </div>
            </div>
            <div style={{ flex: '1', padding: '20px' }}>
              <div style={{ paddingTop: '20px' }}>
                <TextHelper lhsv="Name:" rhsv={characterdetails?.name} />
                <TextHelper
                  lhsv="Base Health:"
                  rhsv={characterdetails?.baseHealth.toString()}
                />
                <TextHelper
                  lhsv="Base Attack:"
                  rhsv={characterdetails?.baseAttack.toString()}
                />
                <TextHelper
                  lhsv="Base Magic Power:"
                  rhsv={characterdetails?.baseMagicPower.toString()}
                />
                <TextHelper
                  lhsv="Base Skill Multipier:"
                  rhsv={characterdetails?.baseSkillMultipier.toString()}
                />
                <TextHelper
                  lhsv="Class Name:"
                  rhsv={characterdetails?.className.toString()}
                />
                <TextHelper
                  lhsv="Is Usable:"
                  rhsv={characterdetails?.isUsable.toString()}
                />
                <TextHelper
                  lhsv="TokenId:"
                  rhsv={characterdetails?.tokenId.toString()}
                />

                <TextHelper
                  lhsv="ULT 2 power:"
                  rhsv={characterdetails?.ult2.toString()}
                />
                <TextHelper
                  lhsv="ULT 3 power:"
                  rhsv={characterdetails?.ult3.toString()}
                />
                <TextHelper lhsv="Owner:" rhsv={shortenText(owner, 4, 5)} />
                <TextHelper
                  lhsv="WeaponId:"
                  rhsv={characterdetails?.weaponId.toString()}
                />
                <TextHelper
                  lhsv="ArmorId:"
                  rhsv={characterdetails?.armorId.toString()}
                />
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
                  paddingTop: '10px',
                  display: 'flex',
                }}
              >
                <BoxButton
                  onClick={() => {
                    console.log(getCharacterStats)
                    console.log(characterdetails?.isUsable)
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
  )
}
