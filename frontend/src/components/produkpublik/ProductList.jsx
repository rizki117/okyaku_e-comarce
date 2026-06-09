//src/components/produkpiblik/ProductList

import React, { useState, useCallback } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import ProductCard from "./ProductCard";
import ModalCard from "./ModalCard";
import AddToCartModal from "./AddToCartModal";
import AddressModal from "../navbarbawah/AddressModal";
import PreviewPesananModal from "../navbarbawah/PreviewPesananModal";

import {
  getActiveProduk,
  getProdukByKategori,
  searchProduk,
} from "../../services/produkService";
import { setDefaultAddress } from "../../services/addressService";
import { buyNow } from "../../services/checkoutService";

import useProductSocket from "../../hooks/useProductSocket";
import useCartStore from "../../store/cartStore";
import useGetMe from "../../hooks/useGetMe";
import Snackbar from "../animasi/Snackbar";

// ================= FETCH FUNCTION =================
const fetchProducts = async ({ category, search }) => {
  if (search.trim()) {
    const res = await searchProduk(search.trim());
    const allResult = res?.data ?? res;

    if (category?.id) {
      return Array.isArray(allResult)
        ? allResult.filter((p) => p.category?.id === category.id)
        : [];
    }
    return Array.isArray(allResult) ? allResult : [];
  }

  if (!category?.id) {
    const res = await getActiveProduk();
    return res?.data ?? res;
  }

  const res = await getProdukByKategori(category.id);
  return res?.data ?? res;
};

const ProductList = ({ category, search }) => {
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartProduct, setCartProduct] = useState(null);
  const [loadingCart, setLoadingCart] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  // ================= BUY NOW FLOW =================
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [buyNowData, setBuyNowData] = useState(null);
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [loadingWA, setLoadingWA] = useState(false);

  // ================= PREVIEW =================
  const [showPreview, setShowPreview] = useState(false);
  const [previewAddress, setPreviewAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const { user } = useGetMe();
  const addItem = useCartStore((state) => state.addItem);

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ message, type, visible: true });
    setTimeout(
      () => setSnackbar({ message: "", type: "success", visible: false }),
      1500
    );
  };

  // ================= REACT QUERY =================
  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["produk", category?.id ?? "semua", search],
    queryFn: () => fetchProducts({ category, search }),
    staleTime: 5 * 60 * 1000,    // data dianggap fresh selama 5 menit
    cacheTime: 10 * 60 * 1000,   // cache disimpan 10 menit
    refetchOnWindowFocus: false,  // tidak refetch saat tab difokus
  });

  // ================= SOCKET =================
  const handleCreated = useCallback((produk) => {
    queryClient.invalidateQueries(["produk"]); // ← refresh semua cache produk
  }, [queryClient]);

  const handleUpdated = useCallback((produk) => {
    queryClient.invalidateQueries(["produk"]);
  }, [queryClient]);

  const handleDeleted = useCallback(() => {
    queryClient.invalidateQueries(["produk"]);
  }, [queryClient]);

  const handleImgUpdated = useCallback(() => {
    queryClient.invalidateQueries(["produk"]);
  }, [queryClient]);

  useProductSocket({
    onCreated: handleCreated,
    onUpdated: handleUpdated,
    onDeleted: handleDeleted,
    onImgUpdated: handleImgUpdated,
  });

  // ================= BUY NOW =================
  const handleBuyNow = (product, data) => {
    setBuyNowProduct(product);
    setBuyNowData(data);
    setSelectedProduct(null);
    setShowAddressModal(true);
  };

  // ================= PILIH ALAMAT =================
  const handleSelectAddress = async (address) => {
    try {
      await setDefaultAddress(address.id);
      setPreviewAddress(address);
      setShowAddressModal(false);
      setShowPreview(true);
    } catch (err) {
      showSnackbar("Gagal memilih alamat", "error");
    }
  };

  // ================= CONFIRM PREVIEW =================
  const handleConfirmPreview = async () => {
    setLoadingWA(true);
    try {
      const res = await buyNow({
        productId: buyNowProduct.id,
        quantity: buyNowData?.quantity || 1,
        variantId: buyNowData?.variant?.id || null,
        addressId: previewAddress.id,
        paymentMethod,
      });

      if (res?.whatsappUrl) {
        window.open(res.whatsappUrl, "_blank");
      }

      queryClient.invalidateQueries(["orders"]);

      setShowPreview(false);
      setBuyNowProduct(null);
      setBuyNowData(null);
      setPreviewAddress(null);
    } catch (err) {
      console.error(err);
      showSnackbar(
        err?.response?.data?.message || "Gagal kirim pesanan",
        "error"
      );
    } finally {
      setLoadingWA(false);
    }
  };

  // ================= CART =================
  const handleConfirmAddCart = async ({ quantity, variant }) => {
    if (!cartProduct) return;
    setLoadingCart(true);
    try {
      const result = await addItem(
        cartProduct.id,
        quantity,
        variant?.id ?? null
      );

      if (result === true || result?.success) {
        showSnackbar("Berhasil masuk keranjang");
        setCartProduct(null);
      } else {
        showSnackbar(result?.message || "Gagal tambah cart", "error");
        setCartProduct(null);
      }
    } finally {
      setLoadingCart(false);
    }
  };

  // ================= PREVIEW ITEMS =================
  const previewItems = buyNowProduct
    ? [
        {
          id: buyNowProduct.id,
          name: buyNowProduct.name,
          price: buyNowProduct.price,
          quantity: buyNowData?.quantity || 1,
          image: buyNowProduct.image,
          variant: buyNowData?.variant || null,
        },
      ]
    : [];

  // ================= UI STATES =================
  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Loading produk...
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Gagal memuat produk, coba lagi.
      </div>
    );
  }

  if (!products.length) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        {search
          ? `Produk "${search}" tidak ditemukan`
          : category?.id
          ? `Tidak ada produk dalam kategori "${category.name}"`
          : "Produk tidak ditemukan"}
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} onClick={() => setSelectedProduct(product)}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* MODAL DETAIL */}
      {selectedProduct && (
        <ModalCard
          product={selectedProduct}
          user={user} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product) => {
            setSelectedProduct(null);
            setCartProduct(product);
          }}
          onBuyNow={handleBuyNow}
        />
      )}

      {/* ADD TO CART */}
      {cartProduct && (
        <AddToCartModal
          product={cartProduct}
          onClose={() => setCartProduct(null)}
          onConfirm={handleConfirmAddCart}
          loading={loadingCart}
        />
      )}

      {/* ADDRESS MODAL */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onSelectAddress={handleSelectAddress}
        loading={loadingWA}
      />

      {/* PREVIEW PESANAN */}
      <PreviewPesananModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        items={previewItems}
        address={previewAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        onConfirm={handleConfirmPreview}
        loading={loadingWA}
      />

      <Snackbar {...snackbar} />
    </div>
  );
};

export default ProductList;