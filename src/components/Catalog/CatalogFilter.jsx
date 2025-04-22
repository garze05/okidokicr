import React from 'react';

/**
 * CatalogCard
 * @param {{
 *   id: string | number;
 *   name: string;
 *   slug: string;
 * }} props.tag
 */
export default function CatalogFilter({ filter }) {
  const {
    name,
    slug,
  } = filter;

  return (
      <button class="cursor-pointer px-3 py-1 bg-white text-primary-500 border border-primary-500 rounded-full hover:bg-primary-500 hover:text-white transition-colors duration-300">
        {name}
      </button>
  );
}
