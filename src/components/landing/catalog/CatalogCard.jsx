import React from "react";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.PUBLIC_API_URL;

import { Image, Film } from "lucide-react";

/**
 * CatalogCard
 * @param {{
 *   id: string | number;
 *   title: string;
 *   description: string;
 *   coverImage: string;
 *   totalImages: number;
 *   totalVideos: number;
 *   available: boolean;
 * }} props.service
 */
export default function CatalogCard({ service }) {
  const { title, description, coverImage, available } = service;

  const [mediaCounts, setMediaCounts] = useState({
    totalImages: null, // Initialize with null for loading state
    totalVideos: null, // Initialize with null for loading state
  });
  const [loadingMediaCount, setLoadingMediaCount] = useState(true);

  useEffect(() => {
    setLoadingMediaCount(true);
    fetchMediaCount(service.id)
      .then((counts) => {
        setMediaCounts(counts);
      })
      .catch(() => {
        // Handle error case, e.g., set to default or error state
        setMediaCounts({ totalImages: 0, totalVideos: 0 });
      })
      .finally(() => {
        setLoadingMediaCount(false);
      });
  }, [service.id]);

  async function fetchMediaCount(serviceId) {
    try {
      const response = await fetch(
        `${apiUrl}/services/${serviceId}/media-count`,
      );

      if (!response.ok) {
        throw new Error("Error al obtener conteo de media");
      }

      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      // Proporcionar valores predeterminados en caso de error
      return { totalImages: 0, totalVideos: 0 }; // Or specific error indicators like -1 or null
    }
  }
  return (
    <div className="group relative flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:ring-slate-300/50 sm:rounded-2xl">
      <div className="relative flex h-full w-full flex-col">
        {/* Imagen de portada */}
        <div className="relative h-52 w-full overflow-hidden rounded-t-xl sm:h-48 sm:rounded-t-2xl">
          <img
            src={coverImage}
            alt={`${title} – Costa Rica OkiDoki`}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Image overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />

          {/* Status badge positioned on image */}
          <div className="absolute top-3 right-3">
            <div
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium backdrop-blur-sm ${
                available
                  ? "bg-emerald-500/90 text-white shadow-lg shadow-emerald-500/25"
                  : "bg-red-500/90 text-white shadow-lg shadow-red-500/25"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${available ? "bg-emerald-200" : "bg-red-200"}`}
              />
              {available ? "Disponible" : "No Disponible"}
            </div>
          </div>
        </div>{" "}
        {/* Contenido */}
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {/* Título */}
          <h3 className="text-primary-500 line-clamp-2 text-lg leading-tight font-bold transition-all duration-300 group-hover:text-slate-800 sm:text-xl">
            {title}
          </h3>

          {/* Descripción */}
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 transition-all duration-300 group-hover:text-slate-700 sm:text-base">
            {description}
          </p>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Etiquetas */}
          <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
            {service.tags.map((tagLink) => (
              <span
                key={tagLink.tagId}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors duration-200 group-hover:bg-slate-200 sm:px-3 sm:text-sm"
              >
                {tagLink.tag?.name}
              </span>
            ))}
          </div>

          {/* Sección inferior */}
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {loadingMediaCount ? (
                  <>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-8 animate-pulse rounded bg-slate-200" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
                      <div className="h-3 w-8 animate-pulse rounded bg-slate-200" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 group-hover:text-slate-800">
                      <Image size={16} className="text-slate-500" />
                      <span>{mediaCounts.totalImages ?? "--"}</span>
                      <span className="text-xs font-normal text-slate-500">
                        fotos
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 group-hover:text-slate-800">
                      <Film size={16} className="text-slate-500" />
                      <span>{mediaCounts.totalVideos ?? "--"}</span>
                      <span className="text-xs font-normal text-slate-500">
                        videos
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
