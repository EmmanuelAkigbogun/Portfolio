import React, { useState, useRef } from "react";
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

let nextId = largeArtMatrix.length + 1;

const NEW_CARD_DEFAULTS = {
  src: "",
  mediumType: "Medium Type",
  title: "New Artwork Title",
  specifications: "Specifications",
  desc: "Describe this artwork here.",
};

// ─── Image editor ─────────────────────────────────────────────────────────────
const ImageEditor = ({ isAdmin, item, onUpdate }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [urlInput, setUrlInput] = useState(item.src || "");
  const fileRef = useRef(null);

  const applyUrl = () => {
    onUpdate(item.id, "src", urlInput);
    setShowPanel(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onUpdate(item.id, "src", url);
    setUrlInput(url);
    setShowPanel(false);
  };

  return (
    <div className="art-display-media-frame">
      {item.src ? (
        <img src={item.src} alt={item.title} className="art-display-img" />
      ) : (
        <div className="art-display-img-placeholder">
          <span>No Image</span>
        </div>
      )}
      {isAdmin && (
        <>
          <button
            className="image-edit-trigger"
            onClick={() => setShowPanel((v) => !v)}
          >
            🖼️ Change Image
          </button>
          {showPanel && (
            <div className="image-editor-panel">
              <p className="image-editor-label">Paste image URL</p>
              <input
                type="text"
                className="image-url-input"
                placeholder="https://..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && applyUrl()}
              />
              <button className="image-url-apply-btn" onClick={applyUrl}>
                Apply URL
              </button>
              <p className="image-editor-label image-editor-or">— or —</p>
              <button
                className="image-upload-btn"
                onClick={() => fileRef.current?.click()}
              >
                Upload from device
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFile}
              />
              <button
                className="image-editor-close"
                onClick={() => setShowPanel(false)}
              >
                ✕ Close
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const ArtWorksDisplay = ({ isAdmin = true }) => {
  const [items, setItems] = useState(largeArtMatrix);

  // Section-level shared editable strings
  const [headerBadge, setHeaderBadge] = useState("Multimodal Workspace");
  const [headerTitle, setHeaderTitle] = useState("Curated Creations");
  const [headerSubtitle, setHeaderSubtitle] = useState(
    "Analog pen precision, software design nodes, and photography.",
  );
  const [seeMoreLabel, setSeeMoreLabel] = useState("See More Works");
  const [collapseLabel, setCollapseLabel] = useState("Collapse Collection");

  // Shared across all cards — single action button
  const [actionLabel, setActionLabel] = useState("Examine Asset Architecture");
  const [actionArrow, setActionArrow] = useState("→");

  // Which header-level field is being edited
  const [editingHeader, setEditingHeader] = useState(null);

  // Which card field is being edited
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleUpdate = (id, field, val) =>
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    );

  const startEdit = (id, field) => {
    if (!isAdmin) return;
    setEditingId(id);
    setEditingField(field);
  };
  const closeEdit = () => {
    setEditingId(null);
    setEditingField(null);
  };

  const startHeaderEdit = (field) => {
    if (!isAdmin) return;
    setEditingHeader(field);
  };
  const closeHeaderEdit = () => setEditingHeader(null);

  const addCard = () => {
    setItems((prev) => [...prev, { ...NEW_CARD_DEFAULTS, id: nextId++ }]);
    setIsExpanded(true);
  };
  const deleteCard = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const displayed = isExpanded ? items : items.slice(0, 5);

  // ── Renders an editable badge/title/subtitle (section-level, not per-card) ──
  const SectionEditable = ({
    field,
    value,
    onChange,
    tag: Tag = "span",
    className,
    inputClass,
    multiline = false,
  }) => {
    const active = isAdmin && editingHeader === field;
    if (active) {
      return multiline ? (
        <textarea
          className={`edit-input-match ${inputClass || ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={closeHeaderEdit}
          autoFocus
        />
      ) : (
        <input
          type="text"
          className={`edit-input-match ${inputClass || ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={closeHeaderEdit}
          onKeyDown={(e) => e.key === "Enter" && closeHeaderEdit()}
          autoFocus
        />
      );
    }
    return (
      <Tag
        className={`${className || ""} editable-hover-zone`}
        onDoubleClick={() => startHeaderEdit(field)}
      >
        {value}
        {isAdmin && (
          <span
            className="edit-glyph-indicator"
            onClick={(e) => {
              e.stopPropagation();
              startHeaderEdit(field);
            }}
          >
            📝
          </span>
        )}
      </Tag>
    );
  };

  // ── Renders an editable single-line per-card field ──
  const CardEditable = ({
    id,
    field,
    value,
    tag: Tag = "span",
    className,
    inputClass,
  }) => {
    const active = isAdmin && editingId === id && editingField === field;
    if (active) {
      return (
        <input
          type="text"
          className={`edit-input-match ${inputClass || ""}`}
          value={value}
          onChange={(e) => handleUpdate(id, field, e.target.value)}
          onBlur={closeEdit}
          onKeyDown={(e) => e.key === "Enter" && closeEdit()}
          autoFocus
        />
      );
    }
    return (
      <Tag
        className={`${className || ""} editable-hover-zone`}
        onDoubleClick={() => startEdit(id, field)}
      >
        {value}
        {isAdmin && (
          <span
            className="edit-glyph-indicator"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(id, field);
            }}
          >
            📝
          </span>
        )}
      </Tag>
    );
  };

  // ── Renders an editable textarea per-card field ──
  const CardEditableArea = ({ id, field, value, className, inputClass }) => {
    const active = isAdmin && editingId === id && editingField === field;
    if (active) {
      return (
        <textarea
          className={`edit-input-match ${inputClass || ""}`}
          value={value}
          onChange={(e) => handleUpdate(id, field, e.target.value)}
          onBlur={closeEdit}
          autoFocus
        />
      );
    }
    return (
      <p
        className={`${className || ""} editable-hover-zone`}
        onDoubleClick={() => startEdit(id, field)}
      >
        {value}
        {isAdmin && (
          <span
            className="edit-glyph-indicator"
            onClick={(e) => {
              e.stopPropagation();
              startEdit(id, field);
            }}
          >
            📝
          </span>
        )}
      </p>
    );
  };

  return (
    <section className="art-display-section">
      <div className="art-display-container">
        {/* ── HEADER ── */}
        <div className="art-display-header">
          <SectionEditable
            field="badge"
            value={headerBadge}
            onChange={setHeaderBadge}
            className="art-display-badge"
            inputClass="input-badge"
          />
          <SectionEditable
            field="title"
            value={headerTitle}
            onChange={setHeaderTitle}
            tag="h2"
            className="art-display-title"
            inputClass="input-title"
          />
          <SectionEditable
            field="subtitle"
            value={headerSubtitle}
            onChange={setHeaderSubtitle}
            tag="p"
            className="art-display-subtitle"
            inputClass="input-subtitle"
            multiline
          />
        </div>

        {/* ── CARD STACK ── */}
        <div className="art-display-stack">
          {displayed.map((item, index) => (
            <div
              key={item.id}
              className={`art-display-row ${index % 2 === 1 ? "reversed" : ""}`}
            >
              {/* IMAGE */}
              <div className="art-image-wrapper">
                <ImageEditor
                  isAdmin={isAdmin}
                  item={item}
                  onUpdate={handleUpdate}
                />

                {/* Medium type badge */}
                <div
                  className={`medium-badge-overlay ${isAdmin ? "admin-active" : ""}`}
                >
                  {isAdmin &&
                  editingId === item.id &&
                  editingField === "mediumType" ? (
                    <input
                      type="text"
                      className="edit-input-match input-badge"
                      value={item.mediumType}
                      onChange={(e) =>
                        handleUpdate(item.id, "mediumType", e.target.value)
                      }
                      onBlur={closeEdit}
                      onKeyDown={(e) => e.key === "Enter" && closeEdit()}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="badge-clickable-text editable-hover-zone"
                      onDoubleClick={() => startEdit(item.id, "mediumType")}
                    >
                      {item.mediumType}
                      {isAdmin && (
                        <span
                          className="edit-glyph-indicator"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEdit(item.id, "mediumType");
                          }}
                        >
                          📝
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* DETAILS */}
              <div className="art-display-details-frame">
                {/* Specifications */}
                <div className="editable-wrapper art-display-meta-top">
                  <CardEditable
                    id={item.id}
                    field="specifications"
                    value={item.specifications}
                    className="art-display-medium"
                    inputClass="input-spec"
                  />
                </div>

                {/* Title */}
                <div className="editable-wrapper">
                  <CardEditable
                    id={item.id}
                    field="title"
                    value={item.title}
                    tag="h3"
                    className="art-display-heading"
                    inputClass="input-heading"
                  />
                </div>

                {/* Description */}
                <div className="editable-wrapper">
                  <CardEditableArea
                    id={item.id}
                    field="desc"
                    value={item.desc}
                    className="art-display-body"
                    inputClass="input-body"
                  />
                </div>

                {/* Action button — shared across all cards */}
                <div className="art-display-action-btn">
                  {isAdmin && editingHeader === "actionLabel" ? (
                    <input
                      type="text"
                      className="edit-input-match input-action"
                      value={actionLabel}
                      onChange={(e) => setActionLabel(e.target.value)}
                      onBlur={closeHeaderEdit}
                      onKeyDown={(e) => e.key === "Enter" && closeHeaderEdit()}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="action-label-text editable-hover-zone"
                      onDoubleClick={() => startHeaderEdit("actionLabel")}
                    >
                      {actionLabel}
                      {isAdmin && (
                        <span
                          className="edit-glyph-indicator"
                          onClick={(e) => {
                            e.stopPropagation();
                            startHeaderEdit("actionLabel");
                          }}
                        >
                          📝
                        </span>
                      )}
                    </span>
                  )}

                  {isAdmin && editingHeader === "actionArrow" ? (
                    <input
                      type="text"
                      className="edit-input-match input-arrow"
                      value={actionArrow}
                      onChange={(e) => setActionArrow(e.target.value)}
                      onBlur={closeHeaderEdit}
                      onKeyDown={(e) => e.key === "Enter" && closeHeaderEdit()}
                      autoFocus
                    />
                  ) : (
                    <span
                      className="action-arrow-glyph editable-hover-zone"
                      onDoubleClick={() => startHeaderEdit("actionArrow")}
                    >
                      {actionArrow}
                      {isAdmin && (
                        <span
                          className="edit-glyph-indicator"
                          onClick={(e) => {
                            e.stopPropagation();
                            startHeaderEdit("actionArrow");
                          }}
                        >
                          📝
                        </span>
                      )}
                    </span>
                  )}
                </div>

                {/* Delete — fully invisible until card hover, no border visible either */}
                {isAdmin && (
                  <button
                    className="btn-delete-card"
                    onClick={() => deleteCard(item.id)}
                  >
                    🗑️ Remove Card
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div className="gallery-footer-controls">
          {items.length > 5 && (
            <div className="gallery-see-more-wrap">
              <button
                className="btn-see-more"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <SectionEditable
                  field={isExpanded ? "collapse" : "seeMore"}
                  value={isExpanded ? collapseLabel : seeMoreLabel}
                  onChange={isExpanded ? setCollapseLabel : setSeeMoreLabel}
                  className="toggle-label-text"
                  inputClass="input-action"
                />
                <span className={`toggle-arrow ${isExpanded ? "rotated" : ""}`}>
                  ↓
                </span>
              </button>
            </div>
          )}
          {isAdmin && (
            <button className="btn-add-card" onClick={addCard}>
              <span>＋ Add New Card</span>
            </button>
          )}
        </div>
      </div>

      <InteractiveBackground defaultFrequency={20} defaultParticles={400} />
    </section>
  );
};

export default ArtWorksDisplay;
