import React, { useState, useCallback, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  CheckCircle,
  MessageCircle,
} from "lucide-react";
import useService from "../../../hooks/useService.js";

const ServiceDetail = ({ serviceId, initialImageIndex = 0 }) => {
  const { service, loading, error, images } = useService(serviceId);
  const [currentIndex, setCurrentIndex] = useState(initialImageIndex);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Update current index when images change or initial index changes
  useEffect(() => {
    setCurrentIndex(Math.min(initialImageIndex, images.length - 1));
  }, [initialImageIndex, images.length]);

  // Update URL with current image index
  const updateURL = useCallback((index) => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("image", index.toString());
      window.history.replaceState({}, "", url);
    }
  }, []);

  // Navigate images
  const navigateImage = useCallback(
    (direction) => {
      if (images.length <= 1) return;

      let newIndex;
      if (direction === "prev") {
        newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      } else {
        newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      }

      setCurrentIndex(newIndex);
      updateURL(newIndex);
    },
    [currentIndex, images.length, updateURL],
  );

  // Go to specific image
  const goToImage = useCallback(
    (index) => {
      setCurrentIndex(index);
      updateURL(index);
    },
    [updateURL],
  );

  // Open lightbox
  const openLightbox = useCallback(() => {
    setLightboxOpen(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  // Close lightbox
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && lightboxOpen) {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        navigateImage("prev");
      } else if (e.key === "ArrowRight") {
        navigateImage("next");
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [lightboxOpen, navigateImage, closeLightbox]);

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-5 py-8 sm:px-10 md:px-20">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="border-primary-500 h-12 w-12 animate-spin rounded-full border-b-2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-5 py-8 sm:px-10 md:px-20">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-red-500">Error</h1>
          <p className="text-gray-600">{error}</p>
          <a
            href="/catalogo"
            className="text-primary-500 mt-4 inline-block hover:underline"
          >
            Volver al catálogo
          </a>
        </div>
      </div>
    );
  }

  if (!service) return null;

  return (
    <>
      <div className="container mx-auto px-3 py-8 sm:px-10 md:px-20">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs mb-4 max-w-sm text-xs sm:mb-8 sm:text-sm">
          <ul>
            <li>
              <a href="/" className="text-primary-500 hover:underline">
                Inicio
              </a>
            </li>
            <li>
              <a href="/catalogo" className="text-primary-500 hover:underline">
                Catálogo
              </a>
            </li>
            <li className="text-secondary-500 font-medium">{service.title}</li>
          </ul>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Image Gallery */}
          <ImageGallery
            images={images}
            currentIndex={currentIndex}
            serviceTitle={service.title}
            onNavigate={navigateImage}
            onGoToImage={goToImage}
            onOpenLightbox={openLightbox}
          />

          {/* Service Information */}
          <ServiceInfo service={service} />
        </div>

        {/* Related Videos */}
        {service.videos && service.videos.length > 0 && (
          <RelatedVideos videos={service.videos} serviceTitle={service.title} />
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onNavigate={navigateImage}
          onClose={closeLightbox}
        />
      )}
    </>
  );
};

