// src/components/Admin/LogoutButton.jsx
import React from "react";

export default function LogoutButton() {
  const handleLogout = () => {
    // Clear the authentication token
    localStorage.removeItem("token");

    // Redirect to login
    window.location.href = "/login";
  };

  return (
    <button onClick={handleLogout} className="btn btn-error px-4 py-2">
      Cerrar sesión
    </button>
  );
}
