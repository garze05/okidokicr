import React, { useState } from "react";
import FileUpload from "./FileUpload.jsx";

/**
 * VideoInput component that supports both file uploads and URL inputs
 * @param {Object} props
 * @param {Array} props.initialVideos - Array of existing video URLs
 * @param {Function} props.onVideosChange - Callback when videos change
 * @param {boolean} props.disabled - Whether the component is disabled
 */
export default function VideoInput({
  initialVideos = [],
  onVideosChange,
  disabled = false,
}) {
  const [uploadedVideos, setUploadedVideos] = useState(
    initialVideos.filter(
      (url) =>
        url.includes("cloudinary.com") || url.includes("res.cloudinary.com"),
    ),
  );
  const [urlVideos, setUrlVideos] = useState(
    initialVideos
      .filter(
        (url) =>
          !url.includes("cloudinary.com") &&
          !url.includes("res.cloudinary.com"),
      )
      .join("\n"),
  );

  // Handle uploaded video files change
  const handleUploadedVideosChange = (files) => {
    setUploadedVideos(files);
    updateParent(files, urlVideos);
  };

  // Handle URL input change
  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrlVideos(value);
    updateParent(uploadedVideos, value);
  };

  // Update parent component with all videos
  const updateParent = (uploads, urls) => {
    const urlList = urls
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url);

    const allVideos = [...uploads, ...urlList];

    if (onVideosChange) {
      onVideosChange(allVideos);
    }
  };

  // Detect video platform and create embed URL
  const createEmbedUrl = (url) => {
    if (!url) return url;

    // YouTube
    const youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    );
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Return original URL if not recognized
    return url;
  };

  // Get all videos for preview
  const getAllVideos = () => {
    const urlList = urlVideos
      .split("\n")
      .map((url) => url.trim())
      .filter((url) => url);

    return [...uploadedVideos, ...urlList];
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <div>
        <h4 className="mb-3 text-lg font-semibold">Subir Videos</h4>
        <p className="mb-4 text-sm text-gray-600">
          Sube videos directamente desde tu dispositivo. Los videos se
          almacenarán en Cloudinary.
        </p>
        <FileUpload
          initialFiles={uploadedVideos}
          accept="video/*"
          multiple={true}
          label="Haz clic para seleccionar"
          onFilesChange={handleUploadedVideosChange}
          disabled={disabled}
        />
      </div>

      {/* URL Input Section */}
      <div>
        <h4 className="mb-3 text-lg font-semibold">URLs de Videos Externos</h4>
        <p className="mb-4 text-sm text-gray-600">
          Agrega enlaces de YouTube, Vimeo u otros servicios de video (una URL
          por línea).
        </p>
        <textarea
          value={urlVideos}
          onChange={handleUrlChange}
          disabled={disabled}
          rows="5"
          placeholder="https://youtube.com/watch?v=video1&#10;https://vimeo.com/video2&#10;https://example.com/video.mp4"
          className="textarea textarea-bordered textarea-lg w-full font-mono text-sm"
        />
      </div>

      {/* Preview Section */}
      {getAllVideos().length > 0 && (
        <div>
          <h4 className="mb-3 text-lg font-semibold">Vista Previa de Videos</h4>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {getAllVideos().map((videoUrl, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg bg-white shadow-md"
              >
                <div className="aspect-video">
                  {videoUrl.includes("cloudinary.com") ||
                  videoUrl.includes("res.cloudinary.com") ? (
                    // Cloudinary video player
                    <video
                      controls
                      className="h-full w-full object-cover"
                      poster={videoUrl.replace(
                        "/video/",
                        "/video/w_400,h_300,c_fill/",
                      )}
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Tu navegador no soporta el elemento video.
                    </video>
                  ) : (
                    // External video iframe
                    <iframe
                      src={createEmbedUrl(videoUrl)}
                      title={`Video ${index + 1}`}
                      className="h-full w-full"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-xs text-gray-600">
                    {videoUrl.includes("youtube.com") ||
                    videoUrl.includes("youtu.be")
                      ? "YouTube"
                      : videoUrl.includes("vimeo.com")
                        ? "Vimeo"
                        : videoUrl.includes("cloudinary.com")
                          ? "Cloudinary"
                          : "Video externo"}
                  </p>
                  <a
                    href={videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 block truncate text-xs underline"
                  >
                    {videoUrl}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
