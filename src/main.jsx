import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "./components/Navbar";
import "./variables.css";
import Hero from "./components/Hero";
import CelebrateSection from "./components/FireWork/CelebrateSection";
import ThemeToggle from "./components/ThemeToggle";
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <Navbar />
    <Hero />
    <ThemeToggle />
    <CelebrateSection />
  </>,
);
