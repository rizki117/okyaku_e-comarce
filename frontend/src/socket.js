// src/socket.js

// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8080";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

// =========================
// LISTENER SEKALI SAJA
// =========================

socket.on("connect", () => {
  console.log("🟢 Socket terhubung:", socket.id);

  // Kirim auth hanya kalau ada token (user login)
  // Guest tidak kirim auth → backend tetap masukkan ke public-room
  const token = localStorage.getItem("accessToken");
  if (token) {
    socket.emit("auth", token);
  } else {
    console.log("🌐 Guest mode — masuk public-room otomatis");
  }
});

socket.on("auth_success", ({ role, userId }) => {
  console.log(`🟡 Socket auth OK: ${role} -> ${userId}`);
});

socket.on("auth_error", ({ msg }) => {
  console.error("❌ Socket auth gagal:", msg);
  socket.disconnect();
});

socket.on("disconnect", (reason) => {
  console.log("🔴 Socket terputus:", reason);
});

// =========================
// CONNECT — Guest & User
// =========================

export const connectSocket = () => {
  if (socket.connected) {
    console.log("🟡 Socket sudah connect");
    return;
  }

  // Konek untuk semua orang, termasuk guest tanpa token
  socket.connect();
};

// =========================
// DISCONNECT
// =========================

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    console.log("🔴 Socket disconnect manual");
  }
};