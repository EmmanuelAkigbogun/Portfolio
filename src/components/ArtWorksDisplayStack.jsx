import { ArtWorksDisplayImageEditor } from "./ArtWorksDisplayImageEditor";
function ArtWorksDisplayStack({
  isAdmin,
  displayedItems,
  editingId,
  editingField,
  handleCloseEdit,
  handleStartEdit,
  handleUpdate,
  deleteCard
}) {
  return (
    <div className="art-display-stack">
      {displayedItems.map((item, index) => (
        <div
          key={item.id}
          className={`art-display-row ${index % 2 === 1 ? "reversed" : ""}`}
        >
          <div className="art-image-wrapper">
            <ArtWorksDisplayImageEditor
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
                  onDoubleClick={() => handleStartEdit(item.id, "mediumType")}
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
                      onClick={() => handleStartEdit(item.id, "specifications")}
                    >
                      📝
                    </span>
                  )}
                </span>
              )}
            </div>

            <div className="editable-wrapper">
              {isAdmin && editingId === item.id && editingField === "title" ? (
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
              {isAdmin && editingId === item.id && editingField === "desc" ? (
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
  );
}
export default ArtWorksDisplayStack;
