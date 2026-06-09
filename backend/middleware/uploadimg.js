// middleware/uploadimg.js
import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = "public/gambarproduk";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExt = /\.(jpg|jpeg|png)$/i;
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExt.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar dengan format JPG, JPEG, atau PNG yang diperbolehkan'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  }
});

export default upload;