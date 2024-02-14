"use client";
import React from "react";
export default function CharacterCardViewFullPage({ params }) {
  return (
    <div>
      This is the character card view full page page :
      {JSON.stringify(params.id)}
    </div>
  );
}
