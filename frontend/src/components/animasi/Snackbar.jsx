//components/animasi/Snackbar.js

import React from "react";
import "./snackbar.css";

const Snackbar = ({ message, type = "success", visible }) => {
  if (!visible) return null;

  return (
    <div className={`snackbar ${type}`}>
      {message}
    </div>
  );
};

export default Snackbar;
