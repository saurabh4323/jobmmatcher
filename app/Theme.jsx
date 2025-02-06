"use client";
import { Eclipse } from "lucide-react";
import React, { useState } from "react";

export default function Theme({ setTheme }) {
  const [num, setNum] = useState(0);
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
    "dim",
    "nord",
  ];

  const changeTheme = (newNum) => {
    setNum(newNum);
    setTheme(themes[newNum]); // Update the theme in RootLayout
  };

  return (
    <div
      style={{
        height: "10vh",
        zIndex: "10000",
        position: "absolute",
        display: "flex",
        width: "100%",
        // alignItems: "right",
        justifyContent: "left",
        gap: "30px",
      }}
    >
      <button
        className="btn btn-active btn-primary"
        onClick={() => changeTheme(Math.min(num + 1, themes.length - 1))}
      >
        <Eclipse></Eclipse>
      </button>
    </div>
  );
}
