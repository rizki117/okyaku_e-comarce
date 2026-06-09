// ProductDetailModal.jsx
import ReactDOM from "react-dom";

const ProductDetailModal = ({ product, onClose }) => {
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
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="ti ti-eye me-2"></i>
                Product Detail
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            {/* Body */}
            <div className="modal-body">
              <div className="text-center mb-4">
                <img
                  src={product.img || "/assets/images/placeholder.png"}
                  alt={product.name}
                  style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 12 }}
                />
                <h6 className="mt-2 mb-0">{product.name}</h6>
              </div>

              <table className="table table-bordered table-sm">
                <tbody>
                  <tr>
                    <th className="bg-light" style={{ width: "40%" }}>Code</th>
                    <td>{product.code}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">Category</th>
                    <td>{product.category}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">Brand</th>
                    <td>{product.brand}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">Price</th>
                    <td>${product.price}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">Unit</th>
                    <td>{product.unit}</td>
                  </tr>
                  <tr>
                    <th className="bg-light">Quantity</th>
                    <td>{product.qty}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </>,
    document.body // ← render langsung ke body, keluar dari DashboardLayout
  );
};

export default ProductDetailModal;
