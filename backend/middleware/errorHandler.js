// middleware/errorHandler.js

// ============================================
// ERROR HANDLER
// ============================================
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const statusCode = err.status || err.statusCode || 500;

  let message = err.message || "Terjadi kesalahan server";

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    message = err.errors.map(e => e.message).join(", ");
  }

  // Sequelize unique constraint
  if (err.name === "SequelizeUniqueConstraintError") {
    message = "Data sudah terdaftar";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack })
  });
};
