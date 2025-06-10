import { Search } from "lucide-react";
import dashboardImgImport from "@images/rana_upload.png";
const dashboardImg = dashboardImgImport.src || dashboardImgImport;

import React, { useState, useEffect, useMemo } from "react";
import { getTokenExpiration, getUserFromToken } from "@utils/auth";

const apiUrl = import.meta.env.PUBLIC_API_URL;

export default function Dashboard() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [services, setServices] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState("catalog");
  const [greeting, setGreeting] = useState("");
  const [userName, setUserName] = useState(""); // State for user name
  const [searchTerm, setSearchTerm] = useState("");
  const [tagSearchTerm, setTagSearchTerm] = useState(""); // New state for tag search
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "ascending",
  });

  // Delete confirmation state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "service" or "tag"
  const [deleting, setDeleting] = useState(false);
  const columnLabels = {
    id: "ID",
    title: "Título",
    available: "Estado",
    totalImages: "Imágenes",
    totalVideos: "Videos",
    tags: "Etiquetas",
  };

  // Delete functions
  const handleDeleteClick = (item, type) => {
    setItemToDelete(item);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete || !deleteType) return;

    setDeleting(true);
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Error de autenticación. Por favor, inicie sesión de nuevo.");
      setDeleteModalOpen(false);
      setDeleting(false);
      return;
    }

    try {
      const endpoint =
        deleteType === "service"
          ? `/services/${itemToDelete.id}`
          : `/tags/${itemToDelete.id}`;
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Remove item from local state
        if (deleteType === "service") {
          setServices((prev) => prev.filter((s) => s.id !== itemToDelete.id));
          alert(`Servicio "${itemToDelete.title}" eliminado con éxito.`);
        } else {
          setTags((prev) => prev.filter((t) => t.id !== itemToDelete.id));
          alert(`Etiqueta "${itemToDelete.name}" eliminada con éxito.`);
        }
      } else {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`,
        );
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      alert(`Error al eliminar: ${error.message}`);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setItemToDelete(null);
      setDeleteType("");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
    setDeleteType("");
  };
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setGreeting("Buenos días");
    else if (hour >= 12 && hour < 19) setGreeting("Buenas tardes");
    else setGreeting("Buenas noches");

    // Get user from JWT token
    const user = getUserFromToken();
    setUserName(user || "Admin");

    // Get token expiration time
    const tokenExpiration = getTokenExpiration();
    if (!tokenExpiration) {
      // Token is invalid or doesn't exist
      localStorage.removeItem("token");
      window.location.href = "/admin/login";
      return;
    }

    // Calculate initial time left
    const initialTimeLeft = tokenExpiration - Date.now();
    if (initialTimeLeft <= 0) {
      // Token already expired
      localStorage.removeItem("token");
      alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
      window.location.href = "/admin/login";
      return;
    }

    setTimeLeft(initialTimeLeft);

    // Set up timer interval
    const timerInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = tokenExpiration - Date.now();
        if (newTime <= 0) {
          clearInterval(timerInterval);
          localStorage.removeItem("token");
          alert("Tu sesión ha expirado. Por favor, inicia sesión de nuevo.");
          window.location.href = "/admin/login";
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeSection === "catalog" ? "/services" : "/tags";
    fetch(`${apiUrl}${url}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (activeSection === "catalog") setServices(data);
        else setTags(data);
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

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-base-content min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <img
          src={dashboardImg}
          alt="OkiDoki Dashboard"
          className="mb-4 h-50 w-auto sm:mb-0"
          loading="eager"
        />
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <h1 className="text-primary-500 text-3xl font-bold sm:text-4xl">
            {greeting}, {userName || "Admin"}!
          </h1>
          <div className="text-accent text-md mt-2 sm:mt-0 sm:text-base">
            Tiempo restante de sesión:{" "}
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
        <p className="text-neutral-focus mt-2 text-lg">
          Administre los servicios y etiquetas de OkiDoki desde este panel.
        </p>
      </header>

      <div className="rounded-lg p-6">
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
                      <Search />
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
                                {sortConfig.direction === "ascending"
                                  ? "↑"
                                  : "↓"}
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
                                className="btn btn-accent btn-md"
                                target="_blank"
                              >
                                Ver
                              </a>
                              <a
                                href={`/admin/editar/servicio/${s.id}`}
                                className="btn btn-secondary btn-md"
                              >
                                Editar
                              </a>{" "}
                              <button
                                className="btn btn-error btn-md"
                                onClick={() => handleDeleteClick(s, "service")}
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
                  <label tabIndex={0} disabled className="btn btn-ghost btn-lg">
                    Acciones (Proximamente) ▼
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
                  {/* Container for search bar */}
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search />
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
                              {" "}
                              <a
                                href={`/admin/editar/etiqueta/${tag.id}`}
                                className="btn btn-secondary btn-md"
                              >
                                Editar
                              </a>
                              <button
                                className="btn btn-error btn-md"
                                onClick={() => handleDeleteClick(tag, "tag")}
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
            )}{" "}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold">Confirmar Eliminación</h3>
            <p className="py-4">
              ¿Está seguro que desea eliminar{" "}
              {deleteType === "service" ? "el servicio" : "la etiqueta"}{" "}
              <span className="text-error font-semibold">
                "
                {deleteType === "service"
                  ? itemToDelete?.title
                  : itemToDelete?.name}
                "
              </span>
              ?
            </p>
            <p className="text-md mb-4 font-bold">
              Esta acción no se puede deshacer.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={handleDeleteCancel}
                disabled={deleting}
              >
                Cancelar
              </button>
              <button
                className="btn btn-error"
                onClick={handleDeleteConfirm}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Eliminando...
                  </>
                ) : (
                  "Eliminar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
