//components/animasi/ConfirmDialog.jsx

import React from "react";
import "./confirmDialog.css";

const ConfirmDialog = ({ isOpen, title, subtitle, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="confirm-overlay" onClick={onCancel} />
      <div
        className="confirm-dialog"
        onClick={(e) => e.stopPropagation()} // ✅ tambah ini
      >
          
        <p className="confirm-title">{title}</p>
        <p className="confirm-sub">{subtitle}</p>
        <div className="confirm-actions">
          <button className="confirm-btn-no" onClick={onCancel}>
            Tidak
          </button>
          <button className="confirm-btn-yes" onClick={onConfirm}>
            Ya
          </button>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;