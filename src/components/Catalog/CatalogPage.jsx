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
    fetch("http://localhost:4000/api/services")
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Instanciar Fuse.js cuando cambian los servicios
  const fuse = useRef(null);
  useEffect(() => {
    fuse.current = new Fuse(services, {
      keys: ['title', 'description', 'tags.tag.name'],
      threshold: 0.3,
    });
  }, [services]);

  // Función para combinar filtros y búsqueda
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
      const matches = fuse.current.search(q).map((r) => r.item);
      // Intersección
      results = results.filter((s) => matches.includes(s));
    }
    return results;
  };

  // Recalcular cada vez que cambian servicios, filtros o query
  useEffect(() => {
    if (!loading) {
      const resultItems = computeFiltered(services, activeFilters, query);
      setFiltered(resultItems);
    }
  }, [services, activeFilters, query]);

  // Toggle de filtros múltiples
  const handleFilter = (slug) => {
    setActiveFilters((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  // Búsqueda con Enter
  const handleSearch = (_, q) => {
    setQuery(q);
  };

  // Selección de sugerencia
  const handleSelect = (item) => {
    setQuery(item.title);
  };

  // Limpiar toda la búsqueda y filtros
  const clearAll = () => {
    setActiveFilters([]);
    setQuery('');
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

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

      {(activeFilters.length > 0 || query) && (
        <div className="px-4 mb-6">
          <button
            onClick={clearAll}
            className="px-4 py-2 text-sm bg-red-500 text-white font-bold hover:bg-red-300 transition-colors cursor-pointer"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <p className="text-gray-500 text-center mb-4">
            {query
              ? `No encontramos resultados para “${query}”${
                  activeFilters.length > 0 ? ' con esos filtros' : ''
                }.`
              : 'No hay servicios para mostrar.'}
          </p>
        </div>
      ) : (
        <div className="px-4 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((s) => (
            <a
              key={s.id}
              href={`/catalogo/${s.id}`}
              className="block h-full"           // para que ocupe todo el espacio
            >
              <CatalogCard key={s.id} service={s} />
            </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}