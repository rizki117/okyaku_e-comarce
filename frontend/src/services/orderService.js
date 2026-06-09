// services/orderService.js
import api from "./api";


// ========================
// GET ALL ORDERS (ADMIN)
// ========================
export const getAllOrders = async () => {
  const response = await api.get("/admin/order");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : [];
};


// ========================
// GET SELLER ORDERS
// ========================
export const getSellerOrders = async () => {
  const response = await api.get("/seller/order");
  return Array.isArray(response.data?.data)
    ? response.data.data
    : [];
};




// ========================
// GET USER ORDERS
// ========================
export const getUserOrders = async () => {
  const response = await api.get("/order");

  return Array.isArray(response.data?.data)
    ? response.data.data
    : [];
}; 

// ========================
// GET ORDER BY ID
// ========================
export const getOrderById = async (id) => {
  const response = await api.get(`/order/${id}`);
  return response.data.data; // ✅ OBJECT LANGSUNG
};



// ========================
// BATALKAN ORDER BY ID
// ========================
export const cancelOrder = async (orderId) => {
  const res = await api.delete(`/order/${orderId}/cancel`);
  return res.data;
};



// ========================
// UPDATE STATUS ORDER (ADMIN)
// ========================
export const updateStatusAdmin = async (id, status) => {
  const response = await api.patch(`/admin/order/${id}/status`, { status });
  return response.data;
};

// ========================
// UPDATE STATUS ORDER (SELLER)
// ========================
export const updateStatusSeller = async (id, status) => {
  const response = await api.patch(`/seller/order/${id}/status`, { status });
  return response.data;
};