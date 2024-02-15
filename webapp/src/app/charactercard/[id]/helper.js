import React from "react";

export const TextHelper = ({ lhsv, rhsv }) => {
  return (
    <p>
      <strong>{lhsv}:</strong> <span>{rhsv}</span>
    </p>
  );
};
