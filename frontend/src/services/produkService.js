// services/produkService.js
import api from "./api";

const unwrap = (promise) =>
  promise.then((res) => res.data);

// ========================
// PUBLIC
// ========================

export const getActiveProduk = () =>
  unwrap(api.get("/produk/active"));

export const getProdukByKategori = (categoryId) =>
  unwrap(api.get(`/produk/kategori/${categoryId}`));

export const getProdukByUser = (userId) =>
  unwrap(api.get(`/produk/user/${userId}`));

export const getProdukDetail = (id) =>
  unwrap(api.get(`/produk/${id}/detail`));

export const searchProduk = (keyword) =>
  unwrap(
    api.get(
      `/produk/search?keyword=${encodeURIComponent(
        keyword
      )}`
    )
  );

// ========================
// LOGIN
// ========================

export const getAllProduk = () =>
  unwrap(api.get("/produk"));

export const getProdukById = (id) =>
  unwrap(api.get(`/produk/${id}`));

// ========================
// CRUD
// ========================

export const createProduk = (data) =>
  unwrap(api.post("/produk", data));

export const updateProduk = (id, data) =>
  unwrap(api.patch(`/produk/${id}`, data));

export const deleteProduk = (id) =>
  unwrap(api.delete(`/produk/${id}`));

// ========================
// TOGGLE STATUS
// ========================

export const toggleProduk = (id) =>
  unwrap(api.patch(`/produk/${id}/toggle-status`));


// ========================
// KATEGORI                   
// ========================

export const getKategoriAktif = () =>
  unwrap(api.get("/kategori/active")); // ✅ ganti endpoint
  
  
  
  
  export const replaceGambarProduk = (id, index, formData) => {
  return api.patch(`/produk/${id}/gambar/${index}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
