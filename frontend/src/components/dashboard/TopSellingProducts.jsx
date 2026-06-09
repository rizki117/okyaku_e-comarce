const topSellingProducts = [
  {
    img: "./assets/images/product-2.png",
    name: "Wireless Earphones",
    price: "$89",
    units: "1,250 Units",
    badge: "18%",
    badgeClass: "bg-danger-subtle text-danger border border-danger",
  },
  {
    img: "./assets/images/product-1.png",
    name: "Gaming Joy Stick",
    price: "$49",
    units: "5,420 Units",
    badge: "32%",
    badgeClass: "bg-primary-subtle text-primary border border-primary",
  },
  {
    img: "./assets/images/product-3.png",
    name: "Smart Watch Pro",
    price: "$98",
    units: "862 Units",
    badge: "22%",
    badgeClass: "bg-info-subtle text-info border border-info",
  },
  {
    img: "./assets/images/product-4.png",
    name: "USB-C Fast Charger",
    price: "$35",
    units: "3,200 Units",
    badge: "28%",
    badgeClass: "bg-success-subtle text-success border border-success",
  },
  {
    img: "./assets/images/product-5.png",
    name: "Portable Bluetooth Speaker",
    price: "$65",
    units: "2,890 Units",
    badge: "25%",
    badgeClass: "bg-warning-subtle text-warning border border-warning",
  },
];

const TopSellingProducts = () => {
  return (
    <div className="card h-100">
      <div className="card-header bg-white d-flex justify-content-between align-items-center px-4 py-3">
        <h4 className="mb-0 h5">Top Selling Products</h4>
        <button className="btn btn-sm btn-outline-secondary">
          <i className="ti ti-calendar"></i> Today
        </button>
      </div>

      <ul className="list-group list-group-flush">
        {topSellingProducts.map((product, index) => (
          <li key={index} className="list-group-item d-flex align-items-center gap-3">
            <img src={product.img} className="rounded" width="48" alt={product.name} />
            <div className="flex-grow-1">
              <p className="mb-1">{product.name}</p>
              <div className="d-flex align-items-center gap-2 text-muted">
                <small className="fw-semibold">{product.price}</small>
                <small>•</small>
                <small>{product.units}</small>
              </div>
            </div>
            <span className={`badge ${product.badgeClass}`}>{product.badge}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSellingProducts;
