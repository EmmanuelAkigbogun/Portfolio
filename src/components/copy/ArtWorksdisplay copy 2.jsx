import React, { useState } from "react";
import { Images } from "../../assets/images";
import "./css/ArtWorksDisplay.css";
import "./css/Hero.css";
import InteractiveBackground from "../InteractiveBackground";

const largeArtMatrix = [
  {
    id: 1,
    src: Images.draw1j,
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 01",
    specifications: "Biro on 300gsm Paper",
    desc: "A meticulous study of deep contrast and cross-hatching gradients.",
  },
  {
    id: 2,
    src: Images.draw1p,
    mediumType: "Digital Art",
    title: "Algorithmic Fluidity 01",
    specifications: "Generative Vector Layers",
    desc: "Merging digital brush systems with generative pathways.",
  },
  {
    id: 3,
    src: Images.draw10j,
    mediumType: "Photography",
    title: "Luminescent Focus",
    specifications: "Raw Macro Capture",
    desc: "Utilizing environmental exposures to capture real-world micro textures.",
  },
  {
    id: 4,
    src: Images.draw4j,
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 02",
    specifications: "Biro on 300gsm Paper",
    desc: "Layered point pressure studies forming organic structures.",
  },
  {
    id: 5,
    src: Images.draw3p,
    mediumType: "Digital Art",
    title: "Algorithmic Fluidity 02",
    specifications: "Generative Canvas",
    desc: "Exploring procedural node loops under custom matrix engines.",
  },
  {
    id: 6,
    src: Images.draw5j,
    mediumType: "Photography",
    title: "Chroma Exposure",
    specifications: "Refracted Light Prism",
    desc: "Capturing high-density color rays on light-sensitive films.",
  },
  {
    id: 7,
    src: Images.draw11j,
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 03",
    specifications: "Biro on 300gsm Paper",
    desc: "Fine pen hatching forming rhythmic lines across smooth paper panels.",
  },
];

const ArtWorksDisplay = ({ isAdmin = true }) => {
  const [items, setItems] = useState(largeArtMatrix);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);

  const handleUpdate = (id, field, nextValue) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: nextValue } : item,
      ),
    );
  };

  const handleStartEdit = (id, field) => {
    if (!isAdmin) return;
    setEditingId(id);
    setEditingField(field);
  };

  const handleCloseEdit = () => {
    setEditingId(null);
    setEditingField(null);
  };

  const displayedItems = isExpanded ? items : items.slice(0, 5);

  return (
    <section className="art-display-section">
      <div className="art-display-container">
        <div className="art-display-header">
          <span className="art-display-badge">Multimodal Workspace</span>
          <h2 className="art-display-title">Curated Creations</h2>
          <p className="art-display-subtitle">
            Analog pen precision, software design nodes, and photography.
            {isAdmin && " Double-click items to edit."}
          </p>
        </div>

        <div className="art-display-stack">
          {displayedItems.map((item, index) => (
            <div
              key={item.id}
              className={`art-display-row ${index % 2 === 1 ? "reversed" : ""}`}
            >
              <div className="art-display-media-frame">
                <img
                  src={item.src}
                  alt={item.title}
                  className="art-display-img"
                />

                {/* EDITABLE MEDIUM TYPE OVERLAY */}
                <div
                  className={`medium-badge-overlay ${isAdmin ? "admin-active" : ""}`}
                >
                  {isAdmin &&
                  editingId === item.id &&
                  editingField === "mediumType" ? (
                    <input
                      type="text"
                      className="inline-badge-input"
                      value={item.mediumType}
                      onChange={(e) =>
                        handleUpdate(item.id, "mediumType", e.target.value)
                      }
                      onBlur={handleCloseEdit}
                      onKeyDown={(e) => e.key === "Enter" && handleCloseEdit()}
                      autoFocus
                    />
                  ) : (
                    <span
                      onDoubleClick={() =>
                        handleStartEdit(item.id, "mediumType")
                      }
                      className="badge-clickable-text"
                    >
                      {item.mediumType}
                    </span>
                  )}
                </div>
              </div>

              <div className="art-display-details-frame">
                {/* EDITABLE SPECIFICATIONS */}
                <div className="editable-wrapper art-display-meta-top">
                  {isAdmin &&
                  editingId === item.id &&
                  editingField === "specifications" ? (
                    <input
                      type="text"
                      className="inline-spec-input"
                      value={item.specifications}
                      onChange={(e) =>
                        handleUpdate(item.id, "specifications", e.target.value)
                      }
                      onBlur={handleCloseEdit}
                      onKeyDown={(e) => e.key === "Enter" && handleCloseEdit()}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="art-display-medium"
                      onDoubleClick={() =>
                        handleStartEdit(item.id, "specifications")
                      }
                    >
                      {item.specifications}{" "}
                      {isAdmin && (
                        <span
                          className="edit-glyph-indicator"
                          onClick={() =>
                            handleStartEdit(item.id, "specifications")
                          }
                        >
                          📝
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* EDITABLE TITLE */}
                <div className="editable-wrapper">
                  {isAdmin &&
                  editingId === item.id &&
                  editingField === "title" ? (
                    <input
                      type="text"
                      className="inline-title-input"
                      value={item.title}
                      onChange={(e) =>
                        handleUpdate(item.id, "title", e.target.value)
                      }
                      onBlur={handleCloseEdit}
                      onKeyDown={(e) => e.key === "Enter" && handleCloseEdit()}
                      autoFocus
                    />
                  ) : (
                    <h3
                      className="art-display-heading"
                      onDoubleClick={() => handleStartEdit(item.id, "title")}
                    >
                      {item.title}{" "}
                      {isAdmin && (
                        <span
                          className="edit-glyph-indicator"
                          onClick={() => handleStartEdit(item.id, "title")}
                        >
                          📝
                        </span>
                      )}
                    </h3>
                  )}
                </div>

                {/* EDITABLE DESCRIPTION */}
                <div className="editable-wrapper">
                  {isAdmin &&
                  editingId === item.id &&
                  editingField === "desc" ? (
                    <textarea
                      className="inline-desc-textarea"
                      value={item.desc}
                      onChange={(e) =>
                        handleUpdate(item.id, "desc", e.target.value)
                      }
                      onBlur={handleCloseEdit}
                      autoFocus
                    />
                  ) : (
                    <p
                      className="art-display-body"
                      onDoubleClick={() => handleStartEdit(item.id, "desc")}
                    >
                      {item.desc}{" "}
                      {isAdmin && (
                        <span
                          className="edit-glyph-indicator"
                          onClick={() => handleStartEdit(item.id, "desc")}
                        >
                          📝
                        </span>
                      )}
                    </p>
                  )}
                </div>

                <div className="art-display-action-btn">
                  <span>Examine Asset Architecture</span>
                  <span className="action-arrow-glyph">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 5 && (
          <div className="gallery-see-more-wrap">
            <button
              className="btn-see-more"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <span>
                {isExpanded ? "Collapse Collection" : "See More Works"}
              </span>
              <span className={`toggle-arrow ${isExpanded ? "rotated" : ""}`}>
                ↓
              </span>
            </button>
          </div>
        )}
      </div>
      <InteractiveBackground defaultFrequency={20} defaultParticles={400} />
    </section>
  );
};

export default ArtWorksDisplay;
