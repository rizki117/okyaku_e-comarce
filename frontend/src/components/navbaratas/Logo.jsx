//components/navbaratas/Logo.jsx

import React from "react";
import styles from "./logo.module.css";

const Logo = () => (
  <>
    <img 
      src="/images/logo.png" 
      alt="OkYaKu Logo" 
      className={styles["logo"]} 
    />OkYaKu
  </>
);

export default Logo;
