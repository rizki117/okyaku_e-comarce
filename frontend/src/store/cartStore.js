// store/cartStore.js
import { create } from "zustand";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../services/cartService";

const useCartStore = create((set, get) => ({
  cartItems: [],
  loading: false,

  // ========================
  // FETCH CART
  // ========================
  fetchCart: async () => {
    set({ loading: true });

    try {
      const res = await getCart();
      const data = res?.data?.data || res?.data || {};

      const items = (data?.cart_items || []) .sort((a, b) => b.id - a.id).map((ci) => ({
        id: ci.id,
        productId: ci.product?.id,
        name: ci.product?.name,
        price: ci.price,
        image: ci.product?.image,
        seller: ci.product?.user?.name,
        quantity: ci.quantity,
        // ← tambah variant (coba ProductVariant dulu, fallback ke product_variant)
        variant: (ci.ProductVariant || ci.product_variant)
          ? {
              id: (ci.ProductVariant || ci.product_variant).id,
              size: (ci.ProductVariant || ci.product_variant).size,
              color: (ci.ProductVariant || ci.product_variant).color,
            }
          : null,
      }));

      set({ cartItems: items });
    } catch {
      set({ cartItems: [] });
    } finally {
      set({ loading: false });
    }
  },

  // ========================
  // ADD TO CART (REALTIME)
  // ========================
  addItem: async (productId, quantity = 1, variantId = null) => {
    try {
    
const currentItems = get().cartItems;
    if (currentItems.length >= 5) {
      return { success: false, message: "Keranjang penuh!" };
    }    
    
    
      await addToCart({ productId, quantity, variantId }); // ← tambah variantId
      
      await get().fetchCart();
return { success: true };
      
      
    } catch {
      return false;
    }
  },

  // ========================
  // UPDATE ITEM
  // ========================
  updateItem: async (id, qty) => {
    const prev = get().cartItems;

    set({
      cartItems: prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item
      ),
    });

    try {
      await updateCartItem(id, qty);
    } catch {
      set({ cartItems: prev });
    }
  },

  // ========================
  // REMOVE ITEM
  // ========================
  removeItem: async (id) => {
    const prev = get().cartItems;

    set({
      cartItems: prev.filter((i) => i.id !== id),
    });

    try {
      await removeCartItem(id);
    } catch {
      set({ cartItems: prev });
    }
  },
}));

export default useCartStore;