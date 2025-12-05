const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

export const API_ORIGIN = (() => {
  try {
    const url = new URL(API_BASE);
    return `${url.protocol}//${url.host}`;
  } catch (err) {
    return "http://localhost:5000";
  }
})();

const withAuth = (headers = {}, token) =>
  token ? { ...headers, Authorization: `Bearer ${token}` } : headers;

const handleJson = async (res) => {
  if (!res.ok) {
    const message = (await res.json().catch(() => null))?.message || res.statusText;
    throw new Error(message);
  }
  return res.json();
};

export const fetchProfileApi = (token) =>
  fetch(`${API_BASE}/auth/me`, {
    headers: withAuth({}, token),
  }).then(handleJson);

export const registerUser = (payload) =>
  fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).then(handleJson);

export const loginUser = (email, password) =>
  fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then(handleJson);

export const updateProfile = (payload, token) =>
  fetch(`${API_BASE}/auth/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify(payload),
  }).then(handleJson);

export const listPosts = (token, userId, page = 1, perPage = 6) => {
  const params = new URLSearchParams();
  if (userId) params.append("user_id", userId);
  params.append("page", page);
  params.append("per_page", perPage);
  const qs = params.toString();
  return fetch(`${API_BASE}/posts/${qs ? `?${qs}` : ""}`, {
    headers: withAuth({}, token),
  }).then(handleJson);
};

export const createPost = (caption, file, token) => {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("image", file);
  return fetch(`${API_BASE}/posts/`, {
    method: "POST",
    headers: withAuth({}, token),
    body: formData,
  }).then(handleJson);
};

export const deletePost = (postId, token) =>
  fetch(`${API_BASE}/posts/${postId}`, {
    method: "DELETE",
    headers: withAuth({}, token),
  }).then(handleJson);

export const likePost = (postId, token) =>
  fetch(`${API_BASE}/likes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify({ post_id: postId }),
  }).then(handleJson);

export const unlikePost = (postId, token) =>
  fetch(`${API_BASE}/likes/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify({ post_id: postId }),
  }).then(handleJson);

export const listComments = (postId) =>
  fetch(`${API_BASE}/comments/${postId}`).then(handleJson);

export const addComment = (postId, content, token) =>
  fetch(`${API_BASE}/comments/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify({ post_id: postId, content }),
  }).then(handleJson);

export const detectTrash = (file) => {
  const formData = new FormData();
  formData.append("image", file);
  return fetch(`${API_BASE}/ml/detect-trash`, {
    method: "POST",
    body: formData,
  }).then(handleJson);
};

export const askAssistant = (trashItems, token, variant) => {
  const body = { trash_items: trashItems };
  if (variant) body.variant = variant;
  return fetch(`${API_BASE}/assistant/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify(body),
  }).then(handleJson);
};

export const fetchAssistantHistory = (limit = 20, token) =>
  fetch(`${API_BASE}/assistant/history?limit=${limit}`, {
    headers: withAuth({}, token),
  }).then(handleJson);

export const updateAssistantHistory = (payload, token) =>
  fetch(`${API_BASE}/assistant/history`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify(payload),
  }).then(handleJson);

export const followUser = (userId, token) =>
  fetch(`${API_BASE}/follows/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify({ user_id: userId }),
  }).then(handleJson);

export const unfollowUser = (userId, token) =>
  fetch(`${API_BASE}/follows/`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json", ...withAuth({}, token) },
    body: JSON.stringify({ user_id: userId }),
  }).then(handleJson);

export const fetchFollowStats = (userId, token) =>
  fetch(`${API_BASE}/follows/stats?user_id=${userId}`, {
    headers: withAuth({}, token),
  }).then(handleJson);
