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
      setResults([]);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto mb-12">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Buscar personajes, servicios…"
        className="w-full pl-10 pr-4 py-3 text-lg bg-gray-300 rounded-3xl focus:outline-none focus:ring-3 focus:ring-primary-500"
      />
      {results.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 mt-1 bg-white rounded-xl shadow-lg max-h-60 overflow-auto">
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
                setQuery('');
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