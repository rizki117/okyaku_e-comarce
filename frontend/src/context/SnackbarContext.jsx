//src/context/SnackbarContext.jsx

import { createContext, useContext, useState } from "react";
import Snackbar from "../components/animasi/Snackbar";

const SnackbarContext = createContext();

export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showSnackbar = (message, type = "success") => {
    setSnackbar({
      visible: true,
      message,
      type,
    });

    setTimeout(() => {
      setSnackbar((prev) => ({
        ...prev,
        visible: false,
      }));
    }, 3000);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
      />
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);