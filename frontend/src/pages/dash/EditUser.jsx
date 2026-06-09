// pages/dashboard/EditUser.jsx
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";



// ✅ Sesudah
import { getMe } from "../../services/authService";
import { updateUser, getUserById } from "../../services/userService";




const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE_PROFILE;

const DEFAULT_AVATAR = "/assets/images/avatar/avatar-default.jpg";

const EditUser = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    confPassword: "",
  });

  const [photoPreview, setPhotoPreview] = useState(DEFAULT_AVATAR);
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  // ── Fetch data user saat ini ─────────────────────────────────
  useEffect(() => {
  if (!user?.id) return;

  const fetchUser = async () => {
    try {
      const data = await getMe(localStorage.getItem("accessToken"));
      setForm({
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        role: data.role || "",
        password: "",
        confPassword: "",
      });
      setPhotoPreview(
        data.photo ? `${BASE_IMAGE}${data.photo}` : DEFAULT_AVATAR
      );
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setFetchLoading(false);
    }
  };

  fetchUser();
}, [user?.id]);
  

  // ── Handle perubahan input teks ──────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── Handle pilih foto ────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Format harus JPG, JPEG, PNG, atau WEBP",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: "Ukuran file maksimal 5MB" }));
      return;
    }

    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, photo: "" }));
  };

  // ── Validasi form ────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Nama wajib diisi";
    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (form.password && form.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }
    if (form.password !== form.confPassword) {
      newErrors.confPassword = "Konfirmasi password tidak sesuai";
    }
    return newErrors;
  };

  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);

      // Password hanya dikirim jika diisi
      if (form.password) {
        formData.append("password", form.password);
        formData.append("confPassword", form.confPassword);
      }

      // ✅ Field name "image" — sesuai uploadAvatar.array("image", 1)
      if (photoFile) {
        formData.append("image", photoFile);
      }

      // ✅ Sesudah
await updateUser(user.id, formData);

// Fetch ulang data user terbaru

// ✅ Sesudah
const updatedUser = await getMe(localStorage.getItem("accessToken"));
if (setUser) {
  setUser((prev) => ({
    ...prev,
    name: updatedUser.name,
    email: updatedUser.email,
    photo: updatedUser.photo,
  }));
}
      setSuccessMsg("Profil berhasil diperbarui!");
      setForm((prev) => ({ ...prev, password: "", confPassword: "" }));
      setPhotoFile(null);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.msg ||
        "Gagal memperbarui profil";
      setErrors({ server: msg });
    } finally {
      setLoading(false);
    }
  };

  // ── Loading state ────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "300px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h5 className="fw-semibold mb-0">Account Settings</h5>
        <small className="text-muted">Kelola informasi profil Anda</small>
      </div>

      <div className="row g-4">
        {/* ── Kolom Kiri: Avatar ── */}
        <div className="col-12 col-lg-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center py-4">
              <div className="position-relative d-inline-block mb-3">
                <img
                  src={photoPreview}
                  alt="Avatar"
                  className="rounded-circle object-fit-cover border"
                  style={{ width: 100, height: 100 }}
                  onError={(e) => (e.target.src = DEFAULT_AVATAR)}
                />
                <button
                  type="button"
                  className="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                  style={{ width: 28, height: 28 }}
                  onClick={() => fileInputRef.current?.click()}
                  title="Ganti foto"
                >
                  <i className="ti ti-camera" style={{ fontSize: 13 }}></i>
                </button>
              </div>

              {/* ✅ name="image" sesuai field multer */}
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                className="d-none"
                onChange={handlePhotoChange}
              />

              {errors.photo && (
                <p className="text-danger small mt-1">{errors.photo}</p>
              )}

              <p className="fw-semibold mb-0 small">{form.name || "—"}</p>
              <p className="text-muted small text-capitalize mb-3">
                {form.role || "—"}
              </p>

              <button
                type="button"
                className="btn btn-outline-secondary btn-sm w-100"
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="ti ti-upload me-1"></i>Upload Foto
              </button>
              <p className="text-muted mt-2 mb-0" style={{ fontSize: 11 }}>
                JPG, PNG, WEBP · Maks 5MB
              </p>
            </div>
          </div>
        </div>

        {/* ── Kolom Kanan: Form ── */}
        <div className="col-12 col-lg-9">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              {successMsg && (
                <div className="alert alert-success d-flex align-items-center gap-2 py-2 mb-4">
                  <i className="ti ti-circle-check fs-5"></i>
                  <span>{successMsg}</span>
                </div>
              )}

              {errors.server && (
                <div className="alert alert-danger d-flex align-items-center gap-2 py-2 mb-4">
                  <i className="ti ti-alert-circle fs-5"></i>
                  <span>{errors.server}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Informasi Dasar */}
                <h6 className="fw-semibold text-muted mb-3 small text-uppercase">
                  Informasi Dasar
                </h6>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
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
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
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
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-medium">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-sm"
                      placeholder="Contoh: 08123456789"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-medium">Role</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-light text-capitalize"
                      value={form.role}
                      readOnly
                      disabled
                    />
                    <div className="form-text">
                      Role hanya dapat diubah oleh Admin.
                    </div>
                  </div>
                </div>

                <hr className="my-4" />

                {/* Ubah Password */}
                <h6 className="fw-semibold text-muted mb-1 small text-uppercase">
                  Ubah Password
                </h6>
                <p className="text-muted mb-3" style={{ fontSize: 12 }}>
                  Kosongkan jika tidak ingin mengganti password.
                </p>

                <div className="row g-3 mb-4">
                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-medium">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      name="password"
                      className={`form-control form-control-sm ${errors.password ? "is-invalid" : ""}`}
                      placeholder="Min. 6 karakter"
                      value={form.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.password && (
                      <div className="invalid-feedback">{errors.password}</div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label className="form-label small fw-medium">
                      Konfirmasi Password
                    </label>
                    <input
                      type="password"
                      name="confPassword"
                      className={`form-control form-control-sm ${errors.confPassword ? "is-invalid" : ""}`}
                      placeholder="Ulangi password baru"
                      value={form.confPassword}
                      onChange={handleChange}
                      autoComplete="new-password"
                    />
                    {errors.confPassword && (
                      <div className="invalid-feedback">{errors.confPassword}</div>
                    )}
                  </div>
                </div>

                {/* Tombol Aksi */}
                <div className="d-flex gap-2 justify-content-end">
                  <button
                    type="button"
                    className="btn btn-light btn-sm px-4"
                    onClick={() => navigate(-1)}
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
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
