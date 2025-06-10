import React, { useState, useRef } from "react";

const apiUrl = import.meta.env.PUBLIC_API_URL;

/**
 * FileUpload component with drag & drop functionality
 * @param {Object} props
 * @param {Array} props.initialFiles - Array of existing file URLs
 * @param {string} props.accept - File types to accept (e.g., "image/*,video/*")
 * @param {boolean} props.multiple - Whether to allow multiple files
 * @param {string} props.label - Label for the upload area
 * @param {Function} props.onFilesChange - Callback when files change
 * @param {boolean} props.disabled - Whether the component is disabled
 */
export default function FileUpload({
  initialFiles = [],
  accept = "image/*,video/*",
  multiple = true,
  label = "Arrastra y suelta archivos aquí o haz clic para seleccionar",
  onFilesChange,
  disabled = false,
}) {
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState(initialFiles);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Create thumbnail for file preview
  const createThumbnail = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        resolve("/media/video-thumbnail.jpg"); // Placeholder for videos
      } else {
        resolve("/file-thumbnail.png"); // Placeholder for other files
      }
    });
  };
  // Handle file selection
  const handleFileSelect = async (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);

    // Create previews for files
    const previews = await Promise.all(
      fileArray.map(async (file) => ({
        file,
        preview: await createThumbnail(file),
        name: file.name,
        size: file.size,
      })),
    );

    setFiles(previews);
  };

  // Upload files to server
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const token = localStorage.getItem("token");
    const results = [];

    if (!token) {
      alert("Error de autenticación. Por favor, inicia sesión de nuevo.");
      window.location.href = "/login";
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const fileData = files[i];
        const formData = new FormData();
        formData.append("file", fileData.file);

        setUploadProgress((prev) => ({ ...prev, [i]: 0 }));

        const response = await fetch(`${apiUrl}/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (response.ok) {
          const { url } = await response.json();
          results.push(url);
          setUploadProgress((prev) => ({ ...prev, [i]: 100 }));
        } else {
          const error = await response.json();
          console.error(`Error uploading ${fileData.name}:`, error);
          setUploadProgress((prev) => ({ ...prev, [i]: -1 }));
        }
      }

      // Update uploaded files list
      const newUploadedFiles = [...uploadedFiles, ...results];
      setUploadedFiles(newUploadedFiles);

      // Notify parent component
      if (onFilesChange) {
        onFilesChange(newUploadedFiles);
      }

      // Clear file selection
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error al subir archivos");
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  };

  // Remove uploaded file
  const removeUploadedFile = (index) => {
    const newUploadedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newUploadedFiles);
    if (onFilesChange) {
      onFilesChange(newUploadedFiles);
    }
  };

  // Remove selected file before upload
  const removeSelectedFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
  };

  // Drag & drop handlers
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    handleFileSelect(droppedFiles);
  };

  return (
    <div className="space-y-4">      {/* Drag & Drop Zone */}
      <div
        className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragOver
            ? "border-primary-500 bg-primary-50"
            : "hover:border-primary-500 border-gray-300"
        } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled}
        />

        <div className="space-y-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mx-auto h-12 w-12 text-gray-400"
          >
            <path
              fill="currentColor"
              d="M9 16v-6H5l7-7l7 7h-4v6zm-4 4v-2h14v2z"
            />
          </svg>
          <p className="text-gray-600">{label}</p>
          <p className="text-primary-500">Haz clic para seleccionar archivos</p>
        </div>
      </div>

      {/* Selected Files (before upload) */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Archivos seleccionados:</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {files.map((fileData, index) => (
              <div
                key={index}
                className="relative rounded-lg bg-gray-50 p-3 shadow-sm"
              >
                <div className="relative mb-2 aspect-square overflow-hidden rounded bg-gray-200">
                  <img
                    src={fileData.preview}
                    alt={fileData.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="truncate text-xs font-medium">
                  {fileData.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(fileData.size)}
                </div>

                {/* Progress bar during upload */}
                {uploading && uploadProgress[index] !== undefined && (
                  <div className="mt-2">
                    <div className="h-2 w-full rounded bg-gray-200">
                      <div
                        className={`h-2 rounded transition-all ${
                          uploadProgress[index] === -1
                            ? "bg-red-500"
                            : uploadProgress[index] === 100
                              ? "bg-green-500"
                              : "bg-primary-500"
                        }`}
                        style={{
                          width: `${Math.max(0, uploadProgress[index])}%`,
                        }}
                      />
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {uploadProgress[index] === -1
                        ? "Error"
                        : uploadProgress[index] === 100
                          ? "Completado"
                          : `${uploadProgress[index]}%`}
                    </div>
                  </div>
                )}

                {/* Remove button */}
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600"
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
                )}
              </div>
            ))}
          </div>

          {/* Upload button */}
          <button
            type="button"
            onClick={uploadFiles}
            disabled={uploading || disabled}
            className={`btn btn-primary ${uploading ? "loading" : ""}`}
          >
            {uploading ? "Subiendo..." : "Subir archivos"}
          </button>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-semibold">Archivos subidos:</h4>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {uploadedFiles.map((fileUrl, index) => (
              <div
                key={index}
                className="relative rounded-lg border border-green-200 bg-green-50 p-3 shadow-sm"
              >
                <div className="relative mb-2 aspect-square overflow-hidden rounded bg-gray-200">
                  <img
                    src={fileUrl}
                    alt={`Archivo ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // If image fails to load, show video thumbnail
                      e.target.src = "/media/video-thumbnail.jpg";
                    }}
                  />
                  {/* Success indicator */}
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
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-800 block truncate text-xs underline"
                >
                  Ver archivo
                </a>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeUploadedFile(index)}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white shadow hover:bg-red-600 disabled:opacity-50"
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
