// socket.js
import jwt from "jsonwebtoken";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // -----------------------------------------------
    // PUBLIC ROOM — Tanpa token, untuk guest/visitor
    // Otomatis join saat koneksi pertama kali
    // Buyer juga dapat event dari sini karena
    // tidak ada "buyer-room" terpisah
    // -----------------------------------------------
    socket.join("public-room");
    console.log(`🌐 ${socket.id} joined public-room (guest/default)`);

    // -----------------------------------------------
    // AUTH — Untuk buyer, seller, admin (sudah login)
    // -----------------------------------------------
    socket.on("auth", (token) => {
      try {
        if (!token) {
          socket.emit("auth_error", { msg: "Token tidak ada" });
          return;
        }

        const decoded = jwt.verify(token, process.env.AKSES_TOKEN);
        const { userId, role } = decoded;

        socket.user = decoded;

        // buyer → room personal (untuk notif order dll)
        if (role === "buyer") socket.join(`user:${userId}`);

        // seller → room personal untuk konfirmasi emit
        if (role === "seller") socket.join(`seller:${userId}`);

        // admin → room admin untuk semua event produk
        if (role === "admin") socket.join("admin-room");

        socket.emit("auth_success", { role, userId });
        console.log(`🟡 AUTH OK: ${role} -> ${userId}`);

      } catch (err) {
        const msg =
          err.name === "TokenExpiredError"
            ? "Token expired"
            : "Token tidak valid";

        socket.emit("auth_error", { msg });
        socket.disconnect();
        console.log("❌ SOCKET AUTH FAILED:", msg);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
    });
  });
};
