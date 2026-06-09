// src/components/ProdukList.jsx

import React, {
  useEffect,
  useState,
  useCallback,
} from "react";

import { getActiveProduk } from "../services/produkService";
import useProductSocket from "../hooks/useProductSocket";

// =========================
// BASE URL GAMBAR
// =========================
const BASE_IMAGE =
  import.meta.env.VITE_API_BASE_IMAGE;

const ProdukList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // FETCH AWAL
  // =========================
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getActiveProduk();

        console.log("FETCH AWAL:", response);

        setProducts(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error("Gagal ambil produk:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // =========================
  // REALTIME CREATE
  // =========================
  const handleCreated = useCallback((produkBaru) => {
    console.log("SOCKET product:created", produkBaru);

    setProducts((prev) => {
      const exists = prev.some(
        (item) => item.id === produkBaru.id
      );

      if (exists) return prev;

      return [produkBaru, ...prev];
    });
  }, []);

  // =========================
  // REALTIME UPDATE
  // =========================
  const handleUpdated = useCallback((updatedProduk) => {
    console.log("SOCKET product:updated", updatedProduk);

    setProducts((prev) =>
      prev.map((item) =>
        item.id === updatedProduk.id
          ? updatedProduk
          : item
      )
    );
  }, []);

  // =========================
  // REALTIME DELETE (FIXED)
  // =========================
  const handleDeleted = useCallback(({ id }) => {
    console.log("SOCKET product:deleted", id);

    setProducts((prev) =>
      prev.filter(
        (item) => String(item.id) !== String(id)
      )
    );
  }, []);

  // =========================
  // SOCKET LISTENER
  // =========================
  useProductSocket({
    onCreated: handleCreated,
    onUpdated: handleUpdated,
    onDeleted: handleDeleted,
  });

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <h2>Loading produk...</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Realtime Produk</h1>

      <p>Total Produk: {products.length}</p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((item) => {
          const images = item.image || [];

          return (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "10px",
                background: "#fff",
              }}
            >
              {/* GAMBAR */}
              <img
                src={
                  images[0]
                    ? `${BASE_IMAGE}${images[0]}`
                    : "https://via.placeholder.com/200"
                }
                alt={item.name}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />

              {/* NAMA */}
              <h3>{item.name}</h3>

              {/* HARGA */}
              <p>
                Rp{" "}
                {Number(item.price || 0).toLocaleString(
                  "id-ID"
                )}
              </p>

              {/* ID */}
              <small>ID Produk: {item.id}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProdukList;