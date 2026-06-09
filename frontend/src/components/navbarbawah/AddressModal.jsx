import React, { useEffect, useState } from "react";
import { MapPin, Plus, Check, X, Trash2 } from "lucide-react";
import { getAddresses, createAddress, deleteAddress } from "../../services/addressService";
import styles from "./address.module.css";
import ConfirmDialog from "../animasi/ConfirmDialog";

const AddressModal = ({ isOpen, onClose, onSelectAddress, loading = false }) => {
  const [addresses, setAddresses] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [form, setForm] = useState({
    label: "",
    recipient: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postal_code: "",
    is_default: false,
  });

  useEffect(() => {
    if (isOpen) {
      setShowForm(false);
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    setLoadingData(true);
    try {
      const data = await getAddresses();
      const list = data.data || [];
      setAddresses(list);
      const def = list.find((a) => a.is_default);
      if (def) setSelectedId(def.id);
      if (list.length === 0) setShowForm(true);
    } catch {
      setAddresses([]);
      setShowForm(true);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      await createAddress(form);
      await fetchAddresses();
      setShowForm(false);
      setForm({
        label: "", recipient: "", phone: "",
        address: "", city: "", province: "",
        postal_code: "", is_default: false,
      });
    } catch {
      alert("Gagal tambah alamat");
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeletingId(pendingDeleteId);
    try {
      await deleteAddress(pendingDeleteId);
      if (selectedId === pendingDeleteId) setSelectedId(null);
      await fetchAddresses();
    } catch {
      alert("Gagal hapus alamat");
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
      setPendingDeleteId(null);
    }
  };

  const handleConfirm = () => {
    const selected = addresses.find((a) => a.id === selectedId);
    if (!selected) {
      alert("Pilih alamat dulu!");
      return;
    }
    onSelectAddress(selected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className={styles.overlay} />

      <div className={styles.modal}>
        <div className={styles.handle} />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <MapPin size={20} color="#FF6B6B" />
            <h2 className={styles.title}>
              {showForm ? "Tambah Alamat" : "Pilih Alamat"}
            </h2>
          </div>
          <button onClick={onClose} className={styles.closeBtn}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {loadingData ? (
            <div className={styles.loading}>Loading...</div>
          ) : showForm ? (
            <form onSubmit={handleSubmitForm}>
              {[
                { key: "label", placeholder: "Label (Rumah, Kantor...)" },
                { key: "recipient", placeholder: "Nama Penerima" },
                { key: "phone", placeholder: "Nomor HP" },
                { key: "address", placeholder: "Alamat Lengkap" },
                { key: "city", placeholder: "Kota" },
                { key: "province", placeholder: "Provinsi" },
                { key: "postal_code", placeholder: "Kode Pos" },
              ].map(({ key, placeholder }) => (
                <input
                  key={key}
                  required
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  placeholder={placeholder}
                  className={styles.input}
                />
              ))}

              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={form.is_default}
                  onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
                />
                Jadikan alamat utama
              </label>

              <div className={styles.buttonRow}>
                {addresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className={styles.btnCancel}
                  >
                    Batal
                  </button>
                )}
                <button type="submit" className={styles.btnSave}>
                  {loadingData ? "Menyimpan..." : "Simpan Alamat"}
                </button>
              </div>
            </form>
          ) : (
            <>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => setSelectedId(addr.id)}
                  className={`${styles.card} ${
                    selectedId === addr.id ? styles.cardActive : ""
                  }`}
                >
                  <div className={`${styles.radio} ${
                    selectedId === addr.id ? styles.radioActive : ""
                  }`}>
                    {selectedId === addr.id && (
                      <Check size={12} color="#fff" />
                    )}
                  </div>

                  <div className={styles.info}>
                    <div className={styles.badgeRow}>
                      <span className={styles.badge}>{addr.label}</span>
                      {addr.is_default && (
                        <span className={styles.badgeDefault}>Utama</span>
                      )}
                    </div>
                    <p className={styles.name}>{addr.recipient}</p>
                    <p className={styles.phone}>{addr.phone}</p>
                    <p className={styles.address}>
                      {addr.address}, {addr.city}, {addr.province} {addr.postal_code}
                    </p>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, addr.id)}
                    className={styles.deleteBtn}
                    disabled={deletingId === addr.id}
                    title="Hapus alamat"
                  >
                    {deletingId === addr.id ? (
                      <span style={{ fontSize: 10 }}>...</span>
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}

              {addresses.length < 3 && (
                <button
                  onClick={() => setShowForm(true)}
                  className={styles.addBtn}
                >
                  <Plus size={16} />
                  Tambah Alamat Baru
                </button>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!showForm && addresses.length > 0 && (
          <div className={styles.footer}>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`${styles.confirmBtn} ${
                loading ? styles.confirmDisabled : styles.confirmActive
              }`}
            >
              {loading ? "Membuka WhatsApp..." : "Gunakan Alamat Ini"}
            </button>
          </div>
        )}
      </div>

      {/* ✅ Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Hapus Alamat?"
        subtitle="Alamat yang dihapus tidak bisa dikembalikan"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingDeleteId(null);
        }}
      />
    </>
  );
};

export default AddressModal;