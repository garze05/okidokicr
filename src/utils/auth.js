const API_URL = import.meta.env.PUBLIC_API_URL;

export const login = async (user, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, password }),
  });

  if (res.ok) {
    const { token } = await res.json();
    localStorage.setItem("token", token);
    return { success: true, token };
  } else {
    return { success: false, status: res.status };
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/admin/login";
};

export const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Decode JWT token without verification (client-side only for reading payload)
export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

export const getTokenExpiration = () => {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload || !payload.exp) return null;

  return payload.exp * 1000; // Convert to milliseconds
};

export const getUserFromToken = () => {
  const token = getToken();
  if (!token) return null;

  const payload = decodeToken(token);
  return payload ? payload.user : null;
};

export const isTokenExpired = () => {
  const expiration = getTokenExpiration();
  if (!expiration) return true;

  return Date.now() >= expiration;
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  return !isTokenExpired();
};

export const checkAuthAndRedirect = () => {
  if (!isAuthenticated()) {
    window.location.href = "/admin/login";
    return false;
  }
  return true;
};
