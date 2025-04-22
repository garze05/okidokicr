import React, { useEffect, useState } from 'react';
import CatalogCard from './CatalogCard.jsx';

export default function CatalogGrid() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/services')
      .then((r) => r.json())
      .then((data) => {
        setServices(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">Cargando catálogo…</p>
      </div>
    );
  }

  if (!services.length) {
    return (
      <div className="flex justify-center py-20">
        <p className="text-gray-500">No hay servicios para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="px-4 pb-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((s) => (
          <CatalogCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}
