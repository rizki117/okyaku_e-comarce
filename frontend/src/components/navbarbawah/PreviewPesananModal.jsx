import React from "react";
import { X, ShoppingBag } from "lucide-react";
import "./PreviewPesananModal.css";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const PAYMENT_LOGOS = {
  DANA:  "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_dana_blue.svg",

  GOPAY: "https://upload.wikimedia.org/wikipedia/commons/8/86/Gopay_logo.svg",

  COD:    "https://cdn-icons-png.flaticon.com/512/2489/2489756.png",
};


const PreviewPesananModal = ({
  isOpen,
  onClose,
  items = [],
  address,
  onConfirm,
  loading,
  paymentMethod,
  setPaymentMethod,
}) => {
  if (!isOpen) return null;

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const getFirstImage = (image) => {
    if (!image) return null;
  if (Array.isArray(image)) return image[0]; 
    try {
      const parsed = JSON.parse(image);
      return Array.isArray(parsed) ? parsed[0] : parsed;
    } catch {
      return image;
    }
  };

  return (
    <>
      <div className="preview-overlay" onClick={onClose} />

      <div
        className="preview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="preview-handle" />

        {/* Header */}
        <div className="preview-header">
          <div className="preview-header-left">
            <ShoppingBag size={20} />
            <h3 className="preview-title">Preview Pesanan</h3>
          </div>

          <button
            className="preview-close-btn"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="preview-divider" />

        {/* Body */}
        <div className="preview-body">

          {/* Produk */}
          <div className="preview-items">
            <p className="section-title">Produk</p>

            {items.map((item) => (
              <div key={item.id} className="preview-item">

                {/* Gambar */}
                {item.image && (
                  <img
                    src={BASE_IMAGE + getFirstImage(item.image)}
                    alt={item.name}
                    className="preview-item-img"
                  />
                )}

                {/* Info */}
                <div className="preview-item-info">
                  <p className="preview-item-name">
                    {item.name}
                  </p>

                  {item.variant && (
                    <p className="preview-item-variant">
                      {item.variant.size} · {item.variant.color}
                    </p>
                  )}

                  <p className="preview-item-qty">
                    {item.quantity} x Rp{" "}
                    {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Subtotal */}
                <div className="preview-item-subtotal">
                  Rp{" "}
                  {(item.price * item.quantity).toLocaleString(
                    "id-ID"
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="preview-total">
            <span>Total</span>

            <b>
              Rp {total.toLocaleString("id-ID")}
            </b>
          </div>


{/* PAYMENT METHOD */}
<div className="preview-payment">
  <details className="payment-dropdown">
    <summary className="payment-summary">
      <span>💳 Metode Pembayaran</span>
      <span className="payment-selected-label">
        {paymentMethod || "Pilih metode"}
      </span>
    </summary>

    <div className="payment-options">
      {[
        { key: "COD",   label: "Cash On Delivery", sub: "Bayar di tempat", note: null },
        { key: "DANA",  label: "DANA",              sub: "Via DANA",        note: "*Bayar Langsung" },
        { key: "GOPAY", label: "GoPay",             sub: "Via GoPay",       note: "*Bayar Langsung" },
      ].map(({ key, label, sub, note }) => (
        <label
          key={key}
          className={`payment-option-row ${paymentMethod === key ? "active" : ""}`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={key}
            checked={paymentMethod === key}
            onChange={() => setPaymentMethod(key)}
            className="payment-radio"
          />

          <img
            src={PAYMENT_LOGOS[key]}
            alt={key}
            className="payment-real-logo"
          />

          <div className="payment-option-text">
            {note && <span className="payment-note">{note}</span>}
            <p className="payment-title">{label}</p>
            <span className="payment-sub">{sub}</span>
          </div>
        </label>
      ))}
    </div>
  </details>
</div>



          {/* Address */}
          {address && (
            <div className="preview-address">
              <p className="section-title">
                📦 Alamat Pengiriman
              </p>

              <p>
                <b>Nama:</b> {address.recipient}
              </p>

              <p>
                <b>NoHP:</b> {address.phone}
              </p>

              <p>
                <b>Alamat:</b> {address.address}
              </p>

              <p>
                <b>Kota:</b> {address.city}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="preview-footer">
          <button
            className="preview-confirm-btn"
            onClick={onConfirm}
            disabled={loading || !paymentMethod}
          >
            {loading
              ? "Mengirim..."
              : "Kirim Pesanan"}
          </button>
        </div>
      </div>
    </>
  );
};

export default PreviewPesananModal;
