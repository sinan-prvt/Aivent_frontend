import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/core/api/axiosInstance";

export default function VendorApprovedGuard({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    axios.get("/api/auth/me/")
      .then(res => {
        if (res.data.vendor_approved) {
          setStatus("ok");
        } else {
          setStatus("pending");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") return null;

  if (status === "pending") {
    return <Navigate to="/vendor/pending" replace />;
  }

  if (status === "error") {
    return <Navigate to="/vendor/login" replace />;
  }

  return children;
}
