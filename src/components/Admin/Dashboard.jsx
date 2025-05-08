import React, { useState, useEffect, useMemo } from 'react';

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState('30:00');
  const [services, setServices] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('catalog');
  const [greeting, setGreeting] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

  const columnLabels = {
    id: 'ID',
    title: 'Título',
    available: 'Estado',
    totalImages: 'Imágenes',
    totalVideos: 'Videos',
    tags: 'Etiquetas'
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting('Buenos días');
    else if (hour >= 12 && hour < 19) setGreeting('Buenas tardes');
    else setGreeting('Buenas noches');
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeSection === 'catalog' ? '/api/services' : '/api/tags';
    fetch(`http://localhost:4000${url}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then((r) => r.json())
      .then((data) => {
        if (activeSection === 'catalog') setServices(data);
        else setTags(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeSection]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedServices = useMemo(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter((s) =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toString().includes(searchTerm)
      );
    }
    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  }, [services, searchTerm, sortConfig]);

  return (
    <div className="min-h-screen bg-base-200">
      {/* ENCABEZADO */}
      <div className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-4xl font-bold text-secondary mb-8">
            {greeting}, <span className="placeholder">usuario</span>
          </h2>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-4">Administrar catálogo</h3>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="Buscar en catálogo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="text-gray-600 mb-2">Sesión activa restante: {timeLeft}</div>
          <div className="bg-base-100 p-8 rounded-lg shadow-md h-full flex items-center justify-center">
            <div className="text-center text-xl font-bold">
              ESTADÍSTICAS Y ANALÍTICAS<br />
              (GOOGLE ANALYTICS, SEO, VISITAS, GRÁFICOS, ETC)
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="container mx-auto px-6 pb-8">
        <div role="tablist" className="tabs tabs-lift tabs-lg mb-6">
          <a
            role="tab"
            className={`tab ${activeSection === 'catalog' ? 'tab-active' : ''}`}
            onClick={() => setActiveSection('catalog')}
          >
            Servicios
          </a>
          <a
            role="tab"
            className={`tab ${activeSection === 'tags' ? 'tab-active' : ''}`}
            onClick={() => setActiveSection('tags')}
          >
            Etiquetas
          </a>
        </div>

        {/* CATÁLOGO */}
        {activeSection === 'catalog' && (
          <div className="bg-base-100 shadow-xl rounded-lg">
            {loading ? (
              <div className="p-4 flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      {['id', 'title', 'available', 'totalImages', 'totalVideos'].map((key) => (
                        <th
                          key={key}
                          onClick={() => requestSort(key)}
                          className="cursor-pointer hover:bg-base-300"
                        >
                          <div className="flex items-center">
                            {columnLabels[key] ?? key}
                            {sortConfig.key === key && (
                              <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                            )}
                          </div>
                        </th>
                      ))}
                      <th>Etiquetas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedServices.length > 0 ? (
                      sortedServices.map((s) => (
                        <tr key={s.id} className="hover">
                          <td className="flex items-center gap-3">
                            {s.id}
                            <div className="avatar">
                              <div className="mask mask-squircle h-15 w-15">
                                <img
                                  src={s.coverImage}
                                  alt={`Imagen de ${s.title} Costa Rica OkiDoki`} />
                              </div>
                            </div>
                          </td>
                          <td>{s.title}</td>
                          <td>
                            <div className={`badge ${s.available ? 'badge-success' : 'badge-error'}`}>
                              {s.available ? 'Activo' : 'Inactivo'}
                            </div>
                          </td>
                          <td>{s._count?.gallery ?? 0}</td>
                          <td>{s._count?.videos ?? 0}</td>
                          <td>
                            <div className="flex flex-wrap gap-1">
                              {s.tags?.length > 0 ? (
                                s.tags.map((rel) => (
                                  <span
                                    key={rel.tag.id}
                                    className="badge badge-outline badge-sm"
                                    title={`#${rel.tag.slug}`}
                                  >
                                    {rel.tag.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-xs italic text-gray-400">Sin etiquetas</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="flex space-x-2">
                              <a href={`/catalogo/${s.id}`} className="btn btn-accent btn-sm">Ver</a>
                              <a href={`/admin/edit/${s.id}`} className="btn btn-accent btn-sm">Editar</a>
                              <button className="btn btn-error btn-sm" onClick={() => alert(`Eliminar servicio ${s.id}`)}>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center py-4">No se encontraron servicios</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <div className="flex justify-between items-center p-4 bg-base-200 rounded-b-lg">
              <span className="text-sm">Mostrando {sortedServices.length} de {services.length} servicios</span>
              <div className="flex space-x-2">
                <button className="btn btn-secondary btn-lg">+ Agregar Servicio</button>
                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-lg">
                    Acciones ▼
                  </label>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a>Exportar CSV</a></li>
                    <li><a>Importar servicios</a></li>
                    <li><a>Modificar en lote</a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAGS */}
        {activeSection === 'tags' && (
          <div className="bg-base-100 shadow-xl rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Administración de Etiquetas</h3>
            <p className="mb-4">Aquí puede gestionar las etiquetas utilizadas para categorizar sus servicios</p>
            {loading ? (
              <div className="p-4 flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tags.length > 0 ? (
                      tags.map(tag => (
                        <tr key={tag.id} className="hover">
                          <td>{tag.id}</td>
                          <td>{tag.name}</td>
                          <td>
                            <div className="flex space-x-2">
                              <a href={`/admin/edit-tag/${tag.id}`} className="btn btn-accent btn-sm">Editar</a>
                              <button className="btn btn-error btn-sm" onClick={() => alert(`Eliminar tag ${tag.id}`)}>
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">No se encontraron etiquetas</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
            <button className="btn btn-primary mt-4">Añadir Nuevo Tag</button>
          </div>
        )}
      </div>
    </div>
  );
}
