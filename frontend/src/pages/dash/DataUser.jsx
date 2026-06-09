// pages/dashboard/DataUser.jsx
import { useState, useEffect, useMemo } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUser,
} from "../../services/userService";

const BASE_IMAGE    = import.meta.env.VITE_API_BASE_IMAGE_PROFILE;
const DEFAULT_AVATAR = "/assets/images/avatar/avatar-default.jpg";

const INIT_FORM = {
  name: "",
  email: "",
  phone: "",
  role: "seller",
  password: "",
  confPassword: "",
};

const roleBadgeColor = (role) => {
  switch (role) {
    case "admin":  return "bg-primary";
    case "seller": return "bg-info text-dark";
    case "buyer":  return "bg-secondary";
    default:       return "bg-light text-dark";
  }
};

// ─── Modal Create / Edit ──────────────────────────────────────
const UserModal = ({ mode, initialData, onClose, onSuccess }) => {
  const isEdit = mode === "edit";

  const [form, setForm] = useState(
    isEdit
      ? {
          name: initialData.name || "",
          email: initialData.email || "",
          phone: initialData.phone || "",
          role: initialData.role || "seller",
          password: "",
          confPassword: "",
        }
      : INIT_FORM
  );
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const err = {};
    if (!form.name.trim()) err.name = "Nama wajib diisi";
    if (!form.email.trim()) {
      err.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Format email tidak valid";
    }
    if (!isEdit && !form.password) {
      err.password = "Password wajib diisi";
    }
    if (form.password && form.password.length < 6) {
      err.password = "Password minimal 6 karakter";
    }
    if (form.password && form.password !== form.confPassword) {
      err.confPassword = "Konfirmasi password tidak sesuai";
    }
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("role", form.role);
        if (form.password) {
          formData.append("password", form.password);
          formData.append("confPassword", form.confPassword);
        }
        await updateUser(initialData.id, formData);
        onSuccess({ ...initialData, ...form });
      } else {
        await createUser({
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          password: form.password,
          confPassword: form.confPassword,
        });
        onSuccess();
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Terjadi kesalahan";
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-semibold">
              {isEdit ? "Edit User" : "Tambah User"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              disabled={loading}
            />
          </div>

          <div className="modal-body pt-2">
            {errors.server && (
              <div className="alert alert-danger py-2 small">
                <i className="ti ti-alert-circle me-1"></i>
                {errors.server}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {/* Nama */}
              <div className="mb-3">
                <label className="form-label small fw-medium">
                  Nama Lengkap <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Masukkan nama lengkap"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label small fw-medium">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control form-control-sm ${errors.email ? "is-invalid" : ""}`}
                  placeholder="Masukkan email"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label small fw-medium">Nomor Telepon</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control form-control-sm"
                  placeholder="Contoh: 08123456789"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>

              {/* Role */}
              <div className="mb-3">
                <label className="form-label small fw-medium">Role</label>
                <select
                  name="role"
                  className="form-select form-select-sm"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="seller">Seller</option>
                  <option value="admin">Admin</option>
                  <option value="buyer">Buyer</option>
                </select>
              </div>

              {/* Password */}
              <div className="mb-3">
                <label className="form-label small fw-medium">
                  {isEdit ? "Password Baru" : "Password"}{" "}
                  {!isEdit && <span className="text-danger">*</span>}
                </label>
                {isEdit && (
                  <p className="text-muted mb-1" style={{ fontSize: 11 }}>
                    Kosongkan jika tidak ingin mengganti password.
                  </p>
                )}
                <input
                  type="password"
                  name="password"
                  className={`form-control form-control-sm ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Min. 6 karakter"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              {/* Konfirmasi Password */}
              <div className="mb-4">
                <label className="form-label small fw-medium">Konfirmasi Password</label>
                <input
                  type="password"
                  name="confPassword"
                  className={`form-control form-control-sm ${errors.confPassword ? "is-invalid" : ""}`}
                  placeholder="Ulangi password"
                  value={form.confPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.confPassword && (
                  <div className="invalid-feedback">{errors.confPassword}</div>
                )}
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 justify-content-end">
                <button
                  type="button"
                  className="btn btn-light btn-sm px-4"
                  onClick={onClose}
                  disabled={loading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm px-4"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <i className="ti ti-device-floppy me-1"></i>
                      {isEdit ? "Simpan" : "Tambah"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────
const DataUser = () => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [modalMode, setModalMode]   = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // ── Pagination State ─────────────────────────────────────────
  const [currentPage, setCurrentPage]   = useState(1);
  const [perPageInput, setPerPageInput] = useState("10");
  const [perPage, setPerPage]           = useState(10);

  // ── Fetch ────────────────────────────────────────────────────
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : data.data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Reset page saat filter/search/perPage berubah ────────────
  useEffect(() => { setCurrentPage(1); }, [search, filterRole, perPage]);

  // ── Role counts (untuk badge info) ──────────────────────────
  const roleCounts = useMemo(() => {
    return users.reduce(
      (acc, u) => {
        if (u.role === "admin")  acc.admin  += 1;
        if (u.role === "seller") acc.seller += 1;
        if (u.role === "buyer")  acc.buyer  += 1;
        return acc;
      },
      { admin: 0, seller: 0, buyer: 0 }
    );
  }, [users]);

  // ── Filter ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchRole =
        filterRole === "all" || u.role === filterRole;
      const matchSearch =
        search === "" ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.role?.toLowerCase().includes(search.toLowerCase());
      return matchRole && matchSearch;
    });
  }, [users, search, filterRole]);

  // ── Pagination Calc ──────────────────────────────────────────
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage   = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * perPage;
  const endIndex   = Math.min(startIndex + perPage, totalItems);
  const paginated  = filtered.slice(startIndex, endIndex);

  const handlePerPageChange = (e) => setPerPageInput(e.target.value);
  const applyPerPage = () => {
    const val = parseInt(perPageInput, 10);
    if (!isNaN(val) && val > 0) setPerPage(val);
    else setPerPageInput(String(perPage));
  };
  const handlePerPageKey = (e) => { if (e.key === "Enter") applyPerPage(); };

  // ── Modal handlers ───────────────────────────────────────────
  const openCreate = () => { setSelectedUser(null); setModalMode("create"); };
  const openEdit   = (user) => { setSelectedUser(user); setModalMode("edit"); };
  const closeModal = () => { setSelectedUser(null); setModalMode(null); };

  const handleCreateSuccess = () => { closeModal(); fetchUsers(); };
  const handleEditSuccess   = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? { ...u, ...updatedUser } : u))
    );
    closeModal();
  };

  const handleToggle = async (userId, currentStatus) => {
    if (!window.confirm(currentStatus ? "Nonaktifkan user ini?" : "Aktifkan kembali user ini?"))
      return;
    try {
      await toggleUser(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) => u.id === userId ? { ...u, is_active: !currentStatus } : u)
      );
    } catch (err) {
      alert(err.response?.data?.message ?? err.message);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Yakin ingin menghapus user ini? Tindakan ini tidak bisa dibatalkan."))
      return;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      alert(err.response?.data?.message ?? err.message);
    }
  };

  // ── Loading / Error ──────────────────────────────────────────
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger m-4">
        <strong>Error:</strong> {error}{" "}
        <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchUsers}>
          Coba Lagi
        </button>
      </div>
    );

  return (
    <div className="container-fluid">

      {/* ── Header ── */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="fs-3 mb-1">Users</h1>
              <p className="mb-0 text-muted">Kelola data pengguna</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={openCreate}>
              <i className="ti ti-user-plus me-1"></i> Tambah User
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">

          {/* ── Role Summary Tabs ── */}
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {[
              { key: "all",    label: "Semua",  count: users.length,       color: "btn-outline-dark"    },
              { key: "admin",  label: "Admin",  count: roleCounts.admin,   color: "btn-outline-primary" },
              { key: "seller", label: "Seller", count: roleCounts.seller,  color: "btn-outline-info"    },
              { key: "buyer",  label: "Buyer",  count: roleCounts.buyer,   color: "btn-outline-secondary"},
            ].map(({ key, label, count, color }) => (
              <button
                key={key}
                className={`btn btn-sm ${filterRole === key ? color.replace("btn-outline-", "btn-") : color}`}
                onClick={() => setFilterRole(key)}
              >
                {label}
                <span className={`badge ms-1 ${filterRole === key ? "bg-white text-dark" : "bg-secondary"}`}>
                  {count}
                </span>
              </button>
            ))}
          </div>

          {/* ── Search & Toolbar ── */}
          <div className="d-flex gap-2 mb-3 flex-wrap justify-content-between">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Cari nama, email, atau role..."
              style={{ maxWidth: "250px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="d-flex gap-2 align-items-center">
              {/* Active filter badge */}
              {filterRole !== "all" && (
                <span className="badge bg-primary d-flex align-items-center gap-1">
                  {filterRole.charAt(0).toUpperCase() + filterRole.slice(1)}
                  <i
                    className="ti ti-x"
                    style={{ cursor: "pointer" }}
                    onClick={() => setFilterRole("all")}
                  ></i>
                </span>
              )}
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ti ti-file-excel"></i> Excel
              </button>
              <button className="btn btn-sm btn-outline-secondary">
                <i className="ti ti-file-pdf"></i> PDF
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="card table-responsive">
            <table className="table mb-0 text-nowrap table-hover">
              <thead className="table-light border-light">
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Tidak ada user ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginated.map((user) => {
                    const avatarUrl = user.photo
                      ? `${BASE_IMAGE}${user.photo}`
                      : DEFAULT_AVATAR;

                    return (
                      <tr key={user.id} className="align-middle">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={avatarUrl}
                              alt={user.name}
                              className="avatar avatar-md rounded-circle"
                              onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                            />
                            <span className="fw-medium">{user.name}</span>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>{user.phone || "-"}</td>
                        <td>
                          <span
                            className={`badge text-capitalize ${roleBadgeColor(user.role)}`}
                            style={{ cursor: "pointer" }}
                            title={`Filter role: ${user.role}`}
                            onClick={() =>
                              setFilterRole((prev) =>
                                prev === user.role ? "all" : user.role
                              )
                            }
                          >
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.is_active ? (
                            <span className="badge bg-success">Aktif</span>
                          ) : (
                            <span className="badge bg-danger">Nonaktif</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-warning me-1"
                            onClick={() => openEdit(user)}
                            title="Edit"
                          >
                            <i className="ti ti-pencil"></i>
                          </button>
                          <button
                            className={`btn btn-sm me-1 ${
                              user.is_active ? "btn-outline-danger" : "btn-outline-success"
                            }`}
                            onClick={() => handleToggle(user.id, user.is_active)}
                            title={user.is_active ? "Nonaktifkan" : "Aktifkan"}
                          >
                            <i className={`ti ${user.is_active ? "ti-toggle-right" : "ti-toggle-left"}`}></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(user.id)}
                            title="Hapus"
                          >
                            <i className="ti ti-trash"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>

              {/* ── Footer Pagination ── */}
              <tfoot>
                <tr>
                  <td colSpan="6" className="border-bottom-0 py-2">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                      {/* Kiri: info + per page */}
                      <div className="d-flex align-items-center gap-2 text-muted small">
                        <span>
                          {totalItems === 0
                            ? "0 user"
                            : `${startIndex + 1}–${endIndex} dari ${totalItems} user`}
                        </span>
                        <span className="text-muted">|</span>
                        <span>Tampilkan</span>
                        <input
                          type="number"
                          min="1"
                          className="form-control form-control-sm text-center"
                          style={{ width: "60px" }}
                          value={perPageInput}
                          onChange={handlePerPageChange}
                          onBlur={applyPerPage}
                          onKeyDown={handlePerPageKey}
                        />
                        <span>per halaman</span>
                      </div>

                      {/* Kanan: tombol pagination */}
                      <nav>
                        <ul className="pagination pagination-sm mb-0">

                          {/* « First */}
                          <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(1)} title="Halaman pertama">«</button>
                          </li>

                          {/* ‹ Prev */}
                          <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} title="Sebelumnya">‹</button>
                          </li>

                          {/* Nomor halaman */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) =>
                              page === 1 ||
                              page === totalPages ||
                              Math.abs(page - safePage) <= 1
                            )
                            .reduce((acc, page, idx, arr) => {
                              if (idx > 0 && page - arr[idx - 1] > 1) acc.push("...");
                              acc.push(page);
                              return acc;
                            }, [])
                            .map((item, idx) =>
                              item === "..." ? (
                                <li key={`ellipsis-${idx}`} className="page-item disabled">
                                  <span className="page-link">…</span>
                                </li>
                              ) : (
                                <li key={item} className={`page-item ${safePage === item ? "active" : ""}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(item)}>
                                    {item}
                                  </button>
                                </li>
                              )
                            )}

                          {/* › Next */}
                          <li className={`page-item ${safePage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} title="Selanjutnya">›</button>
                          </li>

                          {/* » Last */}
                          <li className={`page-item ${safePage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(totalPages)} title="Halaman terakhir">»</button>
                          </li>

                        </ul>
                      </nav>

                    </div>
                  </td>
                </tr>
              </tfoot>

            </table>
          </div>

        </div>
      </div>

      {/* Modal */}
      {modalMode && (
        <UserModal
          mode={modalMode}
          initialData={selectedUser}
          onClose={closeModal}
          onSuccess={modalMode === "create" ? handleCreateSuccess : handleEditSuccess}
        />
      )}
    </div>
  );
};

export default DataUser;
