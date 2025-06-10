// filepath: e:\Code\okidokicr\src\components\admin\auth\Login.jsx
import React, { useState } from "react";
import { login } from "@utils/auth"; // Assuming jsconfig.json or similar for @utils path
import Button from "@components/shared/Button.astro"; // This might need to be a React component or handled differently
import Image from "astro/components/Image.astro"; // This might need to be a React component or handled differently

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    const result = await login(user, password);
    if (result.success) {
      window.location.href = "/admin"; // Redirect to admin dashboard
    } else {
      if (result.status === 401) {
        setError("Usuario o contraseña incorrectos");
      } else if (result.status === 403) {
        setError("No tienes permisos para acceder a esta sección");
      } else if (result.status === 500) {
        setError("Error interno del servidor");
      } else {
        setError("Error desconocido al intentar iniciar sesión");
      }
    }
  };

  return (
    <div className="relative grid min-h-[100vh] place-items-center px-3">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          src="/src/images/login-bg.jpg" // Adjusted path for public serving
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      {/* Login Content */}
      <div className="relative z-20 w-full max-w-lg rounded-xl bg-white px-3 py-5 shadow-lg sm:py-10 md:px-5 lg:px-10">
        <div className="flex items-center justify-center">
          <div
            className="tooltip tooltip-success"
            data-tip="Volver a la página principal"
          >
            <a href="/" className="flex items-center justify-center">
              <img
                src="/images/logo2.svg"
                alt="OkiDoki Producciones Rana Logo"
                // loading="eager" // loading attribute is standard HTML
                className="w-50 transition-transform duration-300 hover:scale-105"
              />
            </a>
          </div>
        </div>
        <h3 className="mt-4 text-center text-3xl font-bold">
          Inicio de Sesión
        </h3>
        {error && (
          <div
            className="mt-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}
        <form
          id="login-form"
          className="mt-6 grid gap-4"
          onSubmit={handleSubmit}
        >
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
                  d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
                ></path>
              </svg>
            </span>
            <input
              type="text"
              name="user"
              placeholder="Usuario"
              required
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="text-black-okidoki focus:border-primary-500 focus:ring-primary-500 w-full rounded-3xl bg-gray-300 py-3 pr-4 pl-12 text-lg shadow-2xl transition-all duration-300 hover:bg-gray-100 focus:bg-gray-50 focus:ring-3 focus:outline-none"
            />
          </div>

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
                  d="M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3"
                ></path>
              </svg>
            </span>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black-okidoki focus:border-primary-500 focus:ring-primary-500 w-full rounded-3xl bg-gray-300 py-3 pr-4 pl-12 text-lg shadow-2xl transition-all duration-300 hover:bg-gray-100 focus:bg-gray-50 focus:ring-3 focus:outline-none"
            />
          </div>
          <div className="pt-6">
            {/* The Button.astro component cannot be directly used.
                You'll need a React button component or a standard HTML button.
                Using a standard HTML button for now.
            */}
            <button
              type="submit"
              // Replicate Button.astro classes or use your Tailwind CSS for styling
              className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
