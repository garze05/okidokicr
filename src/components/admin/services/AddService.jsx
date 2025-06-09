import React, { useState } from "react";
import FileUpload from "../shared/FileUpload.jsx";
import VideoInput from "../shared/VideoInput.jsx";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export default function AddService({ allTags }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    coverImage: "",
    available: true,
    gallery: [],
    videos: [],
    tagIds: [],
  });
  const [loading, setLoading] = useState(false);
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  // Handle gallery files change
  const handleGalleryChange = (files) => {
    setFormData((prev) => ({
      ...prev,
      gallery: files,
    }));
  };

  // Handle videos change
  const handleVideosChange = (videos) => {
    setFormData((prev) => ({
      ...prev,
      videos: videos,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Error de autenticación. Por favor, inicia sesión de nuevo.");
      window.location.href = "/login";
      return;
    } // Process gallery and video URLs
    const galleryUrls = Array.isArray(formData.gallery) ? formData.gallery : [];
    const videoUrls = Array.isArray(formData.videos) ? formData.videos : [];

    const data = {
      title: formData.title,
      description: formData.description,
      coverImage: formData.coverImage || null,
      available: formData.available,
      gallery: galleryUrls,
      videos: videoUrls,
      tagIds: formData.tagIds,
    };

    try {
      const response = await fetch(`${apiUrl}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Servicio creado con éxito!");
        window.location.href = "/admin";
      } else if (response.status === 401 || response.status === 403) {
        alert("Error de autenticación. Por favor, inicia sesión de nuevo.");
        window.location.href = "/login";
      } else {
        const errorData = await response.json();
        alert(
          `Error al crear el servicio: ${errorData.error || "Error desconocido"}`,
        );
      }
    } catch (error) {
      console.error("Error al crear el servicio:", error);
      alert("Error de conexión al intentar crear el servicio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-primary text-3xl font-bold">
          Añadir Nuevo Servicio
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
        {/* Title */}
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
            onChange={handleInputChange}
            required
            className="input input-bordered input-lg w-full"
            disabled={loading}
          />
        </div>
        {/* Description */}
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
            onChange={handleInputChange}
            required
            className="textarea textarea-bordered textarea-lg w-full"
            disabled={loading}
          />
        </div>{" "}
        {/* Cover Image */}
        <div className="form-control">
          <label htmlFor="coverImage" className="label">
            <span className="label-text text-lg font-semibold">
              Imagen de Portada
            </span>
          </label>
          <FileUpload
            initialFiles={formData.coverImage ? [formData.coverImage] : []}
            accept="image/*"
            multiple={false}
            label="Arrastra y suelta la imagen de portada aquí"
            onFilesChange={(files) =>
              setFormData((prev) => ({ ...prev, coverImage: files[0] || "" }))
            }
            disabled={loading}
          />
          <div className="mt-2">
            <label className="label">
              <span className="label-text text-sm">O ingresa una URL:</span>
            </label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleInputChange}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="input input-bordered w-full"
              disabled={loading}
            />
          </div>
        </div>
        {/* Availability */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <span className="label-text text-lg font-semibold">Disponible</span>
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="toggle toggle-primary toggle-lg"
              disabled={loading}
            />
          </label>
        </div>
        {/* Tags */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Etiquetas</span>
          </label>
          <div className="border-base-300 grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-3 lg:grid-cols-4">
            {allTags && allTags.length > 0 ? (
              allTags.map((tag) => (
                <label
                  key={tag.id}
                  className="label cursor-pointer justify-start gap-2"
                >
                  <input
                    type="checkbox"
                    checked={formData.tagIds.includes(tag.id)}
                    onChange={() => handleTagChange(tag.id)}
                    className="checkbox checkbox-primary"
                    disabled={loading}
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
        </div>{" "}
        {/* Gallery Images */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">
              Galería de Imágenes
            </span>
          </label>
          <FileUpload
            initialFiles={formData.gallery}
            accept="image/*"
            multiple={true}
            label="Arrastra y suelta imágenes aquí para la galería"
            onFilesChange={handleGalleryChange}
            disabled={loading}
          />
        </div>
        {/* Videos */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Videos</span>
          </label>
          <VideoInput
            initialVideos={formData.videos}
            onVideosChange={handleVideosChange}
            disabled={loading}
          />
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <a href="/admin" className="btn btn-ghost btn-lg">
            Cancelar
          </a>
          <button
            type="submit"
            className={`btn btn-primary btn-lg ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Servicio"}
          </button>
        </div>
      </form>
    </div>
  );
}
