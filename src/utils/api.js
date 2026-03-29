const DEFAULT_API_BASE = "https://kk-global-group-backend-api.vercel.app/api";

function resolveApiBase(rawBase) {
  const trimmed = String(rawBase || DEFAULT_API_BASE).trim().replace(/\/+$/, "");
  if (trimmed.endsWith("/api")) {
    return trimmed;
  }
  return `${trimmed}/api`;
}

export const API_BASE = resolveApiBase(import.meta.env.VITE_API_URL);

export async function apiRequest(path, options = {}) {
  const { token, body, headers: extraHeaders, ...rest } = options;
  const headers = {
    "Content-Type": "application/json",
    ...(extraHeaders || {}),
  };

  const authToken = token || localStorage.getItem("token");
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && (payload.message || payload.error)) ||
      (typeof payload === "string" && payload) ||
      response.statusText ||
      "Request failed";
    throw new Error(message);
  }

  return payload;
}
