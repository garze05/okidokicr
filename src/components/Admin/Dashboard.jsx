import { Icon } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import {
  checkAuthAndRedirect,
  getTokenExpirationTime,
  getUserFromToken,
} from "../../utils/auth.js";

// Define the search icon component or use it inline
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    className="text-gray-400"
  >
    <path
      fill="currentColor"
      d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5"
    />
  </svg>
);

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState("--:--");
  const [services, setServices] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("catalog");
  const [greeting, setGreeting] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSearchTerm, setTagSearchTerm] = useState(""); // New state for tag search
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });
  const [username, setUsername] = useState("usuario");

  const columnLabels = {
    id: "ID",
    title: "Título",
    available: "Estado",
    totalImages: "Imágenes",
    totalVideos: "Videos",
    tags: "Etiquetas",
  };
  useEffect(() => {
    // Check authentication on component mount
    if (!checkAuthAndRedirect()) {
      return;
    }

    // Get username from token
    const token = localStorage.getItem("token");
    const user = getUserFromToken(token);
    if (user) {
      setUsername(user);
    }

    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Buenos días");
    else if (hour >= 12 && hour < 19) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");

    // Set up JWT timer
    const updateTimer = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setTimeLeft("--:--");
        return;
      }

      const expirationTime = getTokenExpirationTime(token);
      if (!expirationTime) {
        setTimeLeft("--:--");
        return;
      }

      const now = Date.now();
      const timeRemaining = expirationTime - now;

      if (timeRemaining <= 0) {
        setTimeLeft("00:00");
        // Token expired, redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
      }

      // Convert to minutes:seconds
      const minutes = Math.floor(timeRemaining / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );
    };

    // Update timer immediately
    updateTimer();

    // Update timer every second
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, []);
  useEffect(() => {
    // Check authentication before making API calls
    if (!checkAuthAndRedirect()) {
      return;
    }

    setLoading(true);
    const url = activeSection === "catalog" ? "/api/services" : "/api/tags";
    fetch(`http://localhost:4000${url}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => {
        if (r.status === 401) {
          // Token is invalid or expired
          localStorage.removeItem("token");
          window.location.href = "/login";
          return;
        }
        return r.json();
      })
      .then((data) => {
        if (data) {
          if (activeSection === "catalog") setServices(data);
          else setTags(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeSection]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedServices = useMemo(() => {
    let filtered = [...services];
    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.id.toString().includes(searchTerm),
      );
    }
    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key])
        return sortConfig.direction === "ascending" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key])
        return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [services, searchTerm, sortConfig]);

  const filteredTags = useMemo(() => {
    if (!tagSearchTerm) {
      return tags;
    }
    return tags.filter((tag) =>
      tag.name.toLowerCase().includes(tagSearchTerm.toLowerCase()),
    );
  }, [tags, tagSearchTerm]);

  return (
    <div className="bg-base-200 min-h-screen">
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <img
            src="/src/images/logo_rocky_cara.svg"
            alt="OkiDoki Producciones Rana Logo"
            loading="eager"
            class="h-40 w-40"
          />{" "}
          <h2 className="text-secondary mb-8 text-4xl font-bold">
            {greeting}, <span className="text-primary">{username}</span>
          </h2>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 text-end text-gray-600">
            Sesión activa restante: {timeLeft}
          </div>
          {/* <div className="bg-base-100 p-8 rounded-lg shadow-md h-full flex items-center justify-center">
            <div className="text-center text-xl font-bold">
              ESTADÍSTICAS Y ANALÍTICAS<br />
              (GOOGLE ANALYTICS, SEO, VISITAS, GRÁFICOS, ETC)
            </div>
          </div> */}
        </div>
      </div>

      {/* TABS */}
      <div className="container mx-auto mt-10 mb-6 flex items-center justify-between">
        <div role="tablist" className="tabs tabs-border tabs-lg">
          <a
            role="tab"
            className={`tab ${activeSection === "catalog" ? "tab-active" : ""}`}
            onClick={() => setActiveSection("catalog")}
          >
            Servicios
          </a>
          <a
            role="tab"
            className={`tab ${activeSection === "tags" ? "tab-active" : ""}`}
            onClick={() => setActiveSection("tags")}
          >
            Etiquetas
          </a>
        </div>

        <button
          className="btn btn-primary btn-lg"
          onClick={() => {
            if (activeSection === "catalog") {
              // Placeholder: Implement navigation or modal for adding a service
              window.location.href = "/admin/agregar/servicio";
            } else {
              // Placeholder: Implement navigation or modal for adding a tag
              window.location.href = "/admin/agregar/etiqueta";
            }
          }}
        >
          {activeSection === "catalog"
            ? "+ Agregar Servicio"
            : "+ Agregar Etiqueta"}
        </button>
      </div>
      {/* CATÁLOGO */}
      {activeSection === "catalog" && (
        <div className="bg-base-100 rounded-lg p-6 shadow-xl">
          <h3 className="mb-4 text-xl font-bold">
            Administración de Servicios
          </h3>
          <p className="mb-4">
            Añada, edite, o elimine cualquier servicio ofrecido en el catálogo
            de OkiDoki.
          </p>
          {loading ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="">
              <div className="mb-6 max-w-lg">
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      className="text-gray-400"
                    >
                      <path
                        fill="currentColor"
                        d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    className="input input-bordered mb-4 w-full pl-10" // Added pl-10 for icon
                    placeholder="Buscar en catálogo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <table className="table-zebra table w-full">
                <thead>
                  <tr>
                    {[
                      "id",
                      "title",
                      "available",
                      "totalImages",
                      "totalVideos",
                    ].map((key) => (
                      <th
                        key={key}
                        onClick={() => requestSort(key)}
                        className="hover:bg-base-300 cursor-pointer"
                      >
                        <div className="flex items-center">
                          {columnLabels[key] ?? key}
                          {sortConfig.key === key && (
                            <span className="ml-1">
                              {sortConfig.direction === "ascending" ? "↑" : "↓"}
                            </span>
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
                                alt={`Imagen de ${s.title} Costa Rica OkiDoki`}
                              />
                            </div>
                          </div>
                        </td>
                        <td>{s.title}</td>
                        <td>
                          <div
                            className={`badge ${s.available ? "badge-success" : "badge-error"}`}
                          >
                            {s.available ? "Activo" : "Inactivo"}
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
                              <span className="text-xs text-gray-400 italic">
                                Sin etiquetas
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="flex space-x-2">
                            <a
                              href={`/catalogo/${s.id}`}
                              className="btn btn-ghost btn-sm"
                            >
                              Ver
                            </a>
                            <a
                              href={`/admin/editar/servicio/${s.id}`}
                              className="btn btn-ghost btn-sm"
                            >
                              Editar
                            </a>
                            <button
                              className="btn text-error btn-ghost btn-sm"
                              onClick={() => alert(`Eliminar servicio ${s.id}`)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="py-4 text-center">
                        No se encontraron servicios
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <div className="bg-base-200 flex items-center justify-between rounded-b-lg p-4">
            <span className="text-sm">
              Mostrando {sortedServices.length} de {services.length} servicios
            </span>
            <div className="flex space-x-2">
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-lg">
                  Acciones ▼
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                >
                  <li>
                    <a>Exportar CSV</a>
                  </li>
                  <li>
                    <a>Importar servicios</a>
                  </li>
                  <li>
                    <a>Modificar en lote</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAGS */}
      {activeSection === "tags" && (
        <div className="bg-base-100 rounded-lg p-6 shadow-xl">
          <h3 className="mb-4 text-xl font-bold">
            Administración de Etiquetas
          </h3>
          <p className="mb-4">
            Aquí puede gestionar las etiquetas utilizadas para categorizar sus
            servicios
          </p>
          {loading ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="">
              <div className="mb-6 max-w-lg">
                {" "}
                {/* Container for search bar */}
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    className="input input-bordered mb-4 w-full pl-10" // Style consistent with services search
                    placeholder="Buscar etiquetas..."
                    value={tagSearchTerm}
                    onChange={(e) => setTagSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <table className="table-zebra table w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTags.length > 0 ? (
                    filteredTags.map((tag) => (
                      <tr key={tag.id} className="hover">
                        <td>{tag.id}</td>
                        <td>{tag.name}</td>
                        <td>
                          <div className="flex space-x-2">
                            <a
                              href={`/admin/edit-tag/${tag.id}`}
                              className="btn btn-accent btn-sm"
                            >
                              Editar
                            </a>
                            <button
                              className="btn btn-error btn-sm"
                              onClick={() => alert(`Eliminar tag ${tag.id}`)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="py-4 text-center">
                        No se encontraron etiquetas
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
