import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div style={{ maxWidth: "500px", width: "100%" }}>
        <div className="text-center">
          <div className="mb-4">
            <Link to="/dashboard" className="d-inline-block mb-4">
              <img src="/assets/images/logo-icon.svg" alt="" width="36" />
              <span className="ms-2">
                <img src="/assets/images/logo.svg" alt="" />
              </span>
            </Link>
          </div>
          <h1 className="display-1 fw-bold text-primary mb-2">404</h1>
          <h2 className="h4 mb-3">Page Not Found</h2>
          <p className="text-muted mb-4">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
