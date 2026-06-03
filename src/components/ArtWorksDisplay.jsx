import React, { useState, useRef } from "react";
import { Images } from "../assets/images";
import "./css/ArtWorksDisplay.css";
import "./css/Hero.css";
import InteractiveBackground from "./InteractiveBackground";
import ArtWorksDisplayStack from "./ArtWorksDisplayStack";
import ArtWorksDisplayHeader from "./ArtWorksDisplayHeader";

const largeArtMatrix = [
  {
    id: 1,
    src: Images.draw1j,
    mediaType: "image",
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 01",
    specifications: "BIRO ON 300GSM PAPER",
    desc: "A meticulous study of deep contrast and cross-hatching gradients.",
  },
  {
    id: 2,
    src: Images.draw4j,
    mediaType: "image",
    mediumType: "Digital Art",
    title: "Algorithmic Fluidity 01",
    specifications: "GENERATIVE VECTOR LAYERS",
    desc: "Merging digital brush systems with generative pathways.",
  },
  {
    id: 3,
    src: Images.draw10j,
    mediaType: "image",
    mediumType: "Photography",
    title: "Luminescent Focus",
    specifications: "RAW MACRO CAPTURE",
    desc: "Utilizing environmental exposures to capture real-world micro textures.",
  },


  {
    id: 4,
    src: Images.draw5j,
    mediaType: "image",
    mediumType: "Photography",
    title: "Chroma Exposure",
    specifications: "REFRACTED LIGHT PRISM",
    desc: "Capturing high-density color rays on light-sensitive films.",
  },
    {
    id: 5,
    src: Images.draw3p,
    mediaType: "image",
    mediumType: "Digital Art",
    title: "Algorithmic Fluidity 02",
    specifications: "GENERATIVE CANVAS",
    desc: "Exploring procedural node loops under custom matrix engines.",
  },
  {
    id: 6,
    src: Images.draw11j,
    mediaType: "image",
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 03",
    specifications: "BIRO ON 300GSM PAPER",
    desc: "Fine pen hatching forming rhythmic lines across smooth paper panels.",
  },
    {
    id: 7,
    src: Images.draw1p,
    mediaType: "image",
    mediumType: "Traditional Ink",
    title: "Tactile Cross-Hatch 02",
    specifications: "BIRO ON 300GSM PAPER",
    desc: "Layered point pressure studies forming organic structures.",
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
        <ArtWorksDisplayHeader
          editingHeaderField={editingHeaderField}
          header={header}
          isAdmin={isAdmin}
          handleStartHeaderEdit={handleStartHeaderEdit}
          handleHeaderUpdate={handleHeaderUpdate}
          handleCloseEdit={handleCloseEdit}
        />

        <ArtWorksDisplayStack
          displayedItems={displayedItems}
          isAdmin={isAdmin}
          editingId={editingId}
          editingField={editingField}
          handleCloseEdit={handleCloseEdit}
          handleStartEdit={handleStartEdit}
          handleUpdate={handleUpdate}
          deleteCard={deleteCard}
        />

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
      <InteractiveBackground
        defaultFrequency={30}
        planetCount={2}
        ringedPlanetCount={15}
      />
    </section>
  );
};

export default ArtWorksDisplay;
