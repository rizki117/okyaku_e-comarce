//components/navbarbawah/NavbarBawah.jsx

import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useSnackbar } from "../../context/SnackbarContext";

import HomeTab from "./HomeTab";
import CartTab from "./CartTab";
import CartModal from "./CartModal";
import PreviewPesananModal from "./PreviewPesananModal";
import OrdersTab from "./OrdersTab";
import OrderManager from "../order/OrderManager";
import AddressModal from "./AddressModal";
import Profile from "./Profile";

import DetailCart from "./DetailCart"; 

import { logout } from "../../services/authService";
import useGetMe from "../../hooks/useGetMe";
import useCartStore from "../../store/cartStore";
import "./navbarbawah.css";

import {
  checkoutAll,
  checkoutSingleItem,
  checkoutMultiItems,
  markWaSent,
} from "../../services/checkoutService";

import { getProdukDetail } from "../../services/produkService"; // ← tambah

const NavbarBawah = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("beranda");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isOrderOpen, setIsOrderOpen] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null); 
const [previewCartItem, setPreviewCartItem] = useState(null); 


  const { user } = useGetMe();
  const { cartItems, fetchCart, updateItem, removeItem } = useCartStore();

  useEffect(() => {
    if (user) fetchCart();
  }, [user, fetchCart]);

  // =========================
  // CART HANDLER
  // =========================
  const handleCartClick = () => {
    setIsCartOpen(true);
    setActiveTab("cart");
  };

  const handleUpdateQty = (id, qty) => {
    updateItem(id, qty);
  };

  const handleRemove = (id) => {
    removeItem(id);
  };

  const handleCheckoutItem = (item) => {
    setCheckoutItem(item || null);
    setIsCartOpen(false);
    setShowAddressModal(true);
  };

  // =========================
  // IMAGE CLICK → MODAL DetailCart
  // =========================
  const handleImageClick = async (item) => {
  try {
    const res = await getProdukDetail(item.productId);
    setPreviewProduct(res.data);
    setPreviewCartItem(item); // ← tambah
  } catch {
    console.error("Gagal load produk");
  }
};

  // =========================
  // CHECKOUT ADDRESS + WA
  // =========================
  const handleSelectAddress = async (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
    setShowPreview(true);
  };

  const handleConfirmCheckout = async () => {
    try {
      setCheckoutLoading(true);

      let data = null;

      if (checkoutItem && !Array.isArray(checkoutItem)) {
        data = await checkoutSingleItem(
          checkoutItem.id,
          selectedAddress.id,
          paymentMethod
        );
      } else if (Array.isArray(checkoutItem) && checkoutItem.length > 0) {
        const itemIds = checkoutItem.map((i) => i.id);
        data = await checkoutMultiItems(
          itemIds,
          selectedAddress.id,
          paymentMethod
        );
      } else {
        data = await checkoutAll(
          selectedAddress.id,
          paymentMethod
        );
      }

      const sellers = data?.sellers || [];

     if (!sellers.length) {
  showSnackbar("Seller tidak ditemukan", "error");
  return;
}

      sellers.forEach((s) => window.open(s.whatsappUrl, "_blank"));

      await markWaSent(data.orderId);
      await fetchCart();
      queryClient.invalidateQueries(["orders"]);
      setShowPreview(false);

    } catch (err) {
  console.error(err);

  showSnackbar(
    err?.response?.data?.message ||
      "Gagal kirim WhatsApp",
    "error"
  );

      
    } finally {
      setCheckoutLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
  await logout();       // ← hapus cookie refreshToken di backend
  localStorage.clear(); // ← hapus accessToken di frontend
  window.location.href = "/login";
};
  return (
    <>
      <nav className="bottom-navbar">
        <div className="nav-tabs-container">
          <HomeTab
            isActive={activeTab === "beranda"}
            onClick={() => setActiveTab("beranda")}
          />

          <CartTab
            isActive={activeTab === "cart"}
            onClick={handleCartClick}
          />

          <OrdersTab
            isActive={activeTab === "pesanan"}
            onClick={() => {
              setIsOrderOpen(true);
              setActiveTab("pesanan");
            }}
          />

          {user && <Profile user={user} onLogout={handleLogout} />}
        </div>
      </nav>

      <CartModal
        isOpen={isCartOpen}
        onClose={() => {
          setIsCartOpen(false);
          setActiveTab("beranda");
        }}
        cartItems={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemove}
        onCheckoutItem={handleCheckoutItem}
        onImageClick={handleImageClick} // ← tambah
      />

      {/* MODAL CARD PREVIEW DARI CART */}
    
{previewProduct && previewCartItem && (
  <DetailCart
    product={previewProduct}
    cartItem={previewCartItem}
    onClose={() => {
      setPreviewProduct(null);
      setPreviewCartItem(null);
    }}
    onBuyNow={(cartItem) => {
      setPreviewProduct(null);
      setPreviewCartItem(null);
      handleCheckoutItem(cartItem);
    }}
  />
)}

      <OrderManager
        isOpen={isOrderOpen}
        onClose={() => setIsOrderOpen(false)}
      />

      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelectAddress={handleSelectAddress}
      />

      <PreviewPesananModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        address={selectedAddress}
        loading={checkoutLoading}
        onConfirm={handleConfirmCheckout}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        items={
          Array.isArray(checkoutItem)
            ? checkoutItem
            : checkoutItem
            ? [checkoutItem]
            : cartItems
        }
      />
    </>
  );
};

export default NavbarBawah;
