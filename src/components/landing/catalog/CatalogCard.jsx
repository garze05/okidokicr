import React from "react";
import { useEffect, useState } from "react";
const apiUrl = import.meta.env.PUBLIC_API_URL;

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
    totalImages: 0,
    totalVideos: 0,
  });
  useEffect(() => {
    fetchMediaCount(service.id).then((counts) => setMediaCounts(counts));
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
      return { totalImages: 0, totalVideos: 0 };
    }
  }

  return (
    <div className="group hover:bg-black-okidoki relative flex h-full w-full transform cursor-pointer flex-col overflow-hidden rounded-xl bg-white px-4 py-3 shadow-lg ring-1 ring-gray-900/5 transition-all duration-500 hover:scale-105 hover:shadow-2xl sm:rounded-2xl sm:px-6 sm:pt-10 sm:pb-8 sm:shadow-xl">
      <div className="mx-auto flex h-full w-full flex-col gap-3 sm:gap-4">
        {/* Imagen de portada */}
        <div className="h-40 w-full overflow-hidden rounded-lg sm:h-48 sm:rounded-xl">
          <img
            src={coverImage}
            alt={`${title} – Costa Rica OkiDoki`}
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-1 flex-col">
          {/* Título */}
          <h3 className="text-primary-500 line-clamp-2 text-lg font-bold transition-all duration-500 group-hover:text-white sm:text-xl">
            {title}
          </h3>

          {/* Descripción */}
          <p className="mt-1 line-clamp-2 overflow-hidden text-xs leading-relaxed text-gray-600 transition-all duration-500 group-hover:text-white sm:line-clamp-3 sm:text-sm">
            {description}
          </p>

          {/* Spacer */}
          <div className="h-5 flex-grow" />

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2">
            {service.tags.map((tagLink) => (
              <span
                key={tagLink.tagId}
                className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-500"
              >
                {tagLink.tag?.name}
              </span>
            ))}
          </div>

          {/* Sección inferior */}
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold transition-all duration-500 group-hover:text-white">
                  {mediaCounts.totalImages}{" "}
                  <span className="font-normal text-gray-500 group-hover:text-gray-300">
                    fotos
                  </span>
                </span>
                <span className="text-sm font-bold transition-all duration-500 group-hover:text-white">
                  {mediaCounts.totalVideos}{" "}
                  <span className="font-normal text-gray-500 group-hover:text-gray-300">
                    videos
                  </span>
                </span>
                <span
                  className={`text-xs font-semibold ${
                    available ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {available ? "Disponible" : "No Disponible"}
                </span>
              </div>
            </div>

            {/* Botón (descomenta si lo necesitas) */}
            {/*
            <button className="w-full py-1.5 sm:py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-sm sm:text-base rounded-lg transform transition-all duration-300 hover:scale-105">
              Pedir ahora
            </button>
            */}
          </div>
        </div>
      </div>
    </div>
  );
}
