// src/components/Admin/DragDropUpload.jsx
import React, { useState, useRef } from "react";

export default function DragDropUpload({
  onFilesUploaded,
  accept = "image/*,video/*",
  multiple = true,
  label = "Arrastra y suelta archivos aquí",
  description = "o haz clic para seleccionar archivos",
  className = "",
  maxFiles = 10,
  textareaId, // ID of textarea to update with URLs
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Formatea el tamaño del archivo a una forma legible
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Crear miniatura para un archivo
  const createThumbnail = (file) => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith("video/")) {
        resolve("/media/video-thumbnail.jpg");
      } else {
        resolve("/file-thumbnail.png");
      }
    });
  };
  // Update textarea with uploaded URLs
  const updateTextarea = (urls) => {
    if (textareaId) {
      const textarea = document.getElementById(textareaId);
      if (textarea) {
        const currentValue = textarea.value.trim();
        const newUrls = urls.join("\n");
        textarea.value = currentValue ? `${currentValue}\n${newUrls}` : newUrls;
      }
    }
  };

  // Manejar archivos seleccionados
  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    const filesWithThumbnails = [];

    for (const file of fileArray) {
      const thumbnail = await createThumbnail(file);
      filesWithThumbnails.push({
        file,
        thumbnail,
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }

    setSelectedFiles(filesWithThumbnails);
  };
  // Subir archivos al servidor
  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadedUrls = [];
    const uploadResults = [];

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No estás autenticado");
        return;
      }

      for (const fileObj of selectedFiles) {
        const formData = new FormData();
        formData.append("file", fileObj.file);

        try {
          const response = await fetch("http://localhost:4000/api/upload", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            uploadedUrls.push(data.url);
            uploadResults.push({
              ...fileObj,
              url: data.url,
              success: true,
            });
          } else {
            console.error("Error uploading file:", fileObj.name);
            uploadResults.push({
              ...fileObj,
              success: false,
              error: "Error al subir archivo",
            });
          }
        } catch (error) {
          console.error("Error uploading file:", fileObj.name, error);
          uploadResults.push({
            ...fileObj,
            success: false,
            error: "Error de conexión",
          });
        }
      }

      // Update state with results
      setUploadedFiles(uploadResults);

      // Update textarea if provided
      if (uploadedUrls.length > 0) {
        updateTextarea(uploadedUrls);
      }

      // Call callback if provided
      if (onFilesUploaded) {
        onFilesUploaded(uploadedUrls);
      }

      // Clear selected files after successful upload
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Error al subir archivos");
    } finally {
      setUploading(false);
    }
  };

  // Event handlers para drag & drop
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

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };
  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearUploadedFiles = () => {
    setUploadedFiles([]);
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Drop Zone */}
      <div
        className={`relative cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-all duration-300 ${
          isDragOver
            ? "border-primary bg-primary/10"
            : "hover:border-primary/50 border-gray-300"
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center">
          <svg
            className="mb-4 h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <p className="text-lg font-medium text-gray-700">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-700">
              Archivos seleccionados ({selectedFiles.length})
            </h4>
            <button
              type="button"
              onClick={clearFiles}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Limpiar todo
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {selectedFiles.map((fileObj, index) => (
              <div
                key={index}
                className="relative rounded-lg bg-gray-50 p-3 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
                >
                  ×
                </button>

                <div className="mb-2 aspect-square overflow-hidden rounded bg-gray-200">
                  <img
                    src={fileObj.thumbnail}
                    alt={fileObj.name}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div
                  className="truncate text-xs font-medium"
                  title={fileObj.name}
                >
                  {fileObj.name}
                </div>
                <div className="text-xs text-gray-500">
                  {formatFileSize(fileObj.size)}
                </div>
              </div>
            ))}
          </div>{" "}
          {/* Upload Button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={uploadFiles}
              disabled={uploading}
              className="bg-primary hover:bg-primary/80 rounded-lg px-6 py-2 font-medium text-white transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <svg
                    className="mr-3 -ml-1 inline h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Subiendo...
                </>
              ) : (
                <>
                  <svg
                    className="mr-2 inline h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Subir {selectedFiles.length} archivo
                  {selectedFiles.length !== 1 ? "s" : ""}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Uploaded Files Results */}
      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-medium text-gray-700">
              Archivos subidos ({uploadedFiles.filter((f) => f.success).length}{" "}
              exitosos)
            </h4>
            <button
              type="button"
              onClick={clearUploadedFiles}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              Limpiar historial
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {uploadedFiles.map((fileObj, index) => (
              <div
                key={index}
                className={`relative rounded-lg p-3 shadow-sm ${
                  fileObj.success
                    ? "border border-green-200 bg-green-50"
                    : "border border-red-200 bg-red-50"
                }`}
              >
                <div className="mb-2 aspect-square overflow-hidden rounded bg-gray-200">
                  <img
                    src={fileObj.thumbnail}
                    alt={fileObj.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-1 right-1">
                    {fileObj.success ? (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                        ✓
                      </span>
                    ) : (
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        ✗
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="truncate text-xs font-medium"
                  title={fileObj.name}
                >
                  {fileObj.name}
                </div>

                {fileObj.success ? (
                  <a
                    href={fileObj.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-xs text-green-600 underline hover:text-green-800"
                  >
                    Ver archivo
                  </a>
                ) : (
                  <div className="mt-1 text-xs text-red-600">
                    {fileObj.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
