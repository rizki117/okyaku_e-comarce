//jobs/autoClean.js

import cron from "node-cron";
import { Op } from "sequelize";
import RefreshToken from "../models/userSession.js";
import Order from "../models/orderModel.js";

// ========================
// HAPUS TOKEN EXPIRED
// ========================
cron.schedule("0 * * * *", async () => {
  console.log("🧹 Hapus token expired...");

  try {
    const deleted = await RefreshToken.destroy({
      where: {
        expiredAt: {
          [Op.lt]: new Date(),
        },
      },
    });

    console.log(`✅ ${deleted} token expired dihapus`);
  } catch (err) {
    console.error("❌ Error hapus token:", err);
  }
});

// ========================
// AUTO CANCEL ORDER
// ========================

//cron.schedule("* * * * *", async () => {
 // try {
//    const deleted = await Order.destroy({
 //     where: {
//        wa_sent: false,
//        status: "pending",
//        createdAt: {
//          [Op.lt]: new Date(Date.now() - 1 * 60 * 1000),
//        },
//      },
 //   });

//   console.log(`✅ ${deleted} order dihapus otomatis`);
//  } catch (err) {
//    console.error("❌ Error auto cancel order:", err);
//  }

// });
