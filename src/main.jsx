import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import "./variables.css";
import Hero from "./components/Hero";

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Navbar />
    <Hero/>
    {/* Temporary background to see the glass effect */}
    <div
      style={{
        height: "200vh",
        background: "linear-gradient(to bottom, #0a0a0a, #1a1a1a)",
      }}
    ></div>
  </>,
);
