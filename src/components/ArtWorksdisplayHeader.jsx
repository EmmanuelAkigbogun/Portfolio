import React, { useState, useRef } from "react";
import { Images } from "../assets/images";
import "./css/ArtWorksDisplay.css";
import "./css/Hero.css";
import InteractiveBackground from "./InteractiveBackground";
import ArtWorksDisplayStack from "./ArtWorksDisplayStack";

const ArtWorksDisplayHeader = ({
  editingHeaderField,
  header,
  isAdmin,
  handleStartHeaderEdit,
  handleHeaderUpdate,
  handleCloseEdit,
}) => {
  return (
    <div className="art-display-header">
      <div className="editable-wrapper">
        <div className="art-display-badge">
          {isAdmin && editingHeaderField === "badge" ? (
            <input
              type="text"
              className="inline-badge-input"
              value={header.badge}
              onChange={(e) => handleHeaderUpdate("badge", e.target.value)}
              onBlur={handleCloseEdit}
              onKeyDown={(e) => e.key === "Enter" && handleCloseEdit()}
              autoFocus
            />
          ) : (
            <span
              onDoubleClick={() => handleStartHeaderEdit("badge")}
              className="badge-clickable-text"
            >
              {header.badge}
              {isAdmin && (
                <span
                  className="edit-glyph-indicator"
                  onClick={() => handleStartHeaderEdit("badge")}
                >
                  📝
                </span>
              )}
            </span>
          )}
        </div>
      </div>

      <div className="editable-wrapper">
        {isAdmin && editingHeaderField === "title" ? (
          <input
            type="text"
            className="inline-title-input"
            value={header.title}
            onChange={(e) => handleHeaderUpdate("title", e.target.value)}
            onBlur={handleCloseEdit}
            onKeyDown={(e) => e.key === "Enter" && handleCloseEdit()}
            autoFocus
          />
        ) : (
          <h2
            className="art-display-title"
            onDoubleClick={() => handleStartHeaderEdit("title")}
          >
            {header.title}
            {isAdmin && (
              <span
                className="edit-glyph-indicator"
                onClick={() => handleStartHeaderEdit("title")}
              >
                📝
              </span>
            )}
          </h2>
        )}
      </div>

      <div className="editable-wrapper">
        {isAdmin && editingHeaderField === "subtitle" ? (
          <textarea
            className="inline-desc-textarea"
            value={header.subtitle}
            onChange={(e) => handleHeaderUpdate("subtitle", e.target.value)}
            onBlur={handleCloseEdit}
            autoFocus
          />
        ) : (
          <p
            className="art-display-subtitle"
            onDoubleClick={() => handleStartHeaderEdit("subtitle")}
          >
            {header.subtitle}
            {isAdmin && (
              <span
                className="edit-glyph-indicator"
                onClick={() => handleStartHeaderEdit("subtitle")}
              >
                📝
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default ArtWorksDisplayHeader;
