// src/utils/auth.js
export function decodeJWT(token) {
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
    console.error("Error decoding JWT:", error);
    return null;
  }
}

export function isTokenExpired(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
}

export function getTokenExpirationTime(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return null;

  return decoded.exp * 1000; // Convert to milliseconds
}

export function getUserFromToken(token) {
  const decoded = decodeJWT(token);
  return decoded?.user || null;
}

export function checkAuthAndRedirect() {
  const token = localStorage.getItem("token");
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return false;
  }
  return true;
}
