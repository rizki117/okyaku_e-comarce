//bagian components/order/OrderDetailModal.jsx


import React from "react";
import { X, ShoppingBag } from "lucide-react";
import "./OrderDetailModal.css";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const OrderDetailModal = ({ isOpen, onClose, order,  onCancel}) => {

  console.log("ORDER DETAIL:", order);
  console.log("ORDER ITEMS:", order?.order_items);

  if (!isOpen || !order) return null;

  return (
    <>
      {/* Overlay */}
      <div className="detail-overlay" onClick={onClose} />

      {/* Modal */}
      <div
  className="detail-modal"
  onClick={(e) => e.stopPropagation()} 
>

        {/* Handle */}
        <div className="detail-handle" />

        {/* Header */}
        <div className="detail-header">
          <div className="detail-header-left">
            <ShoppingBag size={20} />
            <h3 className="detail-title">Detail Pesanan</h3>
            <span className="detail-count">#{order.id}</span>
          </div>

         <button className="detail-close-btn" onClick={(e) => {
  e.stopPropagation();
  onClose();
}}>
  <X size={18} strokeWidth={2.5} />
</button>
        </div>

        {/* Divider */}
        <div className="detail-divider" />

        {/* ✅ BODY (SCROLL AREA) */}
        <div className="detail-body">

          {/* Info Order */}
          <div className="detail-info">
      <p><b>ID:</b> #ORD-{order.id}</p>        
              
            <p>
              <b>Status:</b>{" "}
         <span className={`status ${order.status}`}>
                {order.status}
              </span>
            </p>

            <p>
              <b>Tanggal:</b>{" "}
              {new Date(order.createdAt).toLocaleDateString("id-ID")}
            </p>

            <p>
              <b>Total:</b>{" "}
              Rp {order.totalPrice.toLocaleString("id-ID")}
            </p>
 <p><b>Pembayaran:</b> {order.paymentMethod || "COD"}</p>
            <p>
              <b>Catatan:</b> {order.note || "-"}
            </p>
          </div>

          {/* Items */}
          <div className="detail-items">
            <p className="section-title">Produk</p>

            {order.order_items?.length === 0 && (
              <p className="empty-text">Tidak ada produk</p>
            )}

            {order.order_items?.map((item) => (
              <div key={item.id} className="item">

                {/* Gambar */}
                {item.product?.image && (() => {
                  let imgSrc = item.product.image;
                  try {
                    const parsed = JSON.parse(item.product.image);
                    if (Array.isArray(parsed)) imgSrc = parsed[0];
                  } catch {}

                  return (
                    <img
                      src={BASE_IMAGE + imgSrc}
                      alt={item.productName}
                      className="item-img"
                    />
                  );
                })()}

                <div className="item-left">
     <p className="item-name">{item.productName}</p>
     
     {item.product_variant && (
    <p className="item-variant">
      {item.product_variant.size} · {item.product_variant.color}
    </p>
  )}
                  <p className="item-qty">
                    {item.quantity} x Rp{" "}
                    {item.price.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="item-right">
                  Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                </div>

              </div>
            ))}
          </div>

          {/* Address */}
          {order.address && (
            <div className="detail-address">
              <p className="section-title">📦 Alamat Pengiriman</p>
              <p><b>Nama:</b> {order.address.recipient}</p>
              <p><b>NoHP:</b> {order.address.phone}</p>
              <p><b>Alamat:</b> {order.address.address}</p>
              <p><b>Kota:</b> {order.address.city}</p>
            </div>
          )}
          
          
 {/* Tombol Batalkan - hanya muncul saat pending */}
{order.status === "pending" && (
  <button className="btn-cancel-order" onClick={() => onCancel(order.id)}>
    Batalkan Pesanan
  </button>
)}         
          

        </div>

      </div>
    </>
  );
};

export default OrderDetailModal;
