//bagian components/order/OrderManager.jsx


import React, { useState } from "react";
import useOrderSocket from "../../hooks/useOrderSocket";
import OrderModal from "./OrderModal";
import OrderDetailModal from "./OrderDetailModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserOrders, getOrderById, cancelOrder } from "../../services/orderService";
import Snackbar from "../animasi/Snackbar";
import ConfirmDialog from "../animasi/ConfirmDialog";

const OrderManager = ({ isOpen, onClose }) => {
useOrderSocket(); // ← tambah ini
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false); // ✅ tambah
  const [pendingCancelId, setPendingCancelId] = useState(null); // ✅ tambah
  const [snackbar, setSnackbar] = useState({ // ✅ tambah
    visible: false,
    message: "",
    type: "success",
  });
  const queryClient = useQueryClient();

  const showSnackbar = (message, type = "success") => { // ✅ tambah
    setSnackbar({ visible: true, message, type });
    setTimeout(() => setSnackbar((s) => ({ ...s, visible: false })), 3000);
  };

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: getUserOrders,
    enabled: true,    
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const handleDetail = async (order) => {
    const res = await getOrderById(order.id);
    setSelectedOrder(res);
    setIsDetailOpen(true);
  };

  // ✅ Buka dialog dulu
  const handleCancelOrder = (orderId) => {
    setPendingCancelId(orderId);
    setConfirmOpen(true);
  };

  // ✅ Eksekusi setelah konfirmasi
  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(pendingCancelId);
      setIsDetailOpen(false);
      setSelectedOrder(null);
      queryClient.invalidateQueries(["orders"]);
      showSnackbar("Pesanan berhasil dibatalkan", "success");
    } catch (err) {
      showSnackbar("Gagal membatalkan pesanan", "error");
    } finally {
      setConfirmOpen(false);
      setPendingCancelId(null);
    }
  };

  return (
    <>
      <OrderModal
        isOpen={isOpen}
        onClose={onClose}
        orders={orders}
        loading={isLoading}
        onDetail={handleDetail}
      />

     <OrderDetailModal
  isOpen={isDetailOpen}
  onClose={() => {
    setIsDetailOpen(false);
    setConfirmOpen(false);
    setPendingCancelId(null);
  }}
  order={selectedOrder}
  onCancel={handleCancelOrder}
/>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Batalkan Pesanan?"
        subtitle="Batalkan Pesanan?"
        onConfirm={handleConfirmCancel}
        onCancel={() => setConfirmOpen(false)}
      />

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
      />
    </>
  );
};

export default OrderManager;
