import express from "express";
import dotenv from "dotenv";
dotenv.config();

import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import "./jobs/autoClean.js";
import { Server } from "socket.io";

import { socketHandler } from "./socket.js";

import "./models/index.js";

import cookieParser from "cookie-parser";
import cors from "cors";

import { errorHandler } from "./middleware/errorHandler.js";

import AuthRouter from "./routers/AuthRouter.js";
import GoogleAuthRouter from "./routers/GoogleAuthRouter.js";
import userRouter from "./routers/userRouter.js";
import kategoriRouter from "./routers/kategoriRouter.js";
import produkRouter from "./routers/produkRouter.js";
import uploadimgRouter from "./routers/uploadimgRouter.js";
import variantRouter from "./routers/variantRouter.js";
import cartRouter from "./routers/cartRouter.js";
import addressRouter from "./routers/addressRouter.js";
import orderRouter from "./routers/orderRouter.js";
import checkoutRouter from "./routers/checkoutRouter.js";

// =======================
// ES MODULE __dirname FIX
// =======================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// =======================
// HTTP SERVER (WAJIB SOCKET.IO)
// =======================
const server = http.createServer(app);

// =======================
// SOCKET.IO SETUP
// =======================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// kirim io ke semua request
app.set("io", io);

// dari socket.js
socketHandler(io);

// =======================
// MIDDLEWARE
// =======================
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// =======================
// STATIC FILE
// =======================
app.use(
  "/gambarproduk",
  express.static(path.join(__dirname, "public", "gambarproduk"))
);

app.use(
  "/avatar",
  express.static(path.join(__dirname, "public", "avatar"))
);


// =======================
// ROUTES
// =======================
app.use(AuthRouter);
app.use(GoogleAuthRouter);
app.use(userRouter);
app.use(kategoriRouter);
app.use(uploadimgRouter);
app.use(produkRouter);
app.use(variantRouter);
app.use(cartRouter);
app.use(addressRouter);
app.use(orderRouter);
app.use(checkoutRouter);

// =======================
// ERROR HANDLER
// =======================
app.use(errorHandler);

// =======================
// START SERVER
// =======================
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} sudah digunakan`);
    process.exit(1);
  } else {
    console.error("❌ Server error:", err);
    process.exit(1);
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server Running PORT ${PORT}`);
});
