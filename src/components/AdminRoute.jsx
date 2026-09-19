import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isCurrentUserAdmin } from "../lib/storage";

export default function AdminRoute({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckDone, setAdminCheckDone] = useState(false);

  useEffect(() => {
    if (!user) {
      setAdminCheckDone(true);
      return;
    }

    isCurrentUserAdmin()
      .then(setIsAdmin)
      .finally(() => setAdminCheckDone(true));
  }, [user]);

  if (!ready || !adminCheckDone) return null;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
