import React from 'react'

export const TextHelper = ({ lhsv, rhsv, onClick, children }) => {
  return (
    <p>
      <span
        onClick={onClick}
        style={{
          fontWeight: 'lighter',
          fontSize: '18px',
        }}
      >
        {lhsv}{' '}
      </span>
      <span>{rhsv}</span>
    </p>
  )
}
