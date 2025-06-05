// src/components/LogoutButton.jsx
import React from "react";
import { isAuthenticated, logout } from "@utils/auth"; // Adjust the import path as necessary

export default function LogoutButton() {
  const handleLogout = () => {
    if (!isAuthenticated()) {
      // Si no está autenticado, no hacemos nada
      return;
    }

    logout();
  };

  return (
    <button onClick={handleLogout} className="btn btn-error px-4 py-2">
      Cerrar sesión
    </button>
  );
}
