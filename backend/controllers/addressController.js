//controllers/addressController.js

import Address from "../models/addressModel.js";
import asyncHandler from "../middleware/asyncHandler.js";

// ============================================
// TAMPIL SEMUA ALAMAT USER
// ============================================
export const getAddresses = asyncHandler(async (req, res) => {
  const addresses = await Address.findAll({
    where: { userId: req.user.userId,  is_deleted: false,},
    order: [
      ["is_default", "DESC"],
      ["createdAt", "DESC"],
    ],
  });

  if (addresses.length === 0) {
    return res.status(200).json({
      success: true,
      message: "Belum ada alamat",
      data: [],
    });
  }

  res.status(200).json({ success: true, data: addresses });
});

// ============================================
// TAMPIL ALAMAT BERDASARKAN ID
// ============================================
export const getAddressById = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });

  if (!address) {
    const error = new Error("Alamat tidak ditemukan");
    error.status = 404;
    throw error;
  }

  res.status(200).json({ success: true, data: address });
});

// ============================================
// TAMBAH ALAMAT BARU
// Maksimal 3 alamat per user
// ============================================
export const createAddress = asyncHandler(async (req, res) => {
  const { label, recipient, phone, address, city, province, postal_code, is_default } = req.body;

  if (!label || !recipient || !phone || !address || !city || !province || !postal_code) {
    const error = new Error("Semua field wajib diisi");
    error.status = 400;
    throw error;
  }

  const totalAlamat = await Address.count({
    where: { userId: req.user.userId, is_deleted: false},
  });

  if (totalAlamat >= 3) {
    const error = new Error("Maksimal 3 alamat, hapus alamat lama terlebih dahulu");
    error.status = 400;
    throw error;
  }

  const shouldBeDefault = totalAlamat === 0 ? true : (is_default || false);

  if (shouldBeDefault) {
    await Address.update(
      { is_default: false},
      { where: { userId: req.user.userId } }
    );
  }

  const newAddress = await Address.create({
    userId: req.user.userId,
    label,
    recipient,
    phone,
    address,
    city,
    province,
    postal_code,
    is_default: shouldBeDefault,
  });

  res.status(201).json({
    success: true,
    message: "Alamat berhasil ditambahkan",
    data: newAddress,
  });
});

// ============================================
// UPDATE ALAMAT
// ============================================
export const updateAddress = asyncHandler(async (req, res) => {
  const { label, recipient, phone, address, city, province, postal_code, is_default } = req.body;

  const existingAddress = await Address.findOne({
    where: {
      id: req.params.id,
      userId: req.user.userId, 
      is_deleted: false,
    },
  });

  if (!existingAddress) {
    const error = new Error("Alamat tidak ditemukan");
    error.status = 404;
    throw error;
  }

  if (is_default) {
    await Address.update(
      { is_default: false },
      { where: { userId: req.user.userId } }
    );
  }

  await Address.update(
    {
      label: label ?? existingAddress.label,
      recipient: recipient ?? existingAddress.recipient,
      phone: phone ?? existingAddress.phone,
      address: address ?? existingAddress.address,
      city: city ?? existingAddress.city,
      province: province ?? existingAddress.province,
      postal_code: postal_code ?? existingAddress.postal_code,
      is_default: is_default !== undefined ? is_default : existingAddress.is_default,
    },
    { where: { id: req.params.id } }
  );

  res.status(200).json({
    success: true,
    message: "Alamat berhasil diperbarui",
  });
});

// ============================================
// HAPUS ALAMAT
// ============================================
export const deleteAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    where: {
      id: req.params.id,
      userId: req.user.userId,
      is_deleted: false, // ← tambah
    },
  });

  if (!address) {
    const error = new Error("Alamat tidak ditemukan");
    error.status = 404;
    throw error;
  }

  // soft delete
  await Address.update(
    { is_deleted: true, is_default: false },
    { where: { id: req.params.id } }
  );

  if (address.is_default) {
    const firstAddress = await Address.findOne({
      where: { 
        userId: req.user.userId,
        is_deleted: false, // ← tambah
      },
      order: [["createdAt", "ASC"]],
    });

    if (firstAddress) {
      await Address.update(
        { is_default: true },
        { where: { id: firstAddress.id } }
      );
    }
  }

  res.status(200).json({
    success: true,
    message: "Alamat berhasil dihapus",
  });
});

// ============================================
// SET ALAMAT DEFAULT
// ============================================
export const setDefaultAddress = asyncHandler(async (req, res) => {
  const address = await Address.findOne({
    where: {
      id: req.params.id,
      userId: req.user.userId,
    },
  });

  if (!address) {
    const error = new Error("Alamat tidak ditemukan");
    error.status = 404;
    throw error;
  }

  await Address.update(
    { is_default: false },
    { where: { userId: req.user.userId } }
  );

  await Address.update(
    { is_default: true },
    { where: { id: req.params.id } }
  );

  res.status(200).json({
    success: true,
    message: "Alamat berhasil dijadikan default",
  });
});
