
import React from "react";
import { ShoppingCart } from "lucide-react";
import styles from "./carttab.module.css";
import useCartStore from "../../store/cartStore";

const CartTab = ({ isActive, onClick }) => {
  const cartItems = useCartStore((state) => state.cartItems);

  return (
    <button
      onClick={onClick}
      className={`nav-tab-item ${isActive ? "active cart" : ""}`}
    >
      <div className="icon-wrapper">
        <ShoppingCart className={`nav-tab-icon ${isActive ? styles.activeIcon : ""}`} />

        {cartItems.length > 0 && (
          <span className="nav-badge">
            {cartItems.length}
          </span>
        )}
      </div>

      <span className={`nav-tab-label ${isActive ? styles.activeLabel : ""}`}>
        Cart
      </span>
    </button>
  );
};

export default CartTab;
