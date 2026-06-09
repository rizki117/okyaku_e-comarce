//components/navbarbawah/OrdersTab.jsx

import React from "react";
import { ShoppingBag } from "lucide-react";
import styles from "./orderstab.module.css";

const OrdersTab = ({ isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`nav-tab-item ${isActive ? "active pesanan" : ""}`}
    >
      <ShoppingBag className={`nav-tab-icon ${isActive ? styles.activeIcon : ""}`} />

      <span className={`nav-tab-label ${isActive ? styles.activeLabel : ""}`}>
        Pesanan
      </span>
    </button>
  );
};

export default OrdersTab;