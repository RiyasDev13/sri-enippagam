import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getAdminProfile } from "../../services/api.js";

export default function ProtectedRoute() {
  const token = localStorage.getItem("adminToken");
  const [isChecking, setIsChecking] = useState(Boolean(token));
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isMounted = true;

    getAdminProfile()
      .then(() => {
        if (isMounted) {
          setIsAuthorized(true);
        }
      })
      .catch(() => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
      })
      .finally(() => {
        if (isMounted) {
          setIsChecking(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token]);

  if (!token || (!isChecking && !isAuthorized)) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isChecking) {
    return <p>Checking admin access...</p>;
  }

  return <Outlet />;
}