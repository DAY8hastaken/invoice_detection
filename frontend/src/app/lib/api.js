// app/lib/api.js

export const API_URL = "http://localhost:8000/api";

// Helper to check if running in browser
const isBrowser = () => typeof window !== "undefined";

export const getTokens = () => {
  if (!isBrowser()) return { access: null, refresh: null };
  return {
    access: localStorage.getItem("access_token"),
    refresh: localStorage.getItem("refresh_token"),
  };
};

export const setTokens = (access, refresh) => {
  if (!isBrowser()) return;
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
};

export const clearTokens = () => {
  if (!isBrowser()) return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// Refresh access token helper
async function refreshAccessToken() {
  const { refresh } = getTokens();
  if (!refresh) throw new Error("No refresh token available");

  const res = await fetch(`${API_URL}/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    throw new Error("Session expired. Please log in again.");
  }

  const data = await res.json();
  setTokens(data.access, data.refresh || refresh);
  return data.access;
}

// Custom request wrapper
export async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  
  // Set headers
  const headers = {
    ...options.headers,
  };
  
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  // Inject bearer token if available
  let { access } = getTokens();
  if (access) {
    headers["Authorization"] = `Bearer ${access}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  let response = await fetch(url, fetchOptions);

  // Handle Token Expiry (401 Unauthorized)
  if (response.status === 401) {
    const { refresh } = getTokens();
    if (refresh) {
      try {
        // Attempt token refresh
        const newAccess = await refreshAccessToken();
        
        // Retry with new access token
        headers["Authorization"] = `Bearer ${newAccess}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (err) {
        // Refresh failed, redirect or throw
        if (isBrowser()) {
          window.dispatchEvent(new Event("auth-logout"));
        }
        throw new Error("Your session has expired.");
      }
    } else {
      if (isBrowser()) {
        window.dispatchEvent(new Event("auth-logout"));
      }
    }
  }

  if (!response.ok) {
    let errorMsg = "Something went wrong";
    try {
      const errData = await response.json();
      errorMsg = errData.error || errData.detail || JSON.stringify(errData);
    } catch (_) {}
    throw new Error(errorMsg);
  }

  // If status is 204 No Content, return null or empty
  if (response.status === 204) return null;

  return await response.json();
}

export const api = {
  get: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: "POST", body: body instanceof FormData ? body : JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: "PUT", body: body instanceof FormData ? body : JSON.stringify(body) }),
  patch: (endpoint, body, options = {}) => apiRequest(endpoint, { ...options, method: "PATCH", body: body instanceof FormData ? body : JSON.stringify(body) }),
  delete: (endpoint, options = {}) => apiRequest(endpoint, { ...options, method: "DELETE" }),
};
