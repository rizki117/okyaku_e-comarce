// src/hooks/useOrderSocket.js
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "../socket";

const useOrderSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleStatusUpdate = ({ orderId, status }) => {
      console.log("📦 Order update:", orderId, status);

      queryClient.setQueryData(["orders"], (oldOrders = []) =>
        oldOrders.map((order) =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    };

    socket.on("order:status-updated", handleStatusUpdate);

    return () => {
      socket.off("order:status-updated", handleStatusUpdate);
    };
  }, [queryClient]);
};

export default useOrderSocket;