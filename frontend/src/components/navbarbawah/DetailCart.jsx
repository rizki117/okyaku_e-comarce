import React, { useState, useRef } from "react";
import { MessageCircle, CreditCard } from "lucide-react";
import "./DetailCart.css";

import useGetMe from "../../hooks/useGetMe";
import Snackbar from "../animasi/Snackbar";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const DetailCart = ({ product, cartItem, onClose, onBuyNow }) => {
  const { user } = useGetMe();
  const isLoggedIn = !!user;

  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef(null);

  if (!product || !cartItem) return null;

  // =========================
  // IMAGE — parse JSON string
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

  const sellerInitial = product.user?.name?.charAt(0)?.toUpperCase() ?? "?";

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
  // BELI SEKARANG
  // pakai cartItem langsung, tidak buka modal baru
  // =========================
  const handleBeli = (e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      showSnackbar("Silakan login dulu", "error");
      return;
    }
    onBuyNow(cartItem); // ← kirim cart item ke NavbarBawah → handleCheckoutItem
  };

  // =========================
  // CHAT WA
  // =========================
  const handleChat = (e) => {
    e.stopPropagation();
    const phone = product.user?.phone;
    if (!phone) return;

    const formatted = phone.startsWith("0") ? "62" + phone.slice(1) : phone;
    const now = new Date();

    const tanggal = now.toLocaleDateString("id-ID", {
      day: "2-digit", month: "2-digit", year: "2-digit",
    });
    const jam = now.toLocaleTimeString("id-ID", {
      hour: "2-digit", minute: "2-digit", hour12: false,
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>

        <div className="modal-handle" />
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* BODY */}
        <div className="modal-body">

          {/* IMAGE SLIDER */}
          <div className="modal-image-slider">
            <div className="slider-track" ref={sliderRef} onScroll={handleScroll}>
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

            {/* QUANTITY & VARIANT DARI CART */}
            <div className="dc-cart-info">
              <span className="dc-qty-badge">
                Jumlah: <b>{cartItem.quantity} pcs</b>
              </span>

              {cartItem.variant && (
                <span className="dc-variant-badge">
                  {cartItem.variant.size} · {cartItem.variant.color}
                </span>
              )}
            </div>

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
  );
};

export default DetailCart;