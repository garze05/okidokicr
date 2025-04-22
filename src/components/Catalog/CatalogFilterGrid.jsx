import React, { useEffect, useState } from 'react';
import CatalogFilter from './CatalogFilter.jsx';

export default function CatalogFilterGrid() {
  const [filters, setFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/tags')
      .then((r) => r.json())
      .then((data) => {
        setFilters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-start py-20">
        <p className="text-secondary-500 font-bold text-sm">Cargando filtros…</p>
      </div>
    );
  }

  if (!filters.length) {
    return (
      <div className="flex justify-start py-20">
        <p className="text-gray-500">No hay filtros para mostrar.</p>
      </div>
    );
  }

  return (
    <>
      <p className="px-4 mb-2 text-black-okidoki text-2xl font-medium">Filtrar por:</p>
      <div className="flex flex-wrap items-center gap-2 px-4 mb-6">
        {filters.map((s) => (
          <CatalogFilter key={s.id} filter={s} />
        ))}
      </div>
    </>
  );
}
