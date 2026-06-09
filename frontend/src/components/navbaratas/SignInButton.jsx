//components/navbaratas/SignInButton.jsx

import React from "react";
import styles from "./sigininbutton.module.css";

const SignInButton = ({ onClick }) => (
  <button className={styles["signin-btn"]} onClick={onClick}>
    <span className={styles["signin-text"]}>Login</span>
  </button>
);

export default SignInButton;
