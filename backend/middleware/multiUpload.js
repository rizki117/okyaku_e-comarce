//middleware/multiUpload.js

import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folder) => {
  const uploadDir = `public/${folder}`;

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${file.fieldname}-${unique}${ext}`);
    },
  });
};

// ✅ Perbaiki fileFilter dengan pesan error
const fileFilter = (req, file, cb) => {
  const allowed = /\.(jpg|jpeg|png|webp)$/i;
  if (allowed.test(file.originalname.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Format file tidak didukung. Gunakan jpg, jpeg, png, atau webp"), false);
  }
};

const baseUpload = (folder) =>
  multer({
    storage: createStorage(folder),
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });

export const uploadProduk = baseUpload("gambarproduk");
export const uploadAvatar = baseUpload("avatar");
export const uploadBanner = baseUpload("banner");