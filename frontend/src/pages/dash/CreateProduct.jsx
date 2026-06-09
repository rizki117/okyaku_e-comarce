import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSnackbar } from "../../context/SnackbarContext";




// ✅ Tambahkan import dari kategoriService
import { createProduk } from "../../services/produkService";

import { getActiveKategori } from "../../services/kategoriService";


const CreateProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    categoryId: "",
    description: "",
  });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();

  // Fetch kategori aktif saat komponen mount
  useEffect(() => {
  getActiveKategori()
    .then((res) => {
      console.log("kategori:", res);
      setCategories(res);
    })
    .catch((err) => {
      console.log("Error:", err);
      setCategories([]);
    });
}, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleReset = () => {
    setForm({ name: "", price: "", categoryId: "", description: "" });
    setImages([]);
    setError(null);
    setSuccess(null);
    document.getElementById("productImage").value = "";
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(null);

    // Validasi sisi client
    if (!form.name || !form.price || !form.categoryId) {
      return setError("Nama, harga, dan kategori wajib diisi.");
    }
    if (Number(form.price) < 0) {
      return setError("Harga tidak boleh negatif.");
    }
    if (images.length === 0) {
      return setError("Gambar produk wajib diupload.");
    }

    // Buat FormData (wajib untuk upload file)
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("categoryId", form.categoryId);
    formData.append("description", form.description);
    images.forEach((file) => formData.append("image", file));

    try {
  setLoading(true);

  await createProduk(formData);

  showSnackbar("Produk berhasil ditambahkan");

  setTimeout(() => {
  navigate("/dashboard/inventory");
}, 1500);
} catch (err) {
  const message =
    err?.response?.data?.message ||
    "Gagal menyimpan produk. Coba lagi.";

  setError(message);

  showSnackbar(message, "error");
} finally {
  setLoading(false);
}
};

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <div>
              <h1 className="fs-3 mb-1">Add Inventory</h1>
              <p className="mb-0">Manage your inventory items</p>
            </div>
            <div>
            
         <Link to="/dashboard/inventory" className="btn btn-primary">
  Go to Produce List
</Link>   
            
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible" role="alert">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          />
        </div>
      )}
      {success && (
        <div className="alert alert-success alert-dismissible" role="alert">
          {success}
          <button
            type="button"
            className="btn-close"
            onClick={() => setSuccess(null)}
          />
        </div>
      )}

      {/* Form */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Product Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="price" className="form-label">
                    Price <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="categoryId" className="form-label">
                  Category <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="productImage" className="form-label">
                  Product Image <span className="text-danger">*</span>
                  <small className="text-muted ms-1">(max 5 files)</small>
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="productImage"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                {images.length > 0 && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {images.map((file, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(file)}
                        alt={`preview-${i}`}
                        style={{
                          width: 72,
                          height: 72,
                          objectFit: "cover",
                          borderRadius: 6,
                          border: "1px solid #dee2e6",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="4"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Saving...
                    </>
                  ) : (
                    "Add Product"
                  )}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleReset}
                  disabled={loading}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProduct;