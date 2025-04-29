import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';

/**
 * SearchBar recibe:
 *  - services: array de objetos de servicio
 *  - initialQuery: texto inicial
 *  - onSelect(item): callback al hacer click en sugerencia
 *  - onSearch(results, query): callback al presionar Enter (varios resultados)
 */
export default function SearchBar({ services, initialQuery = '', onSelect, onSearch }) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const fuse = useRef(
    new Fuse(services, {
      keys: ['title', 'description', 'tags.tag.name'],
      threshold: 0.3,
    })
  );

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setResults(fuse.current.search(query).slice(0, 5));
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      let matches;
      if (!query.trim()) {
        matches = services;
      } else {
        matches = fuse.current.search(query).map(r => r.item);
      }
      // actualiza URL para compartir
      const params = new URLSearchParams(window.location.search);
      if (query.trim()) params.set('q', query.trim()); else params.delete('q');
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
      onSearch(matches, query.trim());
      // Ocultamos resultados pero mantenemos la consulta
      setResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-12">
      <div className="relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="text-gray-400">
              <path fill="currentColor" d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5" />
            </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar personajes, servicios…"
          className="w-full pl-12 pr-4 py-3 text-black-okidoki text-lg bg-gray-300 hover:bg-gray-100 focus:border-primary-500 focus:outline-none focus:ring-3 focus:ring-primary-500 focus:bg-gray-50 rounded-3xl transition-all duration-300 shadow-2xl"
        />
      </div>
      {results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-lg max-h-60 overflow-auto">
          {results.map((r) => (
            <li
              key={r.item.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                const selected = r.item;
                const params = new URLSearchParams(window.location.search);
                params.set('q', selected.title);
                window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
                onSelect(selected);
                // Actualizamos la consulta con el título seleccionado en lugar de borrarla
                setQuery(selected.title);
                setResults([]);
              }}
            >
              {r.item.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}