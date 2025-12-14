import { Outlet } from "react-router-dom";
import VendorSidebar from "../components/dashboard/VendorSidebar";
import VendorTopbar from "../components/dashboard/VendorTopbar";

export default function VendorDashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <VendorSidebar />

      <div style={{ flex: 1 }}>
        <VendorTopbar />
        <div style={{ padding: 24 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
