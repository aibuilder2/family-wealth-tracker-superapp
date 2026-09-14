export function getPythonBackendUrl(path = "") {
  const base =
    process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL ||
    process.env.PYTHON_BACKEND_URL ||
    "http://127.0.0.1:8000";

  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}
