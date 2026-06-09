// routes/checkoutRouter.js
import express from "express";
import {
  buyNow,
  generateWhatsAppURL,
  generateWhatsAppURLSingleItem,
  generateWhatsAppURLMultiItems,
  markWaSent, 
} from "../controllers/checkoutController.js";

import { verifyToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/checkout/buy-now", verifyToken, buyNow);
router.get("/checkout", verifyToken, generateWhatsAppURL);
router.post("/checkout/single", verifyToken, generateWhatsAppURLSingleItem);
router.post("/checkout/multi", verifyToken, generateWhatsAppURLMultiItems);
router.patch("/checkout/:id/wa-sent", verifyToken, markWaSent); 

export default router;