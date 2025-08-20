import React from "react";

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
      className={`cursor-pointer rounded-full px-3 py-1 transition-colors duration-300 ${isActive ? "bg-primary-500 border-primary-500 border text-white" : "text-primary-500 border-primary-500 border bg-white"} hover:bg-primary-500 hover:text-white`}
    >
      {filter.name}
    </button>
  );
}
