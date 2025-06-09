// CatalogFilterGrid.jsx
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import CatalogFilter from "./CatalogFilter.jsx";
const apiUrl = import.meta.env.PUBLIC_API_URL;
/**
 * CatalogFilterGrid recibe:
 *  - onFilter(slug): función para togglear filtros
 *  - activeFilters: array de slugs activos
 */
export default function CatalogFilterGrid({ onFilter, activeFilters }) {
  const [filters, setFilters] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    fetch(`${apiUrl}/tags`)
      .then((r) => r.json())
      .then((data) => setFilters(data))
      .catch(console.error);
  }, []);

  if (!filters.length) return null;

  // Contador de filtros activos
  const activeCount = activeFilters.length;

  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-gray-50 shadow-sm">
      {/* Cabecera de filtros (siempre visible) */}
      <div
        className="flex cursor-pointer items-center justify-between px-4 py-3 md:cursor-default"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-primary-500" />
          <h2 className="text-lg font-bold text-gray-800">
            Filtrar por:{" "}
            {activeCount > 0 && (
              <span className="bg-primary-500 ml-1 rounded-full px-2 py-1 text-xs text-white">
                {activeCount}
              </span>
            )}
          </h2>
        </div>
        <div className="md:hidden">
          {isCollapsed ? (
            <ChevronDown size={20} className="text-gray-600" />
          ) : (
            <ChevronUp size={20} className="text-gray-600" />
          )}
        </div>
      </div>

      {/* Contenedor de filtros (colapsable en móvil, siempre visible en desktop) */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isCollapsed ? "max-h-0 md:max-h-none" : "max-h-96"}`}
      >
        <div className="grid grid-cols-2 gap-2 p-4 pt-0 sm:grid-cols-3 md:flex md:flex-wrap md:items-center md:px-4 md:pt-0">
          {filters.map((f) => (
            <CatalogFilter
              key={f.id}
              filter={f}
              isActive={activeFilters.includes(f.slug)}
              onFilter={onFilter}
            />
          ))}
        </div>
      </div>

      {/* Chips de filtros activos (visible en móvil cuando está colapsado) */}
      {isCollapsed && activeCount > 0 && (
        <div className="flex flex-wrap gap-2 px-4 pb-3 md:hidden">
          {filters
            .filter((f) => activeFilters.includes(f.slug))
            .map((f) => (
              <div
                key={f.id}
                className="bg-primary-500 flex items-center rounded-full px-2 py-1 text-xs text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilter(f.slug);
                }}
              >
                {f.name}
                <span className="ml-1 cursor-pointer">×</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
