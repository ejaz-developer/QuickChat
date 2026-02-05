const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const TOKEN_KEY = "chatapp_token";

const readToken = () => localStorage.getItem(TOKEN_KEY);

const parseResponse = async (response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const request = async (path, options = {}) => {
  const headers = { ...(options.headers || {}) };
  const token = readToken();

  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const hasBody = options.body !== undefined;
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (hasBody && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const body =
    hasBody && !isFormData && typeof options.body !== "string"
      ? JSON.stringify(options.body)
      : options.body;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers,
    body,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const message =
      (data && data.message) || response.statusText || "Request failed";
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
};

export const authTokenKey = TOKEN_KEY;
