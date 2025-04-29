// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';

export default function Dashboard() {
  const [tab, setTab] = useState('upload');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Carga el catálogo al cambiar a la pestaña 'catalog'
  useEffect(() => {
    if (tab === 'catalog') {
      setLoading(true);
      fetch('http://localhost:4000/api/services', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
        .then((r) => r.json())
        .then((data) => setServices(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [tab]);

  return (
    <div className="p-6">
      {/* Navegación de pestañas */}
      <nav className="flex space-x-4 mb-6">
        <button
          onClick={() => setTab('upload')}
          className={`px-4 py-2 rounded-md transition 
            ${tab === 'upload' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >Subir Media</button>

        <button
          onClick={() => setTab('catalog')}
          className={`px-4 py-2 rounded-md transition 
            ${tab === 'catalog' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >Modificar Catálogo</button>

        {/* Futuras pestañas */}
        {/* <button onClick={() => setTab('tags')} className={...}>Gestionar Etiquetas</button> */}
        {/* <button onClick={() => setTab('stats')} className={...}>Estadísticas</button> */}
      </nav>

      {/* Contenido de la pestaña */}
      {tab === 'upload' && (
        <div>
          <p className="mb-4">Usa la interfaz de subida para agregar fotos y videos a Cloudinary:</p>
          <a
            href="/upload"
            className="inline-block px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
          >Ir a Subir Media</a>
        </div>
      )}

      {tab === 'catalog' && (
        <div>
          {loading ? (
            <p>Cargando catálogo...</p>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">ID</th>
                  <th className="border px-4 py-2">Título</th>
                  <th className="border px-4 py-2">Disponible</th>
                  <th className="border px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.id}>
                    <td className="border px-4 py-2">{s.id}</td>
                    <td className="border px-4 py-2">{s.title}</td>
                    <td className="border px-4 py-2">
                      {s.available ? '✅' : '❌'}
                    </td>
                    <td className="border px-4 py-2">
                      <a
                        href={`/catalogo/${s.id}`}
                        className="text-primary-500 hover:underline mr-4"
                      >Ver</a>
                      <a
                        href={`/dashboard/edit/${s.id}`}
                        className="text-primary-500 hover:underline"
                      >Editar</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
