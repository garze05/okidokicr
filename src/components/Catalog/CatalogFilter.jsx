import React from 'react';

/**
 * CatalogFilter
 * @param {{ id: number; name: string; slug: string; }} props.filter
 * @param {boolean} props.isActive
 * @param {(slug: string) => void} props.onFilter
 */
export default function CatalogFilter({ filter, isActive, onFilter }) {
  return (
    <button
      onClick={() => onFilter(filter.slug)}
      className={`cursor-pointer px-3 py-1 rounded-full transition-colors duration-300
        ${isActive ? 'bg-primary-500 text-white border border-primary-500' : 'bg-white text-primary-500 border border-primary-500'}
        hover:bg-primary-500 hover:text-white`}
    >
      {filter.name}
    </button>
  );
}