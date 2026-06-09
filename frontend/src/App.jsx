
// App.jsx

import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import RoleRoute from "./routes/RoleRoute";

//Main Layouts
import DashboardLayout from "./layouts/dashboard/DashboardLayout";

// Sesudah
import { connectSocket, disconnectSocket } from "./socket";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";

{/* Public Router */}
import LoginPage from "./pages/LoginPage";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Produk from "./pages/Produk";
{/* Akhir Public Router */}

{/* Private Router */}
import DashboardHome from "./components/dashboard/DashboardHome";
import DataUser from "./pages/dash/DataUser";
import EditUser from "./pages/dash/EditUser";
import Kategori from "./pages/dash/Kategori";
import Inventory from "./pages/dash/Inventory";
import CreateProduct from "./pages/dash/CreateProduct";
import NotFound from "./pages/dash/NotFound";
import Orders from "./pages/dash/Orders";
{/* Akhir Private Router */}

const App = () => {

  
// Sesudah
useEffect(() => {
  connectSocket();
  return () => {
    disconnectSocket();
  };
}, []);

  return (
    <Routes>

      {/* Semua halaman yang punya navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/produk" element={<Produk />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
          
   {/* Halaman dengan layout (Topbar + Sidebar + Footer) */}
        
       <Route element={<RoleRoute allowedRoles={["admin", "seller"]} />}>
           
    <Route path="/dashboard" element={<DashboardLayout />}>
        
<Route index element={<DashboardHome />} />
    <Route path="users"  element={<DataUser />} />
<Route path="account-settings"  element={<EditUser />} />
          
 <Route path="categories"  element={<Kategori />} />    
  <Route path="inventory" element={<Inventory />} />
      <Route path="orders" element={<Orders />} />
      <Route path="create-product" element={<CreateProduct />} />
            
        </Route>
      </Route>
      </Route> 

    </Routes>
  );
};

export default App;
