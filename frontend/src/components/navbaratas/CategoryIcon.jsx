import React from "react";
import { LayoutGrid } from "lucide-react";
import styles from "./categoryicon.module.css";

const CategoryIcon = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles.iconWrapper}>
      <LayoutGrid className={styles.icon} strokeWidth={2.5} />
      <span className={styles.iconText}>Kategori</span>
    </button>
  );
};

export default CategoryIcon;