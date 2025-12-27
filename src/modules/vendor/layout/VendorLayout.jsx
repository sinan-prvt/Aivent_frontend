import { Outlet } from "react-router-dom";

export default function VendorLayout() {
  return (
    <div>
      <h1>Vendor Dashboard</h1>
      <Outlet />
    </div>
  );
}
