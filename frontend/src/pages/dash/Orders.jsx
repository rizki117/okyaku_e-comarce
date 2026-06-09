// pages/dashboard/Orders.jsx
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getAllOrders,
  getSellerOrders,
  updateStatusAdmin,
  updateStatusSeller,
} from "../../services/orderService";

const statusColor = (status) => {
  switch (status) {
    case "completed":  return "bg-success";
    case "cancelled":  return "bg-danger";
    case "pending":    return "bg-warning text-dark";
    case "shipped":    return "bg-info text-dark";
    case "confirmed":  return "bg-primary";
    case "processing": return "bg-secondary";
    default:           return "bg-primary";
  }
};

const Orders = () => {
  const { user } = useAuth();
  const isAdmin  = user?.role === "admin";

  const [orders, setOrders]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeller, setFilterSeller] = useState("all");

  // ── Pagination State ─────────────────────────────────────────
  const [currentPage, setCurrentPage]   = useState(1);
  const [perPageInput, setPerPageInput] = useState("10");
  const [perPage, setPerPage]           = useState(10);

  // ── Fetch ────────────────────────────────────────────────────
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (isAdmin) {
        data = await getAllOrders();
      } else if (user?.role === "seller") {
        data = await getSellerOrders();
      }
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (user) fetchOrders(); }, [user]);

  // ── Reset page saat filter/search/perPage berubah ────────────
  useEffect(() => { setCurrentPage(1); }, [search, filterStatus, filterSeller, perPage]);

  // ── Helper: ambil order items ────────────────────────────────
  const getItems = (order) => order.order_items || order.OrderItems || [];

  // ── Helper: ambil nama seller dari order ─────────────────────
  const getSellerNames = (order) => {
    const items = getItems(order);
    const names = items
      .map((item) => item.product?.user?.name ?? item.sellerName ?? null)
      .filter(Boolean);
    return [...new Set(names)];
  };

  // ── Seller list (admin only) ─────────────────────────────────
  const sellerList = useMemo(() => {
    if (!isAdmin || orders.length === 0) return [];
    const names = orders.flatMap((o) => getSellerNames(o));
    return [...new Set(names)];
  }, [orders, isAdmin]);

  // ── Filter ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus =
        filterStatus === "all" || o.status === filterStatus;

      const matchSeller =
        !isAdmin ||
        filterSeller === "all" ||
        getSellerNames(o).includes(filterSeller);

      const matchSearch =
        search === "" ||
        String(o.id).includes(search) ||
        o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        getItems(o).some((item) =>
          (item.product?.name ?? item.productName ?? "")
            .toLowerCase()
            .includes(search.toLowerCase())
        ) ||
        (isAdmin &&
          getSellerNames(o).some((n) =>
            n.toLowerCase().includes(search.toLowerCase())
          ));

      return matchStatus && matchSeller && matchSearch;
    });
  }, [orders, search, filterStatus, filterSeller, isAdmin]);

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

  // ── Update status ────────────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      if (isAdmin) {
        await updateStatusAdmin(orderId, newStatus);
      } else {
        await updateStatusSeller(orderId, newStatus);
      }
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
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
        <button className="btn btn-sm btn-outline-danger ms-2" onClick={fetchOrders}>
          Coba Lagi
        </button>
      </div>
    );

  const colSpan = isAdmin ? 8 : 7;

  return (
    <div className="container-fluid">

      {/* ── Header ── */}
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h1 className="fs-3 mb-1">Orders</h1>
              <p className="mb-0 text-muted">
                {isAdmin ? "Semua order dari seluruh seller" : "Order yang mengandung produk Anda"}
              </p>
            </div>
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
                  ? "Cari order ID, customer, produk, atau seller..."
                  : "Cari order ID, customer, atau produk..."
              }
              style={{ maxWidth: "280px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="d-flex gap-2 align-items-center flex-wrap">
              {/* Filter Status */}
              <select
                className="form-select form-select-sm"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {/* Filter Seller (admin only) */}
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
                  <th>Order ID</th>
                  <th>Customer</th>
                  {isAdmin && <th>Seller</th>}
                  <th>Produk</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={colSpan} className="text-center py-4 text-muted">
                      Tidak ada order ditemukan.
                    </td>
                  </tr>
                ) : (
                  paginated.map((order) => {
                    const items       = getItems(order);
                    const sellerNames = getSellerNames(order);
                    const isActiveSeller = isAdmin && filterSeller === sellerNames[0];

                    return (
                      <tr key={order.id} className="align-middle">

                        {/* Order ID */}
                        <td className="fw-semibold">#{order.id}</td>

                        {/* Customer */}
                        <td>{order.user?.name ?? "-"}</td>

                        {/* Seller (admin only) */}
                        {isAdmin && (
                          <td>
                            {sellerNames.length === 0 ? (
                              <span className="text-muted">-</span>
                            ) : (
                              <div className="d-flex flex-wrap gap-1">
                                {sellerNames.map((name) => {
                                  const isActive = filterSeller === name;
                                  return (
                                    <span
                                      key={name}
                                      className={`badge ${isActive ? "bg-primary" : "bg-secondary"}`}
                                      style={{ cursor: "pointer" }}
                                      title={isActive ? "Klik untuk reset filter" : `Filter order milik ${name}`}
                                      onClick={() =>
                                        setFilterSeller((prev) =>
                                          prev === name ? "all" : name
                                        )
                                      }
                                    >
                                      {name}
                                    </span>
                                  );
                                })}
                              </div>
                            )}
                          </td>
                        )}

                        {/* Produk */}
                        <td>
                          {items.filter((i) => i.product?.name || i.productName).length === 0 ? (
                            <span className="text-muted">Produk dihapus</span>
                          ) : (
                            items
                              .filter((i) => i.product?.name || i.productName)
                              .map((item, i) => (
                                <div key={i} className="d-flex align-items-center gap-1">
                                  <span>{item.product?.name ?? item.productName}</span>
                                  {item.quantity && (
                                    <small className="text-muted">x{item.quantity}</small>
                                  )}
                                </div>
                              ))
                          )}
                        </td>

                        {/* Total */}
                        <td>Rp{Number(order.totalPrice).toLocaleString("id-ID")}</td>

                        {/* Payment */}
                        <td>{order.paymentMethod ?? "-"}</td>

                        {/* Status */}
                        <td>
                          <span className={`badge ${statusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td>
                          <div className="d-flex gap-1 align-items-center">
                            <Link
                              to={`/dashboard/order-details/${order.id}`}
                              className="btn btn-sm btn-outline-info"
                              title="Detail"
                            >
                              <i className="ti ti-eye"></i>
                            </Link>

                            {(isAdmin || user?.role === "seller") && (
                              <select
                                className="form-select form-select-sm"
                                style={{ width: "auto" }}
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              >
                                {isAdmin ? (
                                  <>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </>
                                ) : (
                                  <>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                  </>
                                )}
                              </select>
                            )}
                          </div>
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
                            ? "0 order"
                            : `${startIndex + 1}–${endIndex} dari ${totalItems} order`}
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
                            <button className="page-link" onClick={() => setCurrentPage(1)} title="Halaman pertama">
                              «
                            </button>
                          </li>

                          {/* ‹ Prev */}
                          <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} title="Sebelumnya">
                              ‹
                            </button>
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
                            <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} title="Selanjutnya">
                              ›
                            </button>
                          </li>

                          {/* » Last */}
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
    </div>
  );
};

export default Orders;
