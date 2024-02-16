import React from "react";

export const TextHelper = ({ lhsv, rhsv }) => {
  return (
    <p>
      <span
        style={{
          fontWeight: "lighter",
          fontSize: "18px",
        }}
      >
        {lhsv}:
      </span>{" "}
      <span>{rhsv}</span>
    </p>
  );
};
