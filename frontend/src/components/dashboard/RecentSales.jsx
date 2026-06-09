const recentSales = [
  {
    img: "./assets/images/product-7.png",
    name: 'MacBook Pro 16"',
    category: "Computers",
    price: "2,$2,499",
    status: "Completed",
    statusClass: "bg-success-subtle text-success",
  },
  {
    img: "./assets/images/product-9.png",
    name: "AirPods Pro Max",
    category: "Audio",
    price: "$549",
    status: "Processing",
    statusClass: "bg-primary-subtle text-primary",
  },
  {
    img: "./assets/images/product-8.png",
    name: 'iPad Air 11"',
    category: "Tablets",
    price: "$799",
    status: "Completed",
    statusClass: "bg-success-subtle text-success",
  },
  {
    img: "./assets/images/product-3.png",
    name: "Apple Watch Ultra",
    category: "Wearables",
    price: "$799",
    status: "Pending",
    statusClass: "bg-warning-subtle text-warning",
  },
  {
    img: "./assets/images/product-6.png",
    name: "Magic Keyboard",
    category: "Accessories",
    price: "$299",
    status: "Cancelled",
    statusClass: "bg-danger-subtle text-danger",
  },
];

const RecentSales = () => {
  return (
    <div className="card h-100">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
        <h4 className="mb-0 h5">Recent Sales</h4>
        <button className="btn btn-sm btn-outline-secondary">
          <i className="ti ti-calendar-event"></i> Weekly
        </button>
      </div>

      <ul className="list-group list-group-flush">
        {recentSales.map((sale, index) => (
          <li key={index} className="list-group-item d-flex align-items-center gap-3">
            <img src={sale.img} className="rounded" width="48" alt={sale.name} />
            <div className="flex-grow-1">
              <p className="mb-1">{sale.name}</p>
              <div className="d-flex align-items-center gap-2 text-muted">
                <small className="fw-semibold">{sale.category}</small>
                <small>•</small>
                <small>{sale.price}</small>
              </div>
            </div>
            <span className={`badge ${sale.statusClass}`}>{sale.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSales;
