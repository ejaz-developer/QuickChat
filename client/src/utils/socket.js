const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const getWebSocketUrl = (token) => {
  const wsBase = API_BASE_URL.replace(/^http/, "ws");
  const url = new URL("/ws", wsBase);
  if (token) {
    url.searchParams.set("token", token);
  }
  return url.toString();
};
