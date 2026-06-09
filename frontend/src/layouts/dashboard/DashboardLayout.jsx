import { useState } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleToggle = () => setIsCollapsed((prev) => !prev);
  const handleMobileOpen = () => setIsMobileOpen(true);
  const handleOverlayClose = () => setIsMobileOpen(false);

  return (
    <>
      <div
        id="overlay"
        className={`overlay ${isMobileOpen ? "show" : ""}`}
        onClick={handleOverlayClose}
      ></div>

      <Topbar onToggle={handleToggle} onMobileOpen={handleMobileOpen} />
      <Sidebar isCollapsed={isCollapsed} isMobileOpen={isMobileOpen} />

      <main id="content" className={`content py-9 ${isCollapsed ? "full" : ""}`}>
        <Outlet />
        <Footer />
      </main>
    </>
  );
};

export default DashboardLayout;
