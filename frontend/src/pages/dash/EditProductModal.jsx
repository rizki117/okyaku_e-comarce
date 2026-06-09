import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { updateProduk, replaceGambarProduk } from "../../services/produkService";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const EditProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    is_active: true,
  });

  const [localImages, setLocalImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [previewImg, setPreviewImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const thumbInputRefs = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || "",
        price: product.price || "",
        description: product.description || "",
        is_active: product.is_active ?? true,
      });

      const imgs = Array.isArray(product.image)
        ? product.image
        : product.image
        ? [product.image]
        : [];
      setLocalImages(imgs);

      setPreviewImg(imgs.length > 0 ? `${BASE_IMAGE}${imgs[0]}` : null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "is_active" ? value === "true" : value,
    });
  };

  // ── Ganti 1 gambar berdasarkan index ────────────────────────
  const handleThumbnailChange = async (index, file) => {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await replaceGambarProduk(product.id, index, formData);
      const newImages = res.data.data.images; // array filename terbaru dari backend

      setLocalImages(newImages);
      setPreviewImg(`${BASE_IMAGE}${newImages[index]}`);

      // Update product di parent
      onSave({ ...product, image: newImages });
    } catch (err) {
      alert(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Update data teks (nama, harga, dll) ──────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("is_active", form.is_active);

      await updateProduk(product.id, formData);

      onSave({ ...product, ...form, image: localImages });
      onClose();
    } catch (err) {
      alert(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  if (!product) return null;

  return ReactDOM.createPortal(
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ zIndex: 1040 }}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        style={{ zIndex: 1050 }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <div>
                <h5 className="modal-title mb-0">
                  <i className="ti ti-pencil me-2"></i>
                  Edit Produk
                </h5>
                <small className="text-muted">Update informasi produk</small>
              </div>
              <button type="button" className="btn-close" onClick={onClose} />
            </div>

            {/* Body */}
            <div className="modal-body">

              {/* Product Info */}
              <div className="card mb-3">
                <div className="card-body p-3">
                  <h6 className="fw-semibold mb-3">Informasi Produk</h6>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nama Produk</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Masukkan nama produk"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Harga</label>
                      <input
                        type="number"
                        className="form-control"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0"
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Kategori</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.category?.name ?? "-"}
                        disabled
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Seller</label>
                      <input
                        type="text"
                        className="form-control"
                        value={product.user?.name ?? "-"}
                        disabled
                      />
                    </div>
                    <div className="col-md-12 mb-0">
                      <label className="form-label">Deskripsi</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                        placeholder="Masukkan deskripsi produk"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Images */}
              <div className="card mb-3">
                <div className="card-body p-3">
                  <h6 className="fw-semibold mb-3">Gambar Produk</h6>
                  <small className="text-muted d-block mb-3">
                    Klik ikon pensil pada thumbnail untuk mengganti gambar tertentu.
                  </small>

                  {/* Thumbnails dengan tombol ganti per gambar */}
                  {localImages.length > 0 && (
                    <div className="d-flex gap-2 flex-wrap mb-3">
                      {localImages.map((img, index) => {
                        const src = img.startsWith("blob:")
                          ? img
                          : `${BASE_IMAGE}${img}`;
                        return (
                          <div key={index} className="position-relative" style={{ width: 60 }}>
                            <img
                              src={src}
                              alt={`gambar-${index}`}
                              onClick={() => setPreviewImg(src)}
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: 6,
                                cursor: "pointer",
                                border: previewImg === src
                                  ? "2px solid #0d6efd"
                                  : "2px solid #dee2e6",
                              }}
                            />
                            {/* Input file tersembunyi per thumbnail */}
                            <input
                              type="file"
                              accept="image/*"
                              className="d-none"
                              ref={(el) => (thumbInputRefs.current[index] = el)}
                              onChange={(e) =>
                                handleThumbnailChange(index, e.target.files[0])
                              }
                            />
                            {/* Tombol pensil */}
                            <button
                              type="button"
                              className="btn btn-primary position-absolute bottom-0 end-0 p-0 d-flex align-items-center justify-content-center"
                              style={{ width: 20, height: 20, borderRadius: 4 }}
                              title={`Ganti gambar ${index + 1}`}
                              disabled={loading}
                              onClick={() => thumbInputRefs.current[index]?.click()}
                            >
                              <i className="ti ti-pencil" style={{ fontSize: 10 }}></i>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Preview gambar besar */}
                  <div
                    className={`border rounded p-4 text-center ${dragOver ? "border-primary bg-light" : "border-secondary"}`}
                    style={{ minHeight: 150 }}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    {previewImg ? (
                      <img
                        src={previewImg}
                        alt="preview"
                        style={{ maxHeight: 120, maxWidth: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <div className="text-muted py-3">
                        <i className="ti ti-photo fs-3 d-block mb-2"></i>
                        Pilih thumbnail untuk preview
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Status */}
              <div className="card mb-3">
                <div className="card-body p-3">
                  <h6 className="fw-semibold mb-3">Status</h6>
                  <select
                    className="form-select"
                    name="is_active"
                    value={form.is_active}
                    onChange={handleChange}
                  >
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
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
                    Update Produk
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body
  );
};

export default EditProductModal;