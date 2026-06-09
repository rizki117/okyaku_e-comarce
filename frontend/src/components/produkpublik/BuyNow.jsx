import React, { useState, useRef } from "react";
import { X, Plus, Minus } from "lucide-react";
import "./addToCarModal.css";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const BuyNow = ({ product, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef(null);

  if (!product) return null;

  // =========================
  // IMAGE HANDLING
  // =========================

// BARU
const getImages = (image) => {
  if (!image) return [];
  if (Array.isArray(image)) return image;
  if (typeof image === "string") {
    try {
      const parsed = JSON.parse(image);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [image];
    }
  }
  return [];
};
const images = getImages(product.image);

  // =========================
  // VARIANT CHECK
  // =========================
  const hasVariants =
    Array.isArray(product.product_variants) &&
    product.product_variants.length > 0;

  // =========================
  // SLIDER SCROLL
  // =========================
  const handleScroll = () => {
    if (!sliderRef.current) return;

    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);

    setActiveIndex(index);
  };

  // =========================
  // QTY HANDLER
  // =========================
  const handleQty = (type) => {
    setQuantity((prev) => {
      if (type === "dec") return prev <= 1 ? 1 : prev - 1;
      return prev + 1;
    });
  };

  // =========================
  // CONFIRM BUY NOW
  // =========================
  const handleConfirm = () => {
    if (hasVariants && !selectedVariant) return;

    onConfirm({
      quantity,
      variant: selectedVariant,
    });
  };

  const isDisabled =
    hasVariants && !selectedVariant;

  return (
    <div className="atcm-overlay" onClick={onClose}>
      <div className="atcm-sheet" onClick={(e) => e.stopPropagation()}>

        {/* HANDLE / CLOSE */}
        <div className="atcm-handle" />

        <button className="atcm-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* =========================
            CONTENT
        ========================= */}
        <div className="atcm-content">

          {/* IMAGE SLIDER */}
          <div className="atcm-image-slider">
            <div
              className="atcm-slider-track"
              ref={sliderRef}
              onScroll={handleScroll}
            >
              {images.map((img, i) => (
                <img
                  key={i}
                  className="atcm-slide-img"
                  src={
                    img
                      ? BASE_IMAGE + img
                      : "/images/no-image.png"
                  }
                  alt={product.name}
                />
              ))}
            </div>

            {/* COUNTER */}
            <div className="atcm-img-counter">
              {activeIndex + 1} / {images.length}
            </div>
          </div>

          {/* INFO */}
          <div className="atcm-big-info">
            <p className="atcm-big-price">
              Rp {product.price?.toLocaleString("id-ID")}
            </p>

            <p className="atcm-big-name">
              {product.name}
            </p>
          </div>

          <div className="atcm-divider" />

          {/* VARIANTS */}
          {hasVariants && (
            <div className="atcm-section">
              <p className="atcm-label">
                Pilih Varian
              </p>

              <div className="atcm-variants">
                {product.product_variants.map((v) => (
                  <button
                    key={v.id}
                    className={`atcm-variant-btn ${
                      selectedVariant?.id === v.id ? "active" : ""
                    }`}
                    onClick={() => setSelectedVariant(v)}
                  >
                    {v.size} - {v.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="atcm-divider" />

          {/* QTY */}
          <div className="atcm-section atcm-qty-row">
            <p className="atcm-label">Jumlah</p>

            <div className="atcm-qty">
              <button
                className="atcm-qty-btn"
                onClick={() => handleQty("dec")}
              >
                <Minus size={16} />
              </button>

              <span className="atcm-qty-val">
                {quantity}
              </span>

              <button
                className="atcm-qty-btn"
                onClick={() => handleQty("inc")}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="atcm-footer">
          <button
            className="atcm-confirm-btn"
            onClick={handleConfirm}
            disabled={isDisabled}
          >
            Pilih Alamat
          </button>

          {hasVariants && !selectedVariant && (
            <p className="atcm-hint">
              Pilih varian terlebih dahulu
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default BuyNow;
