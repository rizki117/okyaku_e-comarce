import { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navSections = [
  {
    heading: "Main",
    links: [
      { to: "/dashboard", icon: "ti ti-home", label: "Dashboard" },
      { to: "/dashboard/users", icon: "ti ti-users", label: "Users", allowedRoles: ["admin"] },
      { to: "/dashboard/categories", icon: "ti ti-category", label: "Categories", allowedRoles: ["admin"] },
      { to: "/dashboard/inventory", icon: "ti ti-box-seam", label: "Product" },
      { to: "/dashboard/reports", icon: "ti ti-receipt", label: "Reports" },
    ],
  },
  {
    heading: "Product",
    links: [
      { to: "/dashboard/create-product", icon: "ti ti-plus", label: "Add Product" },
      { to: "/", icon: "ti ti-building-store", label: "Brands" },
      { to: "/dashboard/variants", icon: "ti ti-palette", label: "Variants" },
    ],
  },
  {
    heading: "Orders & Sales",
    links: [
      { to: "/dashboard/orders", icon: "ti ti-shopping-cart", label: "Order List" },
      { to: "/dashboard/invoice", icon: "ti ti-file-text", label: "Invoice" },
      { to: "/dashboard/returns", icon: "ti ti-rotate", label: "Returns / Refunds" },
      { to: "/dashboard/pos", icon: "ti ti-device-desktop", label: "Pos(Point of Sale)" },
    ],
  },
  {
    heading: "Account",
    links: [
      { to: "/signin", icon: "ti ti-logout", label: "Log in" },
      { to: "/signup", icon: "ti ti-user-plus", label: "Sign up" },
      { to: "/dashboard/user-roles", icon: "ti ti-user-shield", label: "User Roles", badge: "New", allowedRoles: ["admin"] },
    ],
  },
];

const Sidebar = ({ isCollapsed, isMobileOpen }) => {
  const location = useLocation();
  const { user } = useAuth();

  const canAccess = (link) => {
    if (!link.allowedRoles) return true;
    return link.allowedRoles.includes(user?.role);
  };

  return (
    <aside
      id="sidebar"
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-show" : ""}`}
    >
      <div className="logo-area">
        <Link to="/dashboard" className="d-inline-flex">
          <img src="/assets/images/logo-icon.svg" alt="" width="24" />
          <span className="logo-text ms-2">
            <img src="/assets/images/logo.svg" alt="" />
          </span>
        </Link>
      </div>

      <ul className="nav flex-column">
        {navSections.map((section) => {
          const visibleLinks = section.links.filter(canAccess);
          if (!visibleLinks.length) return null;

          return (
            <Fragment key={section.heading}>
              <li className="px-4 py-2">
                <small className="nav-text">{section.heading}</small>
              </li>
              {visibleLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
                  >
                    <i className={link.icon}></i>
                    <span className="nav-text d-flex align-items-center gap-2">
                      {link.label}
                      {link.badge && (
                        <span className="badge bg-danger" style={{ fontSize: "10px" }}>
                          {link.badge}
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </Fragment>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;