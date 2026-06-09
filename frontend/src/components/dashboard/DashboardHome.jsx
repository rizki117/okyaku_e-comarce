

import ChartsSection from "./ChartsSection";
import TopSellingProducts from "./TopSellingProducts";
import RecentSales from "./RecentSales";

const DashboardHome = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="mb-2">
            <h1 className="fs-3 mb-1">Dashboard</h1>
            <p>Welcome Admin</p>
          </div>
        </div>
      </div>

 <ChartsSection />

      <div className="row g-3">
        <div className="col-lg-4">
          <TopSellingProducts />
        </div>
        
        <div className="col-lg-4">
          <RecentSales />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
