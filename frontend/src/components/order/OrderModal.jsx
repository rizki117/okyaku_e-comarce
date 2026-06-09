//bagian components/order/OrderModal.jsx

import React, { useEffect, useState } from "react";
import { X, ShoppingBag, ChevronRight } from "lucide-react";
import "./OrderModal.css";

const OrderModal = ({ isOpen, onClose, orders = [], onDetail }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    } else {
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  // ❌ jangan render kalau modal tertutup
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`order-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`order-modal ${isOpen ? "open" : ""}`}>

        {/* Handle */}
        <div className="order-handle" />

        {/* Header */}
        <div className="order-header">
          <div className="order-header-left">
            <ShoppingBag size={20} />
            <h2 className="order-title">Pesanan</h2>
            <span className="order-count">
              {Array.isArray(orders) ? orders.length : 0}
            </span>
          </div>

          <button className="order-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="order-divider" />

        {/* Body */}
        <div className="order-body">

          {/* EMPTY STATE */}
          {(!Array.isArray(orders) || orders.length === 0) ? (
            <div className="order-empty">
              <div className="order-empty-icon">📦</div>
              <p className="order-empty-title">Belum ada pesanan</p>
              <p className="order-empty-sub">
                Semua pesanan akan muncul di sini
              </p>
            </div>
          ) : (
            <ul className="order-list">

              {Array.isArray(orders) && orders.map((order) => (
                <li key={order.id} className="order-card">

                  {/* TOP */}
                  <div className="order-top">
                    <div className="order-info">
                      <p className="order-id">#ORD-{order.id}</p>

                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <span className={`order-status ${order.status}`}>
                      {order.status}
                    </span>
                  </div>

                  {/* MIDDLE */}
                  <div className="order-middle">

                    <p className="order-items">
                      {order.note || "Tidak ada catatan"}
                    </p>

                    <p className="order-total">
                      Rp {order.totalPrice?.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* ACTION */}
                  <div className="order-action">
                    <button
                      className="order-detail-btn"
                      onClick={() => onDetail(order)}
                    >
                      Detail
                      <ChevronRight size={14} />
                    </button>
                  </div>

                </li>
              ))}

            </ul>
          )}

        </div>

      </div>
    </>
  );
};

export default OrderModal;