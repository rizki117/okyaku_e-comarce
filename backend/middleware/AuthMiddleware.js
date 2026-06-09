//middleware/AuthMiddleware.js

import jwt from "jsonwebtoken";
import RefreshToken from "../models/userSession.js";

// ============================================
// VERIFY TOKEN
// ============================================
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

// kalau tidak ada header
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        msg: "Anda belum login (token tidak ada)"
      });
    }

    // format: Bearer token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Token tidak valid"
      });
    }

    // validasi token
    const decoded = jwt.verify(token, process.env.AKSES_TOKEN);

//Debuging 
       console.log("DECODED:", decoded);

// simpan ke req.user
        req.user = decoded;

// lanjut ke middleware / controller berikutnya
         next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      msg:
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Token tidak valid"
    });
  }
};



// ============================================
// REQUIRE ROLE
// ============================================
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Anda belum login" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        msg: `Akses ditolak. Hanya untuk: ${roles.join(", ")}` 
      });
    }

    next();
  };
};