// src/components/LogoutButton.jsx
import React from "react";

export default function LogoutButton() {
  const handleLogout = () => {
    // Aquí ponés la lógica para cerrar sesión
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirigir al login
  };

  return (
    <button onClick={handleLogout} className="btn btn-error px-4 py-2">
      Cerrar sesión
    </button>
  );
}