// Image Gallery Component
const ImageGallery = ({
  images,
  currentIndex,
  serviceTitle,
  onNavigate,
  onGoToImage,
  onOpenLightbox,
}) => {
  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-lg bg-white shadow-md">
        <div className="flex aspect-video items-center justify-center bg-gray-100">
          <p className="text-gray-500">No hay imágenes disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="relative">
        {/* Main Image */}
        <div
          className="aspect-video cursor-zoom-in bg-gray-100"
          onClick={onOpenLightbox}
        >
          <img
            src={images[currentIndex]?.src}
            alt={`${serviceTitle} - Imagen principal`}
            className="h-full w-full object-cover object-[center_30%]"
          />
        </div>

        {/* Navigation Controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onNavigate("prev")}
              className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer rounded-full bg-white/70 p-2 text-gray-800 shadow transition hover:bg-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full bg-white/70 p-2 text-gray-800 shadow transition hover:bg-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute right-4 bottom-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            <span>{currentIndex + 1}</span>/<span>{images.length}</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="gallery-thumbs mt-4 flex snap-x gap-2 overflow-x-auto px-4 pb-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`thumbnail-btn h-16 min-w-[80px] overflow-hidden rounded border-2 transition ${
                idx === currentIndex
                  ? "border-primary-500"
                  : "border-transparent"
              }`}
              onClick={() => onGoToImage(idx)}
              aria-label={`Ver imagen ${idx + 1}`}
            >
              <img
                src={img.src}
                alt={`${serviceTitle} - Miniatura ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Service Info Component
const ServiceInfo = ({ service }) => (
  <div>
    <h1 className="text-secondary-500 mb-3 text-4xl font-bold md:text-5xl">
      {service.title}
    </h1>

    <div
      className={`dui badge ${service.available ? "badge-success" : "badge-error"} mb-3`}
    >
      <span className="font-semibold">
        {service.available ? "Disponible" : "No Disponible"}
      </span>
    </div>

    <div className="prose prose-lg mb-2 max-w-none">
      <p>{service.description}</p>
    </div>

    {service.features && service.features.length > 0 && (
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Características</h2>
        <ul className="space-y-2">
          {service.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle className="mt-1 mr-2 h-5 w-5 flex-shrink-0 text-green-500" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="mt-4 flex flex-col flex-wrap gap-4 sm:flex-row md:mt-10">
      <a
        href={`https://api.whatsapp.com/send?phone=50688313232&text=Hola%20Oki%20Doki%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20del%20servicio%20de%20${service.title}:%20https://okidokicr.com/catalogo/${service.id}`}
        target="_blank"
        className="bg-primary-500 flex w-full items-center justify-center rounded-lg px-6 py-2 text-white shadow transition hover:bg-orange-700 sm:w-auto"
      >
        <MessageCircle className="mr-2 h-10 w-8" />
        Solicitar información
      </a>

      {service.brochureUrl && (
        <a
          href={service.brochureUrl}
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-800 shadow transition hover:bg-gray-50 sm:w-auto"
          download
        >
          <Download className="mr-2 h-5 w-5" />
          Descargar folleto
        </a>
      )}
    </div>
  </div>
);

// CloudinaryVideoPlayer Component
const CloudinaryVideoPlayer = ({ url, title, orientation = "landscape" }) => {
  // Extract public_id from Cloudinary URL
  const getPublicIdFromUrl = (cloudinaryUrl) => {
    // Handle different Cloudinary URL formats
    const patterns = [
      /\/video\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/,
      /\/raw\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/,
      /\/auto\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/,
    ];

    for (const pattern of patterns) {
      const match = cloudinaryUrl.match(pattern);
      if (match) {
        // Remove file extension if present
        return match[1].replace(/\.[^.]*$/, "");
      }
    }

    // Fallback: try to extract everything after the last slash
    const parts = cloudinaryUrl.split("/");
    const fileName = parts[parts.length - 1];
    return fileName.replace(/\.[^.]*$/, "");
  };
  const publicId = getPublicIdFromUrl(url);
  const cloudName =
    import.meta.env?.PUBLIC_CLOUDINARY_CLOUD_NAME ||
    "fiestas-eventos-costarica-okidoki";

  // Create Cloudinary player URL
  const playerUrl = new URL("https://player.cloudinary.com/embed/");
  const searchParams = new URLSearchParams({
    public_id: publicId,
    cloud_name: cloudName,
    profile: "testimonios",
  });
  const embedUrl = `${playerUrl}?${searchParams.toString()}`;

  // Determine aspect ratio based on orientation
  const paddingBottom = orientation === "vertical" ? "177.78%" : "56.25%";

  return (
    <div className="relative h-0 w-full" style={{ paddingBottom }}>
      <iframe
        src={embedUrl}
        title={title}
        className="absolute top-0 left-0 h-full w-full"
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        frameBorder="0"
      />
    </div>
  );
};

// Related Videos Component
const RelatedVideos = ({ videos, serviceTitle }) => (
  <div className="mt-12">
    <h2 className="mb-6 text-center text-2xl font-bold text-gray-800 sm:text-4xl md:text-left">
      Videos relacionados
    </h2>
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {videos.map((video, index) => {
        const isCloudinary =
          video.url.includes("cloudinary.com") ||
          video.url.includes("res.cloudinary.com");
        const isYouTube =
          video.url.includes("youtube.com") || video.url.includes("youtu.be");
        const isVimeo = video.url.includes("vimeo.com");

        // Create embed URL for external videos
        let embedUrl = video.url;
        if (isYouTube) {
          const youtubeMatch = video.url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
          );
          if (youtubeMatch) {
            embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
          }
        } else if (isVimeo) {
          const vimeoMatch = video.url.match(/vimeo\.com\/(\d+)/);
          if (vimeoMatch) {
            embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
          }
        } // Determine video orientation for Cloudinary videos
        // Priority: 1) video.orientation field, 2) keywords in title, 3) default to landscape
        let videoOrientation = "landscape";

        if (video.orientation) {
          videoOrientation =
            video.orientation === "vertical" || video.orientation === "portrait"
              ? "vertical"
              : "landscape";
        } else if (video.title) {
          const titleLower = video.title.toLowerCase();
          if (
            titleLower.includes("vertical") ||
            titleLower.includes("portrait") ||
            titleLower.includes("story")
          ) {
            videoOrientation = "vertical";
          }
        }

        return (
          <div
            key={index}
            className="overflow-hidden rounded-lg bg-white shadow-md"
          >
            <div className={isCloudinary ? "" : "aspect-video"}>
              {isCloudinary ? (
                <CloudinaryVideoPlayer
                  url={video.url}
                  title={
                    video.title ||
                    `Video ${index + 1} de ${serviceTitle.replace(/['"]/g, "")}`
                  }
                  orientation={videoOrientation}
                />
              ) : (
                <iframe
                  src={embedUrl}
                  title={
                    video.title ||
                    `Video ${index + 1} de ${serviceTitle.replace(/['"]/g, "")}`
                  }
                  className="h-full w-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// Lightbox Component
const Lightbox = ({ images, currentIndex, onNavigate, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={onClose}
        className="cursor-pointer rounded-full bg-white/20 p-2 text-white transition-colors hover:bg-white/40"
        aria-label="Cerrar vista ampliada"
      >
        <X className="h-8 w-8" />
      </button>
    </div>

    <div className="relative flex max-h-[85vh] w-full max-w-6xl items-center justify-center">
      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate("prev")}
            className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 text-white shadow transition hover:bg-white/40"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>

          <button
            onClick={() => onNavigate("next")}
            className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-white/20 p-2 text-white shadow transition hover:bg-white/40"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
        </>
      )}

      <img
        src={images[currentIndex]?.src}
        alt="Imagen ampliada"
        className="max-h-[85vh] max-w-full object-contain"
      />
    </div>

    {/* Image Counter */}
    <div className="mt-4 text-lg font-medium text-white">
      <span>{currentIndex + 1}</span>/<span>{images.length}</span>
    </div>
  </div>
);

export default ServiceDetail;
