// pages/dash/Kategori.jsx
import { useState, useEffect } from "react";
import { useSnackbar } from "../../context/SnackbarContext";
import {
  getAllKategori,
  createKategori,
  updateKategori,
  deleteKategori,
  toggleKategori,
} from "../../services/kategoriService";

const Kategori = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null); // "create" | "edit"
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", icon: "", image: "" });
  
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showSnackbar } = useSnackbar();

  const fetchKategori = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllKategori();
      setKategori(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKategori();
  }, []);

  const openCreate = () => {
    setForm({ name: "", icon: "", image: "" });
    setFormError(null);
    setSelected(null);
    setModalType("create");
  };

  const openEdit = (item) => {
    setForm({ name: item.name, icon: item.icon || "", image: item.image || "" });
    setFormError(null);
    setSelected(item);
    setModalType("edit");
  };

  const closeModal = () => {
    setModalType(null);
    setSelected(null);
    setFormError(null);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
  setFormError(null);

  if (!form.name || form.name.trim().length < 3) {
    return setFormError("Nama kategori minimal 3 karakter.");
  }

  setSaving(true);

  try {
    if (modalType === "create") {
      await createKategori(form);
      showSnackbar("Kategori berhasil ditambahkan");
    } else {
      await updateKategori(selected.id, form);
      showSnackbar("Kategori berhasil diperbarui");
    }

    await fetchKategori();
    closeModal();
  } catch (err) {
    const message = err.response?.data?.message ?? err.message;

    setFormError(message);
    showSnackbar(message, "error");
  } finally {
    setSaving(false);
  }
};



 const handleToggle = async (id, currentStatus) => {
  if (!window.confirm(currentStatus ? "Nonaktifkan kategori ini?" : "Aktifkan kategori ini?")) return;

  try {
    await toggleKategori(id);

    setKategori((prev) =>
      prev.map((k) =>
        k.id === id
          ? { ...k, is_active: !currentStatus }
          : k
      )
    );

    showSnackbar(
      currentStatus
        ? "Kategori berhasil dinonaktifkan"
        : "Kategori berhasil diaktifkan"
    );
  } catch (err) {
    showSnackbar(
      err.response?.data?.message ?? err.message,
      "error"
    );
  }
};

 const handleDelete = async (id) => {
  if (!window.confirm("Yakin ingin menghapus kategori ini?")) return;

  try {
    await deleteKategori(id);

    setKategori((prev) => prev.filter((k) => k.id !== id));

    showSnackbar("Kategori berhasil dihapus");
  } catch (err) {
    showSnackbar(
      err.response?.data?.message ?? err.message,
      "error"
    );
  }
};

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 300 }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger m-4">
      <strong>Error:</strong> {error}{" "}
      <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchKategori}>
        Coba Lagi
      </button>
    </div>
  );

  return (
    <div className="container-fluid">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="fs-3 mb-1">Kategori</h1>
          <p className="mb-0">Kelola kategori produk</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <i className="ti ti-plus me-1"></i> Tambah Kategori
        </button>
      </div>

      {/* Table */}
      <div className="card table-responsive">
        <table className="table mb-0 table-hover text-nowrap">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Nama</th>
              <th>Icon</th>
              <th>Status</th>
              <th>Dibuat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kategori.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Belum ada kategori.
                </td>
              </tr>
            ) : (
              kategori.map((item, index) => (
                <tr key={item.id} className="align-middle">
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    {item.icon
                      ? <i className={`${item.icon} fs-5`}></i>
                      : <span className="text-muted">-</span>
                    }
                  </td>
                  <td>
                    {item.is_active
                      ? <span className="badge bg-success">Aktif</span>
                      : <span className="badge bg-danger">Nonaktif</span>
                    }
                  </td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString("id-ID", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
                  </td>
                  <td>
                    {/* Edit */}
                    <button
                      className="btn btn-sm btn-outline-warning me-1"
                      onClick={() => openEdit(item)}
                      title="Edit"
                    >
                      <i className="ti ti-pencil"></i>
                    </button>

                    {/* Toggle Aktif/Nonaktif */}
                    <button
                      className={`btn btn-sm me-1 ${item.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
                      onClick={() => handleToggle(item.id, item.is_active)}
                      title={item.is_active ? "Nonaktifkan" : "Aktifkan"}
                    >
                      <i className={`ti ${item.is_active ? "ti-toggle-right" : "ti-toggle-left"}`}></i>
                    </button>

                    {/* Hapus */}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(item.id)}
                      title="Hapus"
                    >
                      <i className="ti ti-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6" className="border-bottom-0 text-muted">
                Menampilkan {kategori.length} kategori
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Modal Create / Edit */}
      {modalType && (
        <>
          <div className="modal-backdrop fade show" onClick={closeModal} style={{ zIndex: 1040 }} />
          <div className="modal fade show d-block" style={{ zIndex: 1050 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">

                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className={`ti ${modalType === "create" ? "ti-plus" : "ti-pencil"} me-2`}></i>
                    {modalType === "create" ? "Tambah Kategori" : "Edit Kategori"}
                  </h5>
                  <button className="btn-close" onClick={closeModal} />
                </div>

                <div className="modal-body">
                  {formError && (
                    <div className="alert alert-danger py-2">{formError}</div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">
                      Nama Kategori <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Minimal 3 karakter"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Icon Class</label>
                    <input
                      type="text"
                      className="form-control"
                      name="icon"
                      value={form.icon}
                      onChange={handleChange}
                      placeholder="cth: ti ti-shirt"
                    />
                    {form.icon && (
                      <div className="mt-2 text-muted">
                        Preview: <i className={`${form.icon} fs-5 ms-1`}></i>
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">URL Gambar</label>
                    <input
                      type="text"
                      className="form-control"
                      name="image"
                      value={form.image}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={closeModal}>
                    Batal
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={saving}
                  >
                    {saving ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Menyimpan...</>
                    ) : (
                      <><i className="ti ti-device-floppy me-1"></i>Simpan</>
                    )}
                  </button>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
};

export default Kategori;