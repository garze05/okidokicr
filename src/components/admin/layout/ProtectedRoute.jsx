import React, { useEffect, useState } from "react";
import { isAuthenticated } from "@utils/auth";

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        // Check if running in a browser environment before redirecting
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } else {
        setIsAuth(true);
      }
      setLoading(false);
    };

    checkAuth();

    // Only add storage event listener in browser environment
    if (typeof window !== "undefined") {
      const handleStorageChange = (event) => {
        if (event.key === "token") {
          if (!event.newValue) {
            window.location.href = "/login";
          }
        }
      };

      window.addEventListener("storage", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
      };
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading spinner
  }

  if (!isAuth) {
    // During SSR or if not authenticated, return null or a placeholder.
    // The redirect should primarily be handled client-side in useEffect.
    return null;
  }

  return <>{children}</>; // Render children directly if authenticated
};

export default ProtectedRoute;
