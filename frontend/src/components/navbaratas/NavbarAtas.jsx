import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./navbaratas.module.css";

import Logo from "./Logo";
import SearchBar from "./SearchBar";
import SignInButton from "./SignInButton";

import useGetMe from "../../hooks/useGetMe";

const NavbarAtas = ({ onSearch, searchValue }) => {
  const navigate = useNavigate();
  const { user, loading } = useGetMe();

  const handleSignIn = () => navigate("/login");

  return (
    <nav className={styles["custom-navbar"]}>
      <Link to="/" className={styles["navbar-brand"]}>
        <Logo />
      </Link>

      <SearchBar onSearch={onSearch} searchValue={searchValue} />

      <div className={styles.navActions}>
        {loading ? null : user ? (
          <span className={styles.userAvatar}>
          </span>
        ) : (
          <SignInButton onClick={handleSignIn} />
        )}
      </div>
    </nav>
  );
};

export default NavbarAtas;