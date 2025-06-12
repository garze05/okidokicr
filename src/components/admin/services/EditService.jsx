import { useState, useEffect } from "react";
import FileUpload from "../shared/FileUpload.jsx";
import VideoInput from "../shared/VideoInput.jsx";

export default function EditService({
  service,
  allTags,
  onSuccess = null,
  onCancel = null,
}) {
  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    coverImage: service?.coverImage || "",
    available: service?.available || false,
    gallery: service?.gallery?.map((img) => img.url) || [],
    videos: service?.videos?.map((vid) => vid.url) || [],
    tagIds: service?.tags?.map((t) => t.tagId) || [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.PUBLIC_API_URL;

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
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Error de autenticación. Por favor, inicie sesión de nuevo.");
      setLoading(false);
      return;
    }
    try {
      const galleryUrls = Array.isArray(formData.gallery)
        ? formData.gallery
        : [];
      const videoUrls = Array.isArray(formData.videos) ? formData.videos : [];

      const data = {
        title: formData.title,
        description: formData.description,
        coverImage: formData.coverImage,
        available: formData.available,
        gallery: galleryUrls,
        videos: videoUrls,
        tagIds: formData.tagIds,
      };

      const response = await fetch(`${apiUrl}/services/${service.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (onSuccess) {
          onSuccess(result);
        } else {
          alert("Servicio actualizado con éxito!");
          window.location.href = "/admin";
        }
      } else {
        const errorData = await response.json();
        setError(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error("Error updating service:", error);
      setError("Error de conexión al intentar actualizar el servicio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-primary text-3xl font-bold">
          Editar: <span className="text-secondary">{service?.title}</span>
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

      {error && (
        <div className="alert alert-error mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 shrink-0 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

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
            label="Subir Imagen de Portada"
            onFilesChange={(files) =>
              setFormData((prev) => ({ ...prev, coverImage: files[0] || "" }))
            }
            disabled={loading}
          />
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
            />
          </label>
        </div>
        {/* Tags */}
        <div className="form-control">
          <label className="label">
            <span className="label-text text-lg font-semibold">Etiquetas</span>
          </label>
          <div className="border-base-300 grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-3 lg:grid-cols-4">
            {allTags?.map((tag) => (
              <label
                key={tag.id}
                className="label cursor-pointer justify-start gap-2"
              >
                <input
                  type="checkbox"
                  checked={formData.tagIds.includes(tag.id)}
                  onChange={() => handleTagChange(tag.id)}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">{tag.name}</span>
              </label>
            ))}
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
            label="Subir Imágenes para Galería"
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
          <button
            type="button"
            onClick={onCancel || (() => (window.location.href = "/admin"))}
            className="btn btn-ghost btn-lg"
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Guardando...
              </>
            ) : (
              "Guardar Cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
