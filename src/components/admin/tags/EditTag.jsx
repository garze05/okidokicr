import React, { useState } from "react";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export default function EditTag({ tag }) {
  const [name, setName] = useState(tag.name);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Por favor, ingresa un nombre para la etiqueta.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Error de autenticación. Por favor, inicia sesión de nuevo.");
      window.location.href = "/admin/login";
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/tags/${tag.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (response.ok) {
        alert("Etiqueta actualizada exitosamente.");
        window.location.href = "/admin";
      } else if (response.status === 401 || response.status === 403) {
        alert("Error de autenticación. Por favor, inicia sesión de nuevo.");
        window.location.href = "/admin/login";
      } else {
        const errorData = await response.json();
        alert(
          `Error al actualizar la etiqueta: ${errorData.error || "Error desconocido"}`,
        );
      }
    } catch (error) {
      console.error("Error al actualizar la etiqueta:", error);
      alert("Error de conexión al intentar actualizar la etiqueta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-primary text-3xl font-bold">
          Editar Etiqueta: <span className="text-secondary">{tag.name}</span>
        </h1>
        <a href="/admin" className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Volver al Dashboard
        </a>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-base-100 space-y-6 rounded-lg p-6 shadow-xl"
      >
        <div className="form-control">
          <label htmlFor="name" className="label">
            <span className="label-text text-lg font-semibold">
              Nombre de la Etiqueta
            </span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Fiesta de cumpleaños, Boda, Evento corporativo..."
            required
            className="input input-bordered input-lg w-full"
            disabled={loading}
          />
          <div className="label">
            <span className="label-text-alt">
              El nombre será usado para categorizar los servicios
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <a href="/admin" className="btn btn-ghost btn-lg">
            Cancelar
          </a>
          <button
            type="submit"
            className={`btn btn-primary btn-lg ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
}
