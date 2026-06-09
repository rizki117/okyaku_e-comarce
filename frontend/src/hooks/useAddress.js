// hooks/useAddress.js
import { useState } from "react";
import {
  getAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../services/addressService";

const useAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ========================
  // GET SEMUA ALAMAT
  // ========================
  const fetchAddresses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAddresses();
      setAddresses(data.data);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal mengambil alamat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // GET ALAMAT BY ID
  // ========================
  const fetchAddressById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAddressById(id);
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal mengambil alamat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // CREATE ALAMAT
  // ========================
  const handleCreateAddress = async (addressData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await createAddress(addressData);
      await fetchAddresses(); // refresh
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal tambah alamat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // UPDATE ALAMAT
  // ========================
  const handleUpdateAddress = async (id, addressData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateAddress(id, addressData);
      await fetchAddresses(); // refresh
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal update alamat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // DELETE ALAMAT
  // ========================
  const handleDeleteAddress = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await deleteAddress(id);
      await fetchAddresses(); // refresh
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal hapus alamat");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ========================
  // SET DEFAULT ALAMAT
  // ========================
  const handleSetDefault = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await setDefaultAddress(id);
      await fetchAddresses(); // refresh
      return data;
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal set alamat default");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addresses,
    loading,
    error,
    fetchAddresses,
    fetchAddressById,
    createAddress: handleCreateAddress,
    updateAddress: handleUpdateAddress,
    deleteAddress: handleDeleteAddress,
    setDefaultAddress: handleSetDefault,
  };
};

export default useAddress;