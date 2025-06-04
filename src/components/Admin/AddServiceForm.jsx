// src/components/AddServiceForm.jsx
import React, { useEffect, useState } from "react";

export default function AddServiceForm() {
  const [allTags, setAllTags] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    available: true,
    tagIds: [],
    gallery: "",
    videos: "",
  });

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/tags");
        if (!res.ok)
          throw new Error(`Error al cargar etiquetas. Status: ${res.status}`);
        const tags = await res.json();
        setAllTags(tags);
      } catch (error) {
        console.error("Error fetching tags:", error);
        window.location.href = "/admin/dashboard?error=tag_load_failed";
      }
    };

    fetchTags();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "available") {
      setFormData((prev) => ({ ...prev, available: checked }));
    } else if (name === "tagIds") {
      const tagId = parseInt(value);
      setFormData((prev) => {
        const newTagIds = checked
          ? [...prev.tagIds, tagId]
          : prev.tagIds.filter((id) => id !== tagId);
        return { ...prev, tagIds: newTagIds };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Error de autenticación. Por favor, inicie sesión de nuevo.");
      return;
    }

    const gallery = formData.gallery
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const videos = formData.videos
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);

    const data = {
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage || null,
      available: formData.available,
      tagIds: formData.tagIds,
      gallery,
      videos,
    };

    try {
      const res = await fetch("http://localhost:4000/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("¡Servicio creado con éxito!");
        window.location.href = "/admin/dashboard";
      } else {
        const error = await res.json();
        console.error("Error:", error);
        alert(`Error al crear: ${error.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Error de red:", err);
      alert("Error de conexión al intentar crear el servicio.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-primary text-3xl font-bold">
          Añadir Nuevo Servicio
        </h1>
        <a href="/admin/dashboard" className="btn btn-ghost">
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
              strokeWidth={2}
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
        {/* Título */}
        <div className="form-control">
          <label htmlFor="title" className="label">
            <span className="label-text text-lg font-semibold">
              Título del Servicio
            </span>
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="input input-bordered input-lg w-full"
          />
        </div>

        {/* Descripción */}
        <div className="form-control">
          <label htmlFor="description" className="label">
            <span className="label-text text-lg font-semibold">
              Descripción
            </span>
          </label>
          <textarea
            name="description"
            id="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
            className="textarea textarea-bordered textarea-lg w-full"
          ></textarea>
        </div>

        {/* Imagen de Portada */}
        <div className="form-control">
          <label htmlFor="coverImage" className="label">
            <span className="label-text text-lg font-semibold">
              URL de Imagen de Portada
            </span>
          </label>
          <input
            type="url"
            name="coverImage"
            id="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            className="input input-bordered input-lg w-full"
          />
        </div>

        {/* Disponibilidad */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <span className="label-text text-lg font-semibold">Disponible</span>
            <input
              type="checkbox"
              name="available"
              id="available"
              checked={formData.available}
              onChange={handleChange}
              className="toggle toggle-primary toggle-lg"
            />
          </label>
        </div>

        {/* Etiquetas */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Etiquetas</span>
          </label>
          <div className="border-base-300 grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-3 lg:grid-cols-4">
            {allTags.length > 0 ? (
              allTags.map((tag) => (
                <label
                  key={tag.id}
                  className="label cursor-pointer justify-start gap-2"
                >
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={tag.id}
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={handleChange}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text">{tag.name}</span>
                </label>
              ))
            ) : (
              <p className="text-base-content/70">
                No hay etiquetas disponibles. Por favor, añada etiquetas
                primero.
              </p>
            )}
          </div>
        </div>

        {/* Galería */}
        <div className="form-control">
          <label htmlFor="gallery" className="label">
            <span className="label-text text-lg font-semibold">
              Galería de Imágenes (URLs, una por línea)
            </span>
          </label>
          <textarea
            name="gallery"
            id="gallery"
            rows="5"
            value={formData.gallery}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen1.jpg\nhttps://ejemplo.com/imagen2.jpg"
            className="textarea textarea-bordered textarea-lg w-full font-mono text-sm"
          ></textarea>
        </div>

        {/* Videos */}
        <div className="form-control">
          <label htmlFor="videos" className="label">
            <span className="label-text text-lg font-semibold">
              Videos (URLs, una por línea)
            </span>
          </label>
          <textarea
            name="videos"
            id="videos"
            rows="5"
            value={formData.videos}
            onChange={handleChange}
            placeholder="https://youtube.com/watch?v=video1\nhttps://vimeo.com/video2"
            className="textarea textarea-bordered textarea-lg w-full font-mono text-sm"
          ></textarea>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4">
          <a href="/admin/dashboard" className="btn btn-ghost btn-lg">
            Cancelar
          </a>
          <button type="submit" className="btn btn-primary btn-lg">
            Crear Servicio
          </button>
        </div>
      </form>
    </div>
  );
}
