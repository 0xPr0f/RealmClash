import React from 'react'

export const TextHelper = ({ lhsv, rhsv, children }) => {
  return (
    <p>
      <span
        style={{
          fontWeight: 'lighter',
          fontSize: '18px',
        }}
      >
        {lhsv}:{' '}
      </span>
      <span>{rhsv}</span>
    </p>
  )
}
