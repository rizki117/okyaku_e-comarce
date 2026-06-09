// utils/emitCrudProduk.js

// ============================================
// PRIVATE HELPER
// ============================================
const _parseImage = (raw) => {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [raw];
  }
};

/**
 * Helper internal: kirim event ke semua room yang relevan
 *
 * Room yang dipakai (sesuai socket.js):
 * - "public-room" → semua koneksi (guest, buyer, siapapun)
 * - "admin-room"  → admin yang sudah auth
 * - `seller:${id}` → seller spesifik untuk konfirmasi
 *
 * Catatan: buyer tidak punya room terpisah ("buyer-room" tidak ada),
 * buyer sudah masuk "public-room" otomatis saat konek.
 *
 * @param {object} io           - Socket.IO server instance
 * @param {string} event        - Nama event
 * @param {object} payload      - Data yang dikirim
 * @param {number} sellerId     - ID seller (opsional)
 * @param {string} confirmEvent - Nama event konfirmasi ke seller (opsional)
 */
const _broadcastProduct = (io, event, payload, sellerId = null, confirmEvent = null) => {
  // Kirim ke semua yang konek: guest, buyer, visitor
  io.to("public-room").emit(event, payload);

  // Kirim ke admin
  io.to("admin-room").emit(event, payload);

  // Konfirmasi balik ke seller yang bersangkutan
  if (sellerId && confirmEvent) {
    io.to(`seller:${sellerId}`).emit(confirmEvent, {
      success: true,
      data: payload,
    });
  }
};

// ============================================
// PRODUCT EVENTS
// ============================================

/**
 * Emit ketika produk baru dibuat oleh seller.
 * Diterima oleh: public-room (guest), buyer-room, admin-room, seller confirm.
 *
 * @param {object} io        - Socket.IO server instance
 * @param {object} produk    - Data produk yang baru dibuat (Sequelize instance)
 * @param {number} sellerId  - ID seller yang membuat produk
 */
export const emitProdukCreated = (io, produk, sellerId) => {
  if (!io || !produk) {
    console.warn("⚠️ emitProdukCreated: io atau produk tidak ada");
    return;
  }

  const payload = {
    id: produk.id,
    name: produk.name,
    description: produk.description,
    price: produk.price,
    categoryId: produk.categoryId,
    sellerId: produk.userId,
    image: _parseImage(produk.image),
    is_active: produk.is_active,
    createdAt: produk.createdAt,
  };

  _broadcastProduct(io, "product:created", payload, sellerId, "product:created:confirm");

  console.log(`📦 SOCKET product:created -> produkId=${produk.id}`);
};

/**
 * Emit ketika produk diupdate oleh seller.
 * Diterima oleh: public-room (guest), buyer-room, admin-room, seller confirm.
 *
 * @param {object} io        - Socket.IO server instance
 * @param {object} produk    - Data produk setelah update (plain object / dari DB)
 * @param {number} sellerId  - ID seller yang mengupdate
 */
export const emitProdukUpdated = (io, produk, sellerId) => {
  if (!io || !produk) {
    console.warn("⚠️ emitProdukUpdated: io atau produk tidak ada");
    return;
  }

  const payload = {
    id: produk.id,
    name: produk.name,
    description: produk.description,
    price: produk.price,
    categoryId: produk.categoryId,
    sellerId: produk.userId,
    image: _parseImage(produk.image),
    is_active: produk.is_active,
    updatedAt: produk.updatedAt,
  };

  _broadcastProduct(io, "product:updated", payload, sellerId, "product:updated:confirm");

  console.log(`✏️  SOCKET product:updated -> produkId=${produk.id}`);
};

/**
 * Emit ketika produk dihapus oleh seller.
 * Diterima oleh: public-room (guest), buyer-room, admin-room, seller confirm.
 *
 * @param {object} io        - Socket.IO server instance
 * @param {number} produkId  - ID produk yang dihapus
 * @param {number} sellerId  - ID seller yang menghapus
 */
export const emitProdukDeleted = (io, produkId, sellerId) => {
  if (!io || !produkId) {
    console.warn("⚠️ emitProdukDeleted: io atau produkId tidak ada");
    return;
  }

  const payload = { id: produkId, deletedAt: new Date() };

  _broadcastProduct(io, "product:deleted", payload, sellerId, "product:deleted:confirm");

  console.log(`🗑️  SOCKET product:deleted -> produkId=${produkId}`);
};

/**
 * Emit ketika gambar tambahan berhasil ditambahkan ke produk.
 * Diterima oleh: public-room (guest), buyer-room, admin-room, seller confirm.
 *
 * @param {object} io       - Socket.IO server instance
 * @param {number} produkId - ID produk yang diupdate gambarnya
 * @param {Array}  images   - Array filename gambar terbaru (sudah merged)
 * @param {number} sellerId - ID seller yang mengupdate
 */
export const emitGambarAdded = (io, produkId, images, sellerId) => {
  if (!io || !produkId) {
    console.warn("⚠️ emitGambarAdded: io atau produkId tidak ada");
    return;
  }

  const payload = { id: produkId, images, updatedAt: new Date() };

  _broadcastProduct(
    io,
    "product:images:updated",
    payload,
    sellerId,
    "product:images:updated:confirm"
  );

  console.log(`🖼️  SOCKET product:images:updated -> produkId=${produkId}`);
};
