import React, { useState } from "react";
import FireworkDisplay from "./FireworkDisplay";
import "../css/Fixedbutton.css";

const CelebrateSection = () => {
  const [fireworkTrigger, setFireworkTrigger] = useState(0);

  return (
    <div className="app-container">
      <FireworkDisplay trigger={fireworkTrigger} />
      <button
        onClick={() => setFireworkTrigger((prev) => prev + 1)}
        title="Celebrate!"
        className="btn-control-circle btn-pos-right"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
          {" "}
          {/* Icon scaled to 24 */}
          <path d="M12 2L9 9H2L7.5 13L5.5 20L11 16L16.5 20L14.5 13L20 9H13L11 2Z" />
          <path
            d="M11 18V22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M8 20L5 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 20L17 22"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default CelebrateSection;
