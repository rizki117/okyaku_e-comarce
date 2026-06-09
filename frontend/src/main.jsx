import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import "@fontsource/inter";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "simple-datatables/dist/style.css";
import './assets/scss/style.scss'

import "./index.css";

// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Auth Context
import { AuthProvider } from "./context/AuthContext";

// Snackbar Context
import { SnackbarProvider } from "./context/SnackbarContext";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>  {/* ← tambah ini */}
        
         <SnackbarProvider>
            <App />
          </SnackbarProvider>
              
        </AuthProvider>  {/* ← tambah ini */}
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
