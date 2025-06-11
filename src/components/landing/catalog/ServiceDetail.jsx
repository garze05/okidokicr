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
          <div className="flex flex-col items-center gap-4">
            <div className="border-t-primary-500 h-12 w-12 animate-spin rounded-full border-4 border-slate-200"></div>
            <p className="text-slate-600">Cargando servicio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-5 py-8 sm:px-10 md:px-20">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <X className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-red-600">
            Error al cargar el servicio
          </h1>
          <p className="mb-6 text-slate-600">{error}</p>
          <a
            href="/catalogo"
            className="bg-primary-500 hover:bg-primary-600 inline-flex items-center rounded-lg px-6 py-3 font-medium text-white transition-colors"
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
        {" "}
        {/* Breadcrumbs */}
        <nav className="mb-3 md:mb-7">
          <div className="dui breadcrumbs">
            <ul className="ext-slate-600 flex items-center space-x-2 text-xs sm:text-sm">
              <li>
                <a
                  href="/"
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Inicio
                </a>
              </li>
              <li className="flex items-center">
                <a
                  href="/catalogo"
                  className="text-primary-500 hover:text-primary-600 font-medium transition-colors"
                >
                  Catálogo
                </a>
              </li>
              <li className="flex items-center">
                <span className="font-medium text-slate-800">
                  {service.title}
                </span>
              </li>
            </ul>
          </div>
        </nav>{" "}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
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
  const thumbnailsRef = React.useRef(null);

  // Auto-scroll thumbnails when current index changes
  React.useEffect(() => {
    if (thumbnailsRef.current && images.length > 1) {
      const container = thumbnailsRef.current;
      const activeThumb = container.children[currentIndex];

      if (activeThumb) {
        const containerRect = container.getBoundingClientRect();
        const thumbRect = activeThumb.getBoundingClientRect();

        // Check if thumbnail is outside the visible area
        const isOutsideLeft = thumbRect.left < containerRect.left;
        const isOutsideRight = thumbRect.right > containerRect.right;

        if (isOutsideLeft || isOutsideRight) {
          // Calculate scroll position to center the active thumbnail
          const thumbWidth = activeThumb.offsetWidth;
          const containerWidth = container.offsetWidth;
          const scrollLeft =
            activeThumb.offsetLeft - containerWidth / 2 + thumbWidth / 2;

          container.scrollTo({
            left: Math.max(0, scrollLeft),
            behavior: "smooth",
          });
        }
      }
    }
  }, [currentIndex, images.length]);

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/50">
        <div className="flex aspect-video items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200">
              <X className="h-8 w-8 text-slate-400" />
            </div>
            <p className="font-medium text-slate-500">
              No hay imágenes disponibles
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/50">
      <div className="relative">
        {/* Main Image */}
        <div
          className="group aspect-video cursor-zoom-in bg-slate-100"
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
              className="absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-white/90 p-3 text-slate-700 shadow-lg backdrop-blur-sm transition-all hover:scale-110 hover:bg-white"
              aria-label="Imagen siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute right-4 bottom-4 rounded-lg bg-black/60 px-3 py-1.5 text-sm text-white backdrop-blur-sm">
            <span className="font-medium">{currentIndex + 1}</span>
            <span className="mx-1 text-white/70">/</span>
            <span className="text-white/90">{images.length}</span>
          </div>
        )}
      </div>{" "}
      {/* Thumbnails */}
      {images.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="gallery-thumbs mt-4 flex snap-x gap-3 overflow-x-auto scroll-smooth px-4 pb-4"
          style={{ scrollbarWidth: "thin" }}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              className={`thumbnail-btn h-16 min-w-[80px] flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                idx === currentIndex
                  ? "border-primary-500 ring-primary-500/20 ring-2"
                  : "border-slate-200 hover:border-slate-300"
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
  <div className="flex flex-col">
    <div className="mb-6">
      <h1 className="text-secondary-500 text-3xl leading-tight font-bold sm:text-4xl lg:text-5xl">
        {service.title}
      </h1>
      <div className="mt-2 mb-6">
        <div
          className={`dui badge ${service.available ? "badge-success" : "badge-error"}`}
        >
          <span className="font-semibold">
            {service.available ? "Disponible" : "No Disponible"}
          </span>
        </div>
      </div>{" "}
      <div className="prose prose-slate prose-lg mb-8 max-w-none">
        <p className="leading-relaxed text-slate-800">{service.description}</p>
      </div>
      {service.features && service.features.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-900">
            Características destacadas
          </h2>
          <ul className="space-y-3">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <span className="leading-relaxed text-slate-700">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-auto">
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href={`https://api.whatsapp.com/send?phone=50688313232&text=Hola%20Oki%20Doki%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20del%20servicio%20de%20${service.title}:%20https://okidokicr.com/catalogo/${service.id}`}
            target="_blank"
            className="bg-primary-500 hover:bg-primary-600 flex w-full items-center justify-center gap-3 rounded-xl px-6 py-4 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl sm:w-auto"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Solicitar información</span>
          </a>

          {service.brochureUrl && (
            <a
              href={service.brochureUrl}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 bg-white px-6 py-4 font-medium text-slate-700 shadow-sm transition-all hover:scale-105 hover:bg-slate-50 hover:shadow-md sm:w-auto"
              download
            >
              <Download className="h-5 w-5" />
              <span>Descargar folleto</span>
            </a>
          )}
        </div>
      </div>
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
  <div className="mt-16">
    <div className="mb-8 text-center md:text-left">
      <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
        Videos relacionados
      </h2>
    </div>
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
        }

        // Determine video orientation for Cloudinary videos
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
            className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-lg hover:ring-slate-300/50"
          >
            <div className={`relative ${isCloudinary ? "" : "aspect-video"}`}>
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

            {video.title && (
              <div className="p-4">
                <h3 className="group-hover:text-primary-500 font-medium text-slate-900 transition-colors">
                  {video.title}
                </h3>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
);

// Lightbox Component
const Lightbox = ({ images, currentIndex, onNavigate, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    {/* Header with close button */}
    <div className="absolute top-4 right-4 z-10">
      <button
        onClick={onClose}
        className="rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20"
        aria-label="Cerrar vista ampliada"
      >
        <X className="h-6 w-6" />
      </button>
    </div>

    {/* Main content */}
    <div className="relative flex max-h-[85vh] w-full max-w-6xl items-center justify-center">
      {/* Navigation Controls */}
      {images.length > 1 && (
        <>
          <button
            onClick={() => onNavigate("prev")}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => onNavigate("next")}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/20"
            aria-label="Imagen siguiente"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Main image */}
      <img
        src={images[currentIndex]?.src}
        alt="Imagen ampliada"
        className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
      />
    </div>

    {/* Footer with counter */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
      <div className="rounded-full bg-white/10 px-4 py-2 text-white backdrop-blur-sm">
        <span className="font-medium">{currentIndex + 1}</span>
        <span className="mx-2 text-white/70">de</span>
        <span className="text-white/90">{images.length}</span>
      </div>
    </div>
  </div>
);

export default ServiceDetail;
