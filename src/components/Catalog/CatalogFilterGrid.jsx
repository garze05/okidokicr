import React, { useEffect, useState } from 'react';
import CatalogFilter from './CatalogFilter.jsx';

/**
 * CatalogFilterGrid recibe:
 *  - onFilter(slug): función para togglear filtros
 *  - activeFilters: array de slugs activos
 */
export default function CatalogFilterGrid({ onFilter, activeFilters }) {
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/tags')
      .then((r) => r.json())
      .then((data) => setFilters(data))
      .catch(console.error);
  }, []);

  if (!filters.length) return null;

  return (
    <div className="px-4 mb-6 flex flex-wrap items-center gap-2">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Filtrar por:</h2>
      {filters.map((f) => (
        <CatalogFilter
          key={f.id}
          filter={f}
          isActive={activeFilters.includes(f.slug)}
          onFilter={onFilter}
        />
      ))}
    </div>
  );
}