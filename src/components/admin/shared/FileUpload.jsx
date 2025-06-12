import React, { useState, useEffect, useRef } from "react";

const CLOUDINARY_CLOUD_NAME = import.meta.env.PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Helper to guess resource type from URL for initial files
const guessResourceType = (url) => {
  if (typeof url !== "string") return "raw";
  const imageExtensions = [
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".bmp",
    ".webp",
    ".svg",
  ];
  const videoExtensions = [".mp4", ".mov", ".avi", ".webm", ".mkv", ".flv"];
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (imageExtensions.some((ext) => path.endsWith(ext))) return "image";
    if (videoExtensions.some((ext) => path.endsWith(ext))) return "video";
  } catch (e) {
    // Invalid URL or other error, treat as raw or default
    console.warn("Could not parse URL to guess resource type:", url, e);
  }
  return "raw";
};

export default function FileUpload({
  initialFiles = [],
  accept = "image/*,video/*", // Retained for potential future use, e.g. configuring widget sources/formats
  multiple = true,
  label = "Subir archivos con Cloudinary",
  onFilesChange,
  disabled = false,
}) {
  const [uploadedFiles, setUploadedFiles] = useState(() =>
    initialFiles.map((url) => ({
      url,
      type: guessResourceType(url),
      thumbnailUrl:
        guessResourceType(url) === "video" ? "/media/video-thumbnail.jpg" : url,
    })),
  );
  const cloudinaryWidgetRef = useRef(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "cloudinary-upload-widget-script";
    if (document.getElementById(scriptId)) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://upload-widget.cloudinary.com/latest/global/all.js";
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
    };
    script.onerror = () => {
      console.error("Failed to load Cloudinary Upload Widget script.");
      alert(
        "Error al cargar el componente de subida de archivos. Intenta recargar la página.",
      );
    };
    document.body.appendChild(script);

    return () => {
      // Only remove if this component instance added it and no other instance is relying on it.
      // For simplicity, if multiple FileUpload components could exist, manage script globally or via context.
      // Here, we assume it's okay to remove, or rely on the ID check to prevent re-adding.
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // document.body.removeChild(existingScript); // Be cautious with removing a globally shared script
      }
      if (cloudinaryWidgetRef.current) {
        try {
          cloudinaryWidgetRef.current.destroy();
        } catch (e) {
          console.warn("Error destroying Cloudinary widget:", e);
        }
        cloudinaryWidgetRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (scriptLoaded && window.cloudinary && !cloudinaryWidgetRef.current) {
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        console.error(
          "Cloudinary 'cloudName' or 'uploadPreset' is not configured in environment variables (VITE_CLOUDINARY_CLOUD_NAME, VITE_CLOUDINARY_UPLOAD_PRESET).",
        );
        alert(
          "Error: La configuración para subir archivos no está completa. Contacta al administrador.",
        );
        return;
      }

      const widgetOptions = {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        multiple: multiple,
        sources: ["local", "url", "camera", "google_drive"],
        resourceType: "auto", // Handles mixed image/video based on original 'accept'
        folder: "okidoki_media", // Optional: specify a folder in Cloudinary
        // For more specific client-side format filtering based on 'accept' prop:
        // clientAllowedFormats: (accept && accept.startsWith("image/")) ? ["png", "jpeg", "jpg", "gif"] : ((accept && accept.startsWith("video/")) ? ["mp4", "mov"] : undefined),
        // theme: "minimal", // Example: "purple", "minimal", "white"
        // styles: { ... } // For custom styling
      };

      const widget = window.cloudinary.createUploadWidget(
        widgetOptions,
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            alert(`Error al subir: ${error.message || "Error desconocido"}`);
            return;
          }
          if (result && result.event === "success") {
            const newFile = {
              url: result.info.secure_url,
              type: result.info.resource_type,
              thumbnailUrl:
                result.info.thumbnail_url ||
                (result.info.resource_type === "video"
                  ? "/media/video-thumbnail.jpg"
                  : result.info.secure_url),
            };

            setUploadedFiles((prevFiles) => {
              const updatedFiles = multiple
                ? [...prevFiles, newFile]
                : [newFile];
              if (onFilesChange) {
                onFilesChange(updatedFiles.map((f) => f.url));
              }
              return updatedFiles;
            });
          } else if (result && result.event === "abort") {
            console.log("Upload aborted by user or error", result);
          }
        },
      );
      cloudinaryWidgetRef.current = widget;
    }
  }, [scriptLoaded, multiple, onFilesChange, accept]); // Added accept to dependencies if used in widgetOptions

  const openWidget = () => {
    if (cloudinaryWidgetRef.current) {
      cloudinaryWidgetRef.current.open();
    } else {
      console.error("Cloudinary widget is not initialized yet.");
      alert(
        "El gestor de carga no está listo. Por favor, espera un momento o recarga la página.",
      );
    }
  };

  const removeUploadedFile = (indexToRemove) => {
    setUploadedFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (_, index) => index !== indexToRemove,
      );
      if (onFilesChange) {
        onFilesChange(updatedFiles.map((f) => f.url));
      }
      return updatedFiles;
    });
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={openWidget}
        disabled={disabled || !scriptLoaded || !cloudinaryWidgetRef.current}
        className={`btn btn-primary ${!scriptLoaded || disabled || !cloudinaryWidgetRef.current ? "cursor-not-allowed opacity-50" : ""}`}
      >
        {label}
      </button>

      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Archivos subidos:</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {uploadedFiles.map((file, index) => (
              <div
                key={file.url || index} // Use file.url for key if available and unique
                className="relative rounded-lg border border-green-200 bg-green-50 p-3 shadow-sm"
              >
                <div className="relative mb-2 aspect-square overflow-hidden rounded bg-gray-200">
                  {file.type === "video" ? (
                    <video
                      src={file.url}
                      poster={file.thumbnailUrl || "/media/video-thumbnail.jpg"}
                      controls
                      className="h-full w-full object-cover"
                      preload="metadata"
                    >
                      Tu navegador no soporta la etiqueta de video.{" "}
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver video
                      </a>
                    </video>
                  ) : file.type === "image" ? (
                    <img
                      src={file.thumbnailUrl || file.url}
                      alt={`Archivo subido ${index + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.src = "/file-thumbnail.png";
                      }} // Generic placeholder
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center bg-gray-100 p-2 text-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z"
                          clipRule="evenodd"
                        />
                        <path d="M8 8.707l1.293-1.293a1 1 0 011.414 0L12 8.707V6h2v2.707l1.293-1.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414zM7 11h6v2H7v-2z" />
                      </svg>
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 block truncate text-xs text-blue-600 hover:underline"
                      >
                        Ver {file.type || "archivo"}
                      </a>
                    </div>
                  )}
                  <span className="absolute top-1 right-1 rounded-full bg-green-500 p-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 block truncate text-xs underline"
                >
                  Ver en Cloudinary
                </a>
                <button
                  type="button"
                  onClick={() => removeUploadedFile(index)}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600 disabled:opacity-50"
                  aria-label="Eliminar archivo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
