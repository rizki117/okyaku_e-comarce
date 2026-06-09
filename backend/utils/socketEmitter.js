//utils/socketEmitter.js

export const emitOrderEvents = (io, order, sellers) => {
  if (!io || !order) {
    console.warn("⚠️ emitOrderEvents: io atau order tidak ada");
    return;
  }

  // ADMIN
  io.to("admin-room").emit("order:new", {
    id: order.id,
    userId: order.userId,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
  });

  io.to("admin-room").emit("order:badge", { type: "admin", count: 1 });

  // USER
  io.to(`user:${order.userId}`).emit("order:created", {
    id: order.id,
    totalPrice: order.totalPrice,
    status: order.status,
    createdAt: order.createdAt,
  });

  io.to(`user:${order.userId}`).emit("order:badge", { type: "user", count: 1 });

  // SELLER
  if (!Array.isArray(sellers) || sellers.length === 0) {
    console.warn("⚠️ emitOrderEvents: sellers kosong");
    return; // ← tambah ini
  }

  sellers.forEach((s) => {
    if (!s.sellerId) return; // ← skip kalau sellerId undefined

    io.to(`seller:${s.sellerId}`).emit("order:seller", {
      orderId: order.id,
      userId: order.userId,
      items: s.items,
      subtotal: s.subtotal,
      status: order.status,
      createdAt: order.createdAt,
    });

    io.to(`seller:${s.sellerId}`).emit("order:badge", { type: "seller", count: 1 });
  });
};