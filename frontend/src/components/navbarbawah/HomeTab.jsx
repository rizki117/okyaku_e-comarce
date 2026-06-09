//components/navbarbawah/HomeTab.jsx

import React from "react";
import { Home } from "lucide-react";
import styles from "./hometab.module.css";

const HomeTab = ({ isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`nav-tab-item ${isActive ? "active beranda" : ""}`}
      aria-label="Beranda"
    >
      {/* ICON */}
      <Home
        className={`nav-tab-icon ${
          isActive ? styles.activeBerandaIcon : ""
        }`}
      />

      {/* LABEL */}
      <span
        className={`nav-tab-label ${
          isActive ? styles.activeBerandaLabel : ""
        }`}
      >
        Beranda
      </span>

      {/* (opsional) indicator tetap ada tapi tidak diubah */}
      <div className="nav-tab-indicator"></div>
    </button>
  );
};

export default HomeTab;