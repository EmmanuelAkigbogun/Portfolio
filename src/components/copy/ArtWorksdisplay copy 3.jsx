import React, { useState, useRef } from "react";
import { Images } from "../../assets/images";
import "./css/ArtWorksDisplay.css";
import "./css/Hero.css";
import InteractiveBackground from "../InteractiveBackground";

const largeArtMatrix = [
  {
    id: 1,
    src: Images.draw1j,
    mediaType: "image",
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 01",
    specifications: "Biro on 300gsm Paper",
    desc: "A meticulous study of deep contrast and cross-hatching gradients.",
  },
  {
    id: 2,
    src: Images.draw1p,
    mediaType: "image",
    mediumType: "Digital Art",
    title: "Algorithmic Fluidity 01",
    specifications: "Generative Vector Layers",
    desc: "Merging digital brush systems with generative pathways.",
  },
  {
    id: 3,
    src: Images.draw10j,
    mediaType: "image",
    mediumType: "Photography",
    title: "Luminescent Focus",
    specifications: "Raw Macro Capture",
    desc: "Utilizing environmental exposures to capture real-world micro textures.",
  },
  {
    id: 4,
    src: Images.draw4j,
    mediaType: "image",
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 02",
    specifications: "Biro on 300gsm Paper",
    desc: "Layered point pressure studies forming organic structures.",
  },
  {
    id: 5,
    src: Images.draw3p,
    mediaType: "image",
    mediumType: "Digital Art",
    title: "Algorithmic Fluidity 02",
    specifications: "Generative Canvas",
    desc: "Exploring procedural node loops under custom matrix engines.",
  },
  {
    id: 6,
    src: Images.draw5j,
    mediaType: "image",
    mediumType: "Photography",
    title: "Chroma Exposure",
    specifications: "Refracted Light Prism",
    desc: "Capturing high-density color rays on light-sensitive films.",
  },
  {
    id: 7,
    src: Images.draw11j,
    mediaType: "image",
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 03",
    specifications: "Biro on 300gsm Paper",
    desc: "Fine pen hatching forming rhythmic lines across smooth paper panels.",
  },
];

let nextId = largeArtMatrix.length + 1;

const NEW_CARD_DEFAULTS = {
  src: "",
  mediaType: "image",
  mediumType: "Medium Type",
  title: "New Artwork Title",
  specifications: "Specifications",
  desc: "Describe this artwork here.",
};

const toEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    // YouTube
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.replace("/", "");
      return `https://player.vimeo.com/video/${id}`;
    }
  } catch (_) {}
  return url;
};

