import { NavLink } from "react-router-dom";

export default function VendorSidebar() {
  return (
    <aside style={{ width: 220, padding: 20, borderRight: "1px solid #ddd" }}>
      <h3>Vendor</h3>

      <nav>
        <NavLink to="/vendor/dashboard">Dashboard</NavLink><br />
        <NavLink to="/vendor/dashboard/profile">Profile</NavLink><br />
        <NavLink to="/vendor/dashboard/settings">Settings</NavLink>
      </nav>
    </aside>
  );
}
