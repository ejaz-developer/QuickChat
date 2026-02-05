import { request } from "./http";

export const registerUser = (payload) =>
  request("/api/auth/register", {
    method: "POST",
    body: payload,
  });

export const loginUser = (payload) =>
  request("/api/auth/login", {
    method: "POST",
    body: payload,
  });

export const logoutUser = () =>
  request("/api/auth/logout", {
    method: "POST",
  });

export const getMe = () => request("/api/auth/me");

export const listChatUsers = () => request("/api/messages/users");

export const fetchMessages = (userId) => request(`/api/messages/${userId}`);

export const postMessage = (userId, payload) =>
  request(`/api/messages/${userId}`, {
    method: "POST",
    body: payload,
  });
