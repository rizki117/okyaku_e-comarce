import api from "./api";

export const checkoutAll = async (addressId, paymentMethod) => {
  const response = await api.post("/checkout", { addressId, paymentMethod });
  return response.data;
};

export const checkoutSingleItem = async (itemId, addressId, paymentMethod) => {
  const response = await api.post("/checkout/single", { itemId, addressId, paymentMethod });
  return response.data;
};

export const checkoutMultiItems = async (itemIds, addressId, paymentMethod) => {
  const response = await api.post("/checkout/multi", { itemIds, addressId, paymentMethod });
  return response.data;
};

export const buyNow = async ({ productId, variantId, quantity, addressId, paymentMethod }) => {
  const response = await api.post("/checkout/buy-now", { productId, variantId, quantity, addressId, paymentMethod });
  return response.data;
};

export const markWaSent = async (orderId) => {
  const response = await api.patch(`/checkout/${orderId}/wa-sent`);
  return response.data;
};