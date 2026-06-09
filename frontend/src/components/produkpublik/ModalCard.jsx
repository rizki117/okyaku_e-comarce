//components/produkpublik/ModalCard.jsx

import React, { useState, useRef } from "react";
import { MessageCircle, ShoppingCart, CreditCard } from "lucide-react";
import "./modalCard.css";


import Snackbar from "../animasi/Snackbar";
import BuyNow from "./BuyNow";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const ModalCard = ({ product, user, onClose, onAddToCart, onBuyNow }) => {
  const isLoggedIn = !!user;

  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  const [showBuyNow, setShowBuyNow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef(null);

  if (!product) return null;

  // =========================
  // IMAGE
  // =========================
  let images = [];
if (Array.isArray(product.image)) {
  images = product.image;
} else if (product.image) {
  try {
    const parsed = JSON.parse(product.image);
    images = Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    images = [product.image];
  }
}

  const sellerInitial =
    product.user?.name?.charAt(0)?.toUpperCase() ?? "?";

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ message, type, visible: true });
    setTimeout(
      () => setSnackbar({ message: "", type: "success", visible: false }),
      1500
    );
  };

  // =========================
  // SLIDER
  // =========================
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const scrollLeft = sliderRef.current.scrollLeft;
    const width = sliderRef.current.offsetWidth;
    const index = Math.round(scrollLeft / width);
    setActiveIndex(index);
  };

  // =========================
  // CART
  // =========================
  const handleAddCart = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      showSnackbar("Silakan login dulu", "error");
      return;
    }
    onAddToCart(product);
  };

  // =========================
  // BUY NOW (OPEN MODAL)
  // =========================
  const handleBeli = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      showSnackbar("Silakan login dulu", "error");
      return;
    }
    setShowBuyNow(true);
  };

  // =========================
  // BUY NOW CONFIRM (NAIK KE PARENT)
  // =========================
  const handleBuyNowConfirm = (data) => {
    setShowBuyNow(false);
    onBuyNow(product, data);
  };

  // =========================
  // CHAT WA
  // =========================
  const handleChat = (e) => {
    e.stopPropagation();

    const phone = product.user?.phone;
    if (!phone) return;

    const formatted = phone.startsWith("0")
      ? "62" + phone.slice(1)
      : phone;

    const now = new Date();

    const tanggal = now.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    const jam = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const pesan =
      `[ Pesan: Tanggal ${tanggal} | ${jam} ]\n\n` +
      `Hello ${product.user?.name}, apakah ${product.name} masih tersedia?`;

    window.open(
      `https://wa.me/${formatted}?text=${encodeURIComponent(pesan)}`,
      "_blank"
    );
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-card" onClick={(e) => e.stopPropagation()}>

          <div className="modal-handle" />
          <button className="modal-close" onClick={onClose}>✕</button>

          {/* BODY */}
          <div className="modal-body">

            {/* IMAGE */}
            <div className="modal-image-slider">
              <div
                className="slider-track"
                ref={sliderRef}
                onScroll={handleScroll}
              >
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={img ? BASE_IMAGE + img : "/images/no-image.png"}
                    alt={product.name}
                  />
                ))}
              </div>

              <div className="img-counter">
                {activeIndex + 1} / {images.length}
              </div>
            </div>

            {/* INFO */}
            <div className="modal-content">
              <div className="price-row">
                <span className="modal-price">
                  Rp {product.price?.toLocaleString("id-ID")}
                </span>
              </div>

              <p className="modal-name">{product.name}</p>

              <div className="sec-divider" />

              <div className="seller-row">
                <div className="seller-avatar">{sellerInitial}</div>
                <div className="seller-info">
                  <p className="seller-name-txt">{product.user?.name}</p>
                  <p className="seller-sub">Penjual · OkYaku</p>
                </div>
              </div>

              <p className="desc-heading">Deskripsi Produk</p>
              <p className="modal-desc">{product.description}</p>
            </div>
          </div>

          {/* ACTION */}
          <div className="modal-actions">

            <button className="btn-icon" onClick={handleChat}>
              <MessageCircle size={20} />
            </button>

            {isLoggedIn && (
              <button className="btn-cart" onClick={handleAddCart}>
                <ShoppingCart size={18} />
                <span>Keranjang</span>
              </button>
            )}

            {isLoggedIn && (
              <button className="btn-buy" onClick={handleBeli}>
                <CreditCard size={18} />
                <span>Beli Sekarang</span>
              </button>
            )}

            {!isLoggedIn && (
              <button className="btn-buy" onClick={handleChat}>
                <MessageCircle size={18} />
                <span>Chat Penjual</span>
              </button>
            )}
          </div>

          <Snackbar {...snackbar} />
        </div>
      </div>

      {/* BUY NOW MODAL */}
      {showBuyNow && (
        <BuyNow
          product={product}
          onClose={() => setShowBuyNow(false)}
          onConfirm={handleBuyNowConfirm}
        />
      )}
    </>
  );
};

export default ModalCard;
