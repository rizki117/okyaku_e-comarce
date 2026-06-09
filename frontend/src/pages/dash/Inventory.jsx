import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAllProduk, deleteProduk, toggleProduk } from "../../services/produkService";
import ProductDetailModal from "./ProductDetailModal";
import EditProductModal from "./EditProductModal";

const BASE_IMAGE = import.meta.env.VITE_API_BASE_IMAGE;

const getFirstImage = (image) => {
  if (!image) return null;
  if (Array.isArray(image)) return image[0];
  return image;
};

const Inventory = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalType, setModalType]     = useState(null);
  const [search, setSearch]           = useState("");
  const [filterSeller, setFilterSeller] = useState("all");

  // ── Pagination State ─────────────────────────────────────────
  const [currentPage, setCurrentPage]     = useState(1);
  const [perPageInput, setPerPageInput]   = useState("10");
  const [perPage, setPerPage]             = useState(10);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProduk();
      const list = Array.isArray(data) ? data : data.data;
      setProducts(list);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // ── Reset ke halaman 1 saat filter/search/perPage berubah ────
  useEffect(() => { setCurrentPage(1); }, [search, filterSeller, perPage]);

  // ── Seller list (admin only) ─────────────────────────────────
  const sellerList = useMemo(() => {
    if (!isAdmin || !Array.isArray(products) || products.length === 0) return [];
    const names = products
      .map((p) => p.user?.name ?? p.seller?.name ?? null)
      .filter(Boolean);
    return [...new Set(names)];
  }, [products, isAdmin]);

  // ── Filter ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchSeller =
        !isAdmin || filterSeller === "all" || product.user?.name === filterSeller;
      const matchSearch =
        search === "" ||
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(search.toLowerCase()) ||
        (isAdmin && product.user?.name?.toLowerCase().includes(search.toLowerCase()));
      return matchSeller && matchSearch;
    });
  }, [products, search, filterSeller, isAdmin]);

  // ── Pagination Calc ──────────────────────────────────────────
  const totalItems  = filtered.length;
  const totalPages  = Math.max(1, Math.ceil(totalItems / perPage));
  const safePage    = Math.min(currentPage, totalPages);
  const startIndex  = (safePage - 1) * perPage;
  const endIndex    = Math.min(startIndex + perPage, totalItems);
  const paginated   = filtered.slice(startIndex, endIndex);

  const handlePerPageChange = (e) => {
    setPerPageInput(e.target.value);
  };

  const applyPerPage = () => {
    const val = parseInt(perPageInput, 10);
    if (!isNaN(val) && val > 0) {
      setPerPage(val);
    } else {
      setPerPageInput(String(perPage));
    }
  };

  const handlePerPageKey = (e) => {
    if (e.key === "Enter") applyPerPage();
  };

  // ── Helpers ──────────────────────────────────────────────────
  const handleClickSeller = (sellerName) => {
    if (!isAdmin) return;
    setFilterSeller((prev) => (prev === sellerName ? "all" : sellerName));
  };

  const openDetail = (product) => { setSelectedProduct(product); setModalType("detail"); };
  const openEdit   = (product) => { setSelectedProduct(product); setModalType("edit"); };
  const closeModal = () => { setSelectedProduct(null); setModalType(null); };

  const handleSave = (updatedProduct) => {
    setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
    closeModal();
  };

  const handleToggle = async (productId, currentStatus) => {
    if (!window.confirm(currentStatus ? "Nonaktifkan produk ini?" : "Aktifkan kembali produk ini?")) return;
    try {
      await toggleProduk(productId);
      setProducts((prev) =>
        prev.map((p) => p.id === productId ? { ...p, is_active: !currentStatus } : p)
      );
    } catch (err) {
      alert(err.response?.data?.message ?? err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const res = await deleteProduk(productId);
      if (res.deactivated) {
        alert("Produk ada di order, status diubah menjadi Nonaktif.");
        setProducts((prev) =>
          prev.map((p) => p.id === productId ? { ...p, is_active: false } : p)
        );
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (err) {
      alert(err.response?.data?.message ?? err.message);
    }
  };

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  if (error) return (
    <div className="alert alert-danger m-4">
      <strong>Error:</strong> {error}{" "}
      <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchProducts}>
        Coba Lagi
      </button>
    </div>
  );

  const colSpan = isAdmin ? 6 : 5;

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="fs-3 mb-1">Product</h1>
              <p className="mb-0 text-muted">
                {isAdmin ? "Semua produk dari seluruh seller" : "Produk Anda"}
              </p>
            </div>
            <Link to="/dashboard/create-product" className="btn btn-primary">
              Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">

          {/* ── Search & Filter Bar ── */}
          <div className="d-flex gap-2 mb-3 flex-wrap justify-content-between">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder={
                isAdmin
                  ? "Cari nama produk, kategori, atau seller..."
                  : "Cari nama produk atau kategori..."
              }
              style={{ maxWidth: "280px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="d-flex gap-2 align-items-center">
              {isAdmin && (
                <>
                  <select
                    className="form-select form-select-sm"
                    value={filterSeller}
                    onChange={(e) => setFilterSeller(e.target.value)}
                  >
                    <option value="all">All Seller</option>
                    {sellerList.map((name) => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  {filterSeller !== "all" && (
                    <span className="badge bg-primary d-flex align-items-center gap-1">
                      {filterSeller}
                      <i
                        className="ti ti-x"
                        style={{ cursor: "pointer" }}
                        onClick={() => setFilterSeller("all")}
                      ></i>
                    </span>
                  )}
                </>
              )}
              <button className="btn btn-outline-secondary btn-sm">
                <i className="ti ti-file-excel"></i> Excel
              </button>
              <button className="btn btn-outline-secondary btn-sm">
                <i className="ti ti-file-pdf"></i> PDF
              </button>
            </div>
          </div>

          {/* ── Table ── */}
          <div className="card table-responsive">
            <table className="table mb-0 text-nowrap table-hover">
              <thead className="table-light border-light">
                <tr>
                  <th>Image</th>
                  <th>Kategori</th>
                  {isAdmin && <th>Seller</th>}
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} className="text-center py-4 text-muted">
                      Tidak ada produk ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginated.map((product) => {
                    const firstImage = getFirstImage(product.image);
                    const imageUrl   = firstImage ? `${BASE_IMAGE}${firstImage}` : "/images/no-image.png";
                    const isActiveSeller = filterSeller === product.user?.name;

                    return (
                      <tr key={product.id} className="align-middle">
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img src={imageUrl} alt={product.name} className="avatar avatar-md rounded" />
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{product.category?.name ?? "-"}</td>
                        {isAdmin && (
                          <td>
                            <span
                              onClick={() => handleClickSeller(product.user?.name)}
                              title={isActiveSeller ? "Klik untuk reset filter" : `Filter produk milik ${product.user?.name}`}
                              style={{ cursor: "pointer" }}
                              className={`badge ${isActiveSeller ? "bg-primary" : "bg-secondary"}`}
                            >
                              {product.user?.name ?? "-"}
                            </span>
                          </td>
                        )}
                        <td>Rp{Number(product.price).toLocaleString("id-ID")}</td>
                        <td>
                          {product.is_active
                            ? <span className="badge bg-success">Aktif</span>
                            : <span className="badge bg-danger">Nonaktif</span>
                          }
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-info me-1" onClick={() => openDetail(product)} title="Detail">
                            <i className="ti ti-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-warning me-1" onClick={() => openEdit(product)} title="Edit">
                            <i className="ti ti-pencil"></i>
                          </button>
                          <button
                            className={`btn btn-sm me-1 ${product.is_active ? "btn-outline-danger" : "btn-outline-success"}`}
                            onClick={() => handleToggle(product.id, product.is_active)}
                            title={product.is_active ? "Nonaktifkan" : "Aktifkan"}
                          >
                            <i className={`ti ${product.is_active ? "ti-toggle-right" : "ti-toggle-left"}`}></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(product.id)} title="Hapus">
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
                  <td colSpan={colSpan} className="border-bottom-0 py-2">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

                      {/* Kiri: info + input per page */}
                      <div className="d-flex align-items-center gap-2 text-muted small">
                        <span>
                          {totalItems === 0
                            ? "0 produk"
                            : `${startIndex + 1}–${endIndex} dari ${totalItems} produk`}
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

                          {/* << First */}
                          <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(1)} title="Halaman pertama">
                              «
                            </button>
                          </li>

                          {/* < Prev */}
                          <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} title="Sebelumnya">
                              ‹
                            </button>
                          </li>

                          {/* Nomor halaman */}
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter((page) => {
                              // Tampilkan halaman di sekitar halaman aktif
                              return (
                                page === 1 ||
                                page === totalPages ||
                                Math.abs(page - safePage) <= 1
                              );
                            })
                            .reduce((acc, page, idx, arr) => {
                              // Tambahkan ellipsis jika ada lompatan
                              if (idx > 0 && page - arr[idx - 1] > 1) {
                                acc.push("...");
                              }
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

                          {/* > Next */}
                          <li className={`page-item ${safePage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} title="Selanjutnya">
                              ›
                            </button>
                          </li>

                          {/* >> Last */}
                          <li className={`page-item ${safePage === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(totalPages)} title="Halaman terakhir">
                              »
                            </button>
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

      {modalType === "detail" && (
        <ProductDetailModal product={selectedProduct} onClose={closeModal} />
      )}
      {modalType === "edit" && (
        <EditProductModal product={selectedProduct} onClose={closeModal} onSave={handleSave} />
      )}
    </div>
  );
};

export default Inventory;