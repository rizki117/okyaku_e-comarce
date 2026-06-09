//utils/fileStorage.js
import fs from "fs";
import path from "path";


// ============================================
// DELETE MULTI FILE (SAFE VERSION)
// ============================================
export const deleteFiles = (folder, files) => {
  if (!files) return;

  let list = [];

  try {
    list = typeof files === "string" ? JSON.parse(files) : files;
  } catch {
    list = [];
  }

  if (!Array.isArray(list)) return;

  list
    .filter((file) => typeof file === "string" && file.trim() !== "")
    .forEach((file) => {
      const filePath = path.join("public", folder, file);

      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error("Gagal hapus file:", filePath, err.message);
      }
    });
};