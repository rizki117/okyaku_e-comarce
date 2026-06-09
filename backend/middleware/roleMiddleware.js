// middleware/roleMiddleware.js

// ==============================
// OWNER OR ADMIN
// Dipakai untuk resource milik user
// contoh: edit profile, edit address
// ==============================
export const isOwnerOrAdmin = (paramKey = "id") => {
  return (req, res, next) => {
    if (!req.user) {
      const error = new Error("Unauthorized");
      error.status = 401;
      throw error;
    }

    // admin boleh semua
    if (req.user.role === "admin") return next();

    const resourceId = parseInt(req.params[paramKey]);

    if (req.user.userId !== resourceId) {
      const error = new Error("Anda tidak memiliki akses ke resource ini");
      error.status = 403;
      throw error;
    }

    next();
  };
};