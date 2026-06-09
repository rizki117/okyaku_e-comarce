// routers/GoogleAuthRouter.js
import express from "express";
import { googleLogin } from "../controllers/GoogleAuth.js";

const router = express.Router();

router.post("/auth/google", googleLogin);

export default router;