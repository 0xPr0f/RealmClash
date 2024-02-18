import React from 'react'

export const HoriGridBox = ({ children, onClick }) => {
  return (
    <div>
      <div
        style={{
          padding: '10px',
        }}
      >
        <div>
          <div
            onClick={onClick}
            style={{
              width: '100%',
              height: '70px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #000',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
