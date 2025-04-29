import React from 'react';
import { useEffect, useState } from 'react';

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
  const {
    title,
    description,
    coverImage,
    available,
    totalImages,
    totalVideos,
  } = service;
  
  const [mediaCounts, setMediaCounts] = useState({ totalImages: 0, totalVideos: 0 });
  useEffect(() => {
    fetchMediaCount(service.id)
      .then(counts => setMediaCounts(counts));
  }, [service.id]);
  
  async function fetchMediaCount(serviceId) {
    try {
      const response = await fetch(`http://localhost:4000/api/services/${serviceId}/media-count`);
      
      if (!response.ok) {
        throw new Error('Error al obtener conteo de media');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error:', error);
      // Proporcionar valores predeterminados en caso de error
      return { totalImages: 0, totalVideos: 0 };
    }
  }


  return (
    <div
      className="group relative cursor-pointer overflow-hidden bg-white rounded-xl sm:rounded-2xl px-4 sm:px-6 pt-8 sm:pt-10 pb-6 sm:pb-8 shadow-lg sm:shadow-xl ring-1 ring-gray-900/5 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl w-full h-full flex flex-col"
    >
      <span
        className="absolute top-0 left-0 z-0 h-24 sm:h-32 w-24 sm:w-32 rounded-full bg-gradient-to-r bg-black-okidoki transition-all duration-500 transform group-hover:scale-[15]"
      ></span>
      <div className="relative z-10 mx-auto flex flex-col h-full w-full gap-3 sm:gap-4">
        {/* Imagen de portada */}
        <div className="w-full h-40 sm:h-48 overflow-hidden rounded-lg sm:rounded-xl">
          <img
            src={coverImage}
            alt={`${title} – Costa Rica OkiDoki`}
            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        {/* Contenido */}
        <div className="flex flex-col flex-1">
          {/* Título */}
          <h3 className="text-lg sm:text-xl font-bold text-primary-500 transition-all duration-500 group-hover:text-white line-clamp-2">
            {title}
          </h3>

          {/* Descripción */}
          <p className="mt-1 text-xs sm:text-sm leading-relaxed text-gray-600 transition-all duration-500 group-hover:text-white overflow-hidden line-clamp-2 sm:line-clamp-3">
            {description}
          </p>

          {/* Spacer */}
          <div className="flex-grow h-5" />

          {/* Etiquetas */}
          <div className="flex flex-wrap gap-2">
          {service.tags.map((tagLink) => (
              <span
                key={tagLink.tagId}
                className="text-xs font-semibold text-gray-500 bg-gray-200 rounded-full px-2 py-1"
              >
                {tagLink.tag?.name}
              </span>
          ))}
          </div>

          {/* Sección inferior */}
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold transition-all duration-500 group-hover:text-white">
                  {mediaCounts.totalImages} <span className="text-gray-500 font-normal">fotos</span>
                </span>
                <span className="text-sm font-bold transition-all duration-500 group-hover:text-white">
                  {mediaCounts.totalVideos} <span className="text-gray-500 font-normal">videos</span>
                </span>
                <span
                  className={`text-xs font-semibold ${
                    available ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {available ? 'Disponible' : 'No Disponible'}
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
