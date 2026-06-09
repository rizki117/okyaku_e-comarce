//src/components/kategori/Kategori

import React, { useEffect, useState } from "react";
import styles from "./kategori.module.css";
import { getActiveKategori } from "../../services/kategoriService";

const Kategori = ({ active, setActive }) => {
  const [categories, setCategories] = useState([
    { id: null, name: "Semua" },
  ]);

  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const data = await getActiveKategori();
        setCategories([
          { id: null, name: "Semua" },
          ...data,
        ]);
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };

    fetchKategori();
  }, []);

  return (
    <div className={styles.categoryWrapper}>
      <div className={styles.categoryScroll}>
        {categories.map((item) => (
          <button
            key={item.id ?? "semua"}
            className={`${styles.categoryItem} ${
              active === item.name ? styles.active : ""
            }`}
            onClick={() => setActive({ id: item.id, name: item.name })}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Kategori;