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
    if (!ready) return;

    if (!user) {
      setAdminCheckDone(true);
      return;
    }

    isCurrentUserAdmin()
      .then(setIsAdmin)
      .catch(() => setIsAdmin(false))
      .finally(() => setAdminCheckDone(true));
  }, [user, ready]);

  // Show loading state while auth context is initializing
  if (!ready) {
    return (
      <div className="container section">
        <p>Loading...</p>
      </div>
    );
  }

  // If still checking admin status, show loading
  if (!adminCheckDone) {
    return (
      <div className="container section">
        <p>Checking permissions...</p>
      </div>
    );
  }

  // If no user, redirect to login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // If user but not admin, redirect to dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // User is logged in and is admin, render the page
  return children;
}
