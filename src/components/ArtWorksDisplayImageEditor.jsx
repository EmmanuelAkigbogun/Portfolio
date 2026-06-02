import React, { useState, useRef } from "react";
export const toEmbedUrl = (url) => {
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

export const ArtWorksDisplayImageEditor = ({ isAdmin, item, onUpdate }) => {
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
