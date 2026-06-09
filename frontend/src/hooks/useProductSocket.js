// src/hooks/useProductSocket.js

import { useEffect } from "react";
import { socket } from "../socket";

/**
 * Hook realtime produk menggunakan Socket.IO
 *
 * EVENT:
 * - product:created
 * - product:updated
 * - product:deleted
 * - product:images:updated
 *
 * @param {Object} callbacks
 * @param {Function} callbacks.onCreated
 * @param {Function} callbacks.onUpdated
 * @param {Function} callbacks.onDeleted
 * @param {Function} callbacks.onImgUpdated
 */

const useProductSocket = ({
  onCreated,
  onUpdated,
  onDeleted,
  onImgUpdated,
} = {}) => {
  useEffect(() => {
    // =========================
    // GUARD
    // =========================
    if (!socket) return;

    // =========================
    // REGISTER EVENT
    // =========================

    if (typeof onCreated === "function") {
      socket.on("product:created", onCreated);
    }

    if (typeof onUpdated === "function") {
      socket.on("product:updated", onUpdated);
    }

    if (typeof onDeleted === "function") {
      socket.on("product:deleted", onDeleted);
    }

    if (typeof onImgUpdated === "function") {
      socket.on("product:images:updated", onImgUpdated);
    }

    // =========================
    // CLEANUP
    // =========================

    return () => {
      if (typeof onCreated === "function") {
        socket.off("product:created", onCreated);
      }

      if (typeof onUpdated === "function") {
        socket.off("product:updated", onUpdated);
      }

      if (typeof onDeleted === "function") {
        socket.off("product:deleted", onDeleted);
      }

      if (typeof onImgUpdated === "function") {
        socket.off("product:images:updated", onImgUpdated);
      }
    };
  }, [
    onCreated,
    onUpdated,
    onDeleted,
    onImgUpdated,
  ]);
};

export default useProductSocket;