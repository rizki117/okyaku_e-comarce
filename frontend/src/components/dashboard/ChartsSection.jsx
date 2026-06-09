// components/ChartsSection.jsx
import { lazy, Suspense, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllOrders, getSellerOrders } from "../../services/orderService";
import { getAllUsers } from "../../services/userService";

const customerChartOptions = {
  series: [44, 55],
  chart: { height: 200, type: "radialBar" },
  colors: ["#5BE49B", "#E66239"],
  plotOptions: {
    radialBar: {
      dataLabels: {
        name: { fontSize: "22px" },
        value: { fontSize: "16px" },
        total: { show: false },
      },
      hollow: { margin: 3, size: "40%", background: "transparent" },
      track: {
        show: true,
        background: "#f0f0f0",
        strokeWidth: "45%",
        opacity: 1,
        margin: 5,
      },
    },
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      gradientToColors: ["#007867", "#FFD666", "#FFAC82"],
      stops: [0, 100],
    },
  },
  stroke: { lineCap: "round" },
  labels: ["First Time", "Return"],
};

const ReactApexChart = lazy(() => import("react-apexcharts"));

const ChartLoader = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: 200 }}
  >
    <div
      className="spinner-border spinner-border-sm text-primary"
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const ChartsSection = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    orders: 0,
    suppliers: 0,
    customers: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      try {
        // ── Orders ───────────────────────────────────────────
        let ordersCount = 0;
        if (user.role === "admin") {
          const orders = await getAllOrders();
          ordersCount = orders.length;
        } else if (user.role === "seller") {
          const orders = await getSellerOrders();
          ordersCount = orders.length;
        }

        // ── Suppliers & Customers (admin only) ───────────────
        let suppliersCount = 0;
        let customersCount = 0;
        if (user.role === "admin") {
          const users = await getAllUsers();
          suppliersCount = users.filter((u) => u.role === "seller").length;
          customersCount = users.filter((u) => u.role === "buyer").length;
        }

        setStats({
          orders: ordersCount,
          suppliers: suppliersCount,
          customers: customersCount,
        });
      } catch (err) {
        console.error("Gagal fetch stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center bg-transparent px-4 py-4">
        <h3 className="h5 mb-0">Overall Information</h3>
        <div>
          <select className="form-select form-select-sm">
            <option defaultValue>Last 6 Months</option>
            <option>This Month</option>
            <option>This Week</option>
          </select>
        </div>
      </div>

      <div className="card-body p-4">
        <h3 className="h6">Customers Overview</h3>
        <div className="row align-items-center">
          <div className="col-sm-6">
            <Suspense fallback={<ChartLoader />}>
              <ReactApexChart
                options={customerChartOptions}
                series={customerChartOptions.series}
                type="radialBar"
                height={200}
              />
            </Suspense>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-6 border-end">
                <div className="text-center">
                  <h2 className="mb-1">5.5K</h2>
                  <p className="text-success mb-2">First Time</p>
                  <span className="badge bg-success">
                    <i className="ti ti-arrow-up-left me-1"></i>25%
                  </span>
                </div>
              </div>
              <div className="col-6">
                <div className="text-center">
                  <h2 className="mb-1">3.5K</h2>
                  <p className="text-warning mb-2">Return</p>
                  <span className="badge bg-success badge-xs d-inline-flex align-items-center">
                    <i className="ti ti-arrow-up-left me-1"></i>21%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats Row ─────────────────────────────────────── */}
        <div className="row text-center border-top mt-4 pt-4">

          {/* Suppliers — hanya tampil jika admin */}
          {user?.role === "admin" && (
            <div className="col-4 border-end">
              <h3 className="fw-bold mb-2">
                {loadingStats ? (
                  <span
                    className="spinner-border spinner-border-sm text-secondary"
                    role="status"
                  />
                ) : (
                  stats.suppliers.toLocaleString("id-ID")
                )}
              </h3>
              <small className="text-secondary">Suppliers</small>
            </div>
          )}

          {/* Customers — hanya tampil jika admin */}
          {user?.role === "admin" && (
            <div className="col-4 border-end">
              <h3 className="fw-bold mb-2">
                {loadingStats ? (
                  <span
                    className="spinner-border spinner-border-sm text-secondary"
                    role="status"
                  />
                ) : (
                  stats.customers.toLocaleString("id-ID")
                )}
              </h3>
              <small className="text-secondary">Customers</small>
            </div>
          )}

          {/* Orders — sesuai role */}
          <div className={user?.role === "admin" ? "col-4" : "col-12"}>
            <h3 className="fw-bold mb-2">
              {loadingStats ? (
                <span
                  className="spinner-border spinner-border-sm text-secondary"
                  role="status"
                />
              ) : (
                stats.orders.toLocaleString("id-ID")
              )}
            </h3>
            <small className="text-secondary">
              {user?.role === "admin" ? "Orders" : "Orders Produk Anda"}
            </small>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChartsSection;
