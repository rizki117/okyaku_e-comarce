// components/navbarbawah/CartModal.jsx
import React, { useEffect, useState } from "react";
const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

import { X, ShoppingCart, Trash2, Plus, Minus, ChevronRight } from "lucide-react";
import "./CartModal.css";

const CartModal = ({ isOpen, onClose, cartItems = [], onUpdateQty, onRemove, onCheckoutItem, onImageClick }) => {
  const [visible, setVisible] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setSelectedIds([]);
    } else {
      setTimeout(() => setVisible(false), 200);
    }
  }, [isOpen]);

  if (!visible && !isOpen) return null;

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === cartItems.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cartItems.map((i) => i.id));
    }
  };

  const selectedItems = cartItems.filter((i) => selectedIds.includes(i.id));
  const totalSelected = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const getFirstImage = (image) => {
    if (!image) return null;
    try {
      const imgs = JSON.parse(image);
      return Array.isArray(imgs) ? imgs[0] : imgs;
    } catch {
      return image;
    }
  };

  return (
    <>
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <div className={`cart-modal ${isOpen ? "open" : ""}`}>

        <div className="cart-handle" />

        <div className="cart-header">
          <div className="cart-header-left">
            <ShoppingCart size={20} strokeWidth={2} />
            <h2 className="cart-title">Keranjang</h2>
            <span className="cart-count-badge">{cartItems.length}</span>
          </div>
          <button className="cart-close-btn" onClick={onClose}>
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>

        {cartItems.length > 0 && (
          <div className="cart-select-all">
            <label className="select-all-label">
              <input
                type="checkbox"
                className="cart-item-checkbox"
                checked={selectedIds.length === cartItems.length}
                onChange={toggleSelectAll}
              />
              <span>Pilih Semua</span>
            </label>
            <span className="selected-count">
              {selectedIds.length} dipilih
            </span>
          </div>
        )}

        <div className="cart-divider" />

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p className="cart-empty-title">Keranjang kosong</p>
              <p className="cart-empty-sub">Tambahkan produk favoritmu</p>
            </div>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item) => {
                const subtotal = item.price * item.quantity;
                const isSelected = selectedIds.includes(item.id);

                return (
                  <li
                    key={item.id}
                    className={`cart-item-card ${isSelected ? "selected" : ""}`}
                  >
                    <div className="cart-item-top">

                      <input
                        type="checkbox"
                        className="cart-item-checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(item.id)}
                      />

                      <div className="cart-item-img-wrap">
                        {item.image ? (
                          <img
                            src={BASE_IMAGE + getFirstImage(item.image)}
                            alt={item.name}
                            className="cart-item-img"
                            onClick={() => onImageClick(item)} // ← tambah
                            style={{ cursor: "pointer" }}      // ← tambah
                          />
                        ) : (
                          <div className="cart-item-img-placeholder">🛍️</div>
                        )}
                      </div>

                      <div className="cart-item-info">
                        <p className="cart-item-name">{item.name}</p>

                        {item.variant && (
                          <p className="cart-item-variant">
                            {item.variant.size} · {item.variant.color}
                          </p>
                        )}

                        <p className="cart-item-price-unit">
                          Rp {item.price.toLocaleString("id-ID")} / pcs
                        </p>
                      </div>

                      <button
                        className="cart-remove-btn"
                        onClick={() => onRemove(item.id)}
                        title="Hapus produk"
                      >
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </div>

                    <div className="cart-item-bottom">

                      <div className="qty-control">
                        <button
                          className="qty-btn minus"
                          onClick={() =>
                            item.quantity > 1
                              ? onUpdateQty(item.id, item.quantity - 1)
                              : onRemove(item.id)
                          }
                        >
                          <Minus size={13} strokeWidth={2.5} />
                        </button>

                        <div className="qty-display">
                          <span className="qty-number">{item.quantity}</span>
                          <span className="qty-unit">pcs</span>
                        </div>

                        <button
                          className="qty-btn plus"
                          onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        >
                          <Plus size={13} strokeWidth={2.5} />
                        </button>
                      </div>

                      <div className="cart-item-subtotal">
                        <span className="subtotal-label">Subtotal</span>
                        <span className="subtotal-value">
                          Rp {subtotal.toLocaleString("id-ID")}
                        </span>
                      </div>

                      <button
                        className="item-checkout-btn"
                        onClick={() => onCheckoutItem(item)}
                      >
                        Beli
                        <ChevronRight size={13} strokeWidth={2.5} />
                      </button>
                    </div>

                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span className="summary-label">
                  {selectedItems.length} produk · {selectedItems.reduce((s, i) => s + i.quantity, 0)} item
                </span>
                <span className="summary-total">
                  Rp {totalSelected.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
            <button
              className="cart-checkout-all-btn"
              disabled={selectedItems.length === 0}
              onClick={() => onCheckoutItem(selectedItems)}
            >
              Checkout ({selectedItems.length} produk)
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default CartModal;