const ImageEditor = ({ isAdmin, item, onUpdate }) => {
  const [showPanel, setShowPanel] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [activeTab, setActiveTab] = useState("image");
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const embedRef = useRef(null);
  const textRef = useRef(null);

  React.useEffect(() => {
    if (item.mediaType) {
      setActiveTab(item.mediaType);
    }
  }, [item.mediaType]);

  const handleFile = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "text") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onUpdate(item.id, "mediaType", "text");
        onUpdate(item.id, "src", ev.target.result);
      };
      reader.readAsText(file);
    } else {
      const url = URL.createObjectURL(file);
      onUpdate(item.id, "mediaType", type);
      onUpdate(item.id, "src", url);
    }
    setShowPanel(false);
  };

  const applyUrl = () => {
    if (!urlInput.trim()) return;
    if (activeTab === "image") {
      onUpdate(item.id, "mediaType", "image");
      onUpdate(item.id, "src", urlInput.trim());
    } else if (activeTab === "video") {
      onUpdate(item.id, "mediaType", "video");
      onUpdate(item.id, "src", urlInput.trim());
    } else if (activeTab === "embed") {
      onUpdate(item.id, "mediaType", "embed");
      onUpdate(item.id, "src", toEmbedUrl(urlInput.trim()));
    } else if (activeTab === "text") {
      onUpdate(item.id, "mediaType", "text");
      onUpdate(item.id, "src", urlInput.trim());
    }
    setUrlInput("");
    setShowPanel(false);
  };

  const renderMedia = () => {
    if (!item.src) {
      return (
        <div className="art-display-img-placeholder">
          <span>No Media</span>
        </div>
      );
    }
    // item.mediaType = activeTab;
    switch (item.mediaType) {
      case "video":
        return (
          <video
            src={item.src}
            controls
            className="art-display-img"
            style={{ objectFit: "contain" }}
          />
        );
      case "embed":
        return (
          <iframe
            src={item.src}
            className="art-display-img"
            style={{ border: "none", width: "100%", height: "100%" }}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title={item.title}
          />
        );
      case "text":
        return (
          <pre
            className="art-display-text-content"
            style={{ whiteSpace: "pre-wrap", overflowY: "auto" }}
          >
            {item.src}
          </pre>
        );
      case "image":
      default:
        return (
          <img src={item.src} alt={item.title} className="art-display-img" />
        );
    }
  };

  return (
    <div className="art-display-media-frame">
      {renderMedia()}
      {isAdmin && (
        <>
          <button
            className="image-edit-trigger"
            onClick={() => setShowPanel((v) => !v)}
          >
            🖼️ Change Media
          </button>
          {showPanel && (
            <div className="image-editor-panel">
              <div className="media-editor-tabs">
                {["image", "video", "embed", "text"].map((tab) => (
                  <button
                    key={tab}
                    className={`media-tab-btn ${activeTab === tab ? "active" : ""}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setUrlInput("");
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === "image" && (
                <>
                  <p className="image-editor-label">Paste image URL</p>
                  <input
                    type="text"
                    className="image-url-input"
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                  />
                  <button
                    className="image-url-apply-btn display-none-500"
                    onClick={applyUrl}
                  >
                    Apply URL
                  </button>
                  <p className="image-editor-label image-editor-or display-none-500">
                    — or —
                  </p>
                  <button
                    className="image-upload-btn"
                    onClick={() => imageRef.current?.click()}
                  >
                    Upload from device
                  </button>
                  <input
                    ref={imageRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e, "image")}
                  />
                </>
              )}

              {activeTab === "video" && (
                <>
                  <p className="image-editor-label">Paste video URL</p>
                  <input
                    type="text"
                    className="image-url-input"
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                  />
                  <button
                    className="image-url-apply-btn display-none-500"
                    onClick={applyUrl}
                  >
                    Apply Video URL
                  </button>
                  <p className="image-editor-label image-editor-or display-none-500">
                    — or —
                  </p>
                  <button
                    className="image-upload-btn"
                    onClick={() => videoRef.current?.click()}
                  >
                    Upload from device
                  </button>
                  <input
                    ref={videoRef}
                    type="file"
                    accept="video/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e, "video")}
                  />
                </>
              )}

              {activeTab === "embed" && (
                <>
                  <p className="image-editor-label">Paste any URL to embed</p>
                  <input
                    type="text"
                    className="image-url-input"
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyUrl()}
                  />
                  <button
                    className="image-url-apply-btn display-none-500"
                    onClick={applyUrl}
                  >
                    Embed URL
                  </button>
                  <p className="image-editor-label image-editor-or display-none-500">
                    — or —
                  </p>
                  <button
                    className="image-upload-btn"
                    onClick={() => embedRef.current?.click()}
                  >
                    Upload Files
                  </button>
                  <input
                    ref={embedRef}
                    type="file"
                    accept="*/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e, "embed")}
                  />
                </>
              )}

              {activeTab === "text" && (
                <>
                  <p className="image-editor-label">
                    Paste or type text content
                  </p>
                  <textarea
                    className="image-url-input text-area-input"
                    placeholder="Type raw document content here..."
                    value={urlInput}
                    style={{ minHeight: "60px", resize: "vertical" }}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <button className="image-url-apply-btn" onClick={applyUrl}>
                    Apply Text Source
                  </button>
                  <p className="image-editor-label image-editor-or display-none-500">
                    — or —
                  </p>
                  <button
                    className="image-upload-btn display-none-500"
                    onClick={() => textRef.current?.click()}
                  >
                    Upload from device
                  </button>
                  <input
                    ref={textRef}
                    type="file"
                    accept="text/*,.md,.json,.csv"
                    style={{ display: "none" }}
                    onChange={(e) => handleFile(e, "text")}
                  />
                </>
              )}

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

const ArtWorksDisplay = ({ isAdmin = true }) => {
  const [items, setItems] = useState(largeArtMatrix);

  const [header, setHeader] = useState({
    badge: "MULTIMODAL WORKSPACE",
    title: "Curated Creations",
    subtitle: "Analog pen precision, software design nodes, and photography.",
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editingHeaderField, setEditingHeaderField] = useState(null);

  const handleUpdate = (id, field, nextValue) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          // This targets the exact id and cleanly overrides the field (like mediaType)
          return { ...item, [field]: nextValue };
        }
        return item;
      }),
    );
  };

  const handleHeaderUpdate = (field, value) => {
    setHeader((prev) => ({ ...prev, [field]: value }));
  };

  const handleStartEdit = (id, field) => {
    if (!isAdmin) return;
    setEditingId(id);
    setEditingField(field);
    setEditingHeaderField(null);
  };

  const handleStartHeaderEdit = (field) => {
    if (!isAdmin) return;
    setEditingHeaderField(field);
    setEditingId(null);
    setEditingField(null);
  };

  const handleCloseEdit = () => {
    setEditingId(null);
    setEditingField(null);
    setEditingHeaderField(null);
  };

  const addCard = () => {
    setItems((prev) => [...prev, { ...NEW_CARD_DEFAULTS, id: nextId++ }]);
    setIsExpanded(true);
  };

  const deleteCard = (id) =>
    setItems((prev) => prev.filter((item) => item.id !== id));

  const displayedItems = isExpanded ? items : items.slice(0, 5);

  return (
    <section className="art-display-section">
      <div className="art-display-container">
        <div className="art-display-header">
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
              </span>
            )}
          </div>

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
            </h2>
          )}

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
                  {" "}
                  📝
                </span>
              )}
            </p>
          )}
        </div>

        <div className="art-display-stack">
          {displayedItems.map((item, index) => (
            <div
              key={item.id}
              className={`art-display-row ${index % 2 === 1 ? "reversed" : ""}`}
            >
              <div className="art-image-wrapper">
                <ImageEditor
                  isAdmin={isAdmin}
                  item={item}
                  onUpdate={handleUpdate}
                />

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

        <div className="gallery-footer-controls">
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
          {isAdmin && (
            <button className="btn-see-more" onClick={addCard}>
              <span>Add New Artwork</span>
              <span className="toggle-arrow">+</span>
            </button>
          )}
        </div>
      </div>

      <InteractiveBackground />
    </section>
  );
};

export default ArtWorksDisplay;
