import React, { useEffect, useState, useRef } from 'react';
import Fuse from 'fuse.js';
import SearchBar from './SearchBar.jsx';
import CatalogFilterGrid from './CatalogFilterGrid.jsx';
import CatalogCard from './CatalogCard.jsx';

export default function CatalogPage() {
  const [services, setServices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState([]);
  const [query, setQuery] = useState('');

  // Carga inicial de servicios
  useEffect(() => {
    fetch('http://localhost:4000/api/services')
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Instancia Fuse.js cuando cambian los servicios
  const fuse = useRef(null);
  useEffect(() => {
    fuse.current = new Fuse(services, {
      keys: ['title', 'description', 'tags.tag.name'],
      threshold: 0.3,
    });
  }, [services]);

  // Leer query de URL al montar y aplicar búsqueda
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      if (q && fuse.current) {
        setQuery(q);
        const matches = fuse.current.search(q).map(r => r.item);
        setFiltered(matches);
      }
    }
  }, [services]);

  // Filtrado por etiquetas y búsqueda combinados
  const computeFiltered = (items, filters, q) => {
    let results = items;
    // Aplica filtros de etiquetas
    if (filters.length > 0) {
      results = results.filter((s) =>
        filters.every((slug) => s.tags.some((t) => t.tag.slug === slug))
      );
    }
    // Aplica búsqueda difusa
    if (q && fuse.current) {
      const searchMatches = fuse.current.search(q).map(r => r.item);
      // Intersección de resultados con filtrados previos
      results = results.filter((s) => searchMatches.includes(s));
    }
    return results;
  };

  // Handlers
  const handleFilter = (slug) => {
    setActiveFilters(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => setActiveFilters([]);

  const handleSearch = (items, q) => {
    setQuery(q);
    // 'items' proviene de Fuse.search, pero recomputamos para aplicar filtros actuales
    const resultItems = computeFiltered(services, activeFilters, q);
    setFiltered(resultItems);
  };

  const handleSelect = (item) => {
    setQuery(item.title);
    setFiltered([item]);
  };

  // Actualiza filtered si cambian filtros o query sin re-fetch
  useEffect(() => {
    if (!loading) {
      const resultItems = computeFiltered(services, activeFilters, query);
      setFiltered(resultItems);
    }
  }, [activeFilters]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">Cargando catálogo…</p>
      </div>
    );
  }

  return (
    <>
      <SearchBar
        services={services}
        initialQuery={query}
        onSelect={handleSelect}
        onSearch={handleSearch}
      />

      <CatalogFilterGrid
        onFilter={handleFilter}
        activeFilters={activeFilters}
      />

      {activeFilters.length > 0 && (
        <div className="px-4 mb-6">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm bg-red-500 text-white font-bold hover:bg-red-300 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      <div className="px-4 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((s) => (
            <CatalogCard key={s.id} service={s} />
          ))}
        </div>
      </div>
    </>
  );
}