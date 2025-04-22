import React, { useEffect, useState, useRef } from 'react';
import Fuse from 'fuse.js';
import CatalogCard from './CatalogCard.jsx';
import SearchBar from './SearchBar.jsx';

/**
 * CatalogGrid recibe servicios iniciales y permite compartir URL con filtros.
 */
export default function CatalogGrid({ initialServices }) {
  const [services] = useState(initialServices);
  const [filtered, setFiltered] = useState(initialServices);
  const [query, setQuery] = useState('');
  const fuse = useRef(
    new Fuse(initialServices, {
      keys: ['title', 'description', 'tags.tag.name'],
      threshold: 0.3,
    })
  );

  useEffect(() => {
    // al montar en cliente, lee posible query en URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q') || '';
      if (q) {
        setQuery(q);
        const matches = fuse.current.search(q).map(r => r.item);
        setFiltered(matches);
      }
    }
  }, []);

  const handleSelect = (item) => {
    setFiltered([item]);
  };

  const handleSearch = (items, q) => {
    setFiltered(items);
    setQuery(q);
  };

  if (!filtered.length) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">No hay servicios para mostrar.</p>
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
