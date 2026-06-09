//src/components/navbarbawah/Profile.jsx

import React from "react";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./profile.module.css";

const Profile = ({ onLogout, logoutLoading, user }) => {
  const navigate = useNavigate();

  return (
    <div className="dropdown">

      <button
        className="nav-tab-item"
        type="button"
        data-bs-toggle="dropdown"
      >
        <div className="icon-wrapper">
          <User className="nav-tab-icon" size={26} />
        </div>
        <span className="nav-tab-label">Akun</span>
      </button>

      {/* DROPDOWN */}
      <ul className="dropdown-menu dropdown-menu-end">

        {/* Info User */}
        <li className={styles.userInfo}>
          <p className={styles.userName}>{user?.name || "User"}</p>
          <p className={styles.userEmail}>{user?.email || ""}</p>
        </li>

        <li><hr className="dropdown-divider" /></li>

        {/* Dashboard - hanya admin & seller */}
        {(user?.role === "admin" || user?.role === "seller") && (
          <li>
            <button
              className="dropdown-item"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
          </li>
        )}

        <li><hr className="dropdown-divider" /></li>

        <li>
          <button
            className="dropdown-item"
            onClick={onLogout}
            disabled={logoutLoading}
          >
            {logoutLoading ? "Logging out..." : "Logout"}
          </button>
        </li>

      </ul>

    </div>
  );
};

export default Profile;
