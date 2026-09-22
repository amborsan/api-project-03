export const API_BASE_URL = "http://localhost:3005";

const json = (value) => JSON.stringify(value, null, 2);

export const ROUTE_PRESETS = [
  { label: "API home", route: "/", method: "GET", path: "/", body: "" },
  { label: "Register (auth)", route: "/auth/register", method: "POST", path: "/auth/register", body: json({ name: "Alice Example", email: "alice@example.com", password: "secret123" }) },
  { label: "Login (auth)", route: "/auth/login", method: "POST", path: "/auth/login", body: json({ email: "alice@example.com", password: "secret123" }) },
  { label: "Logout (auth)", route: "/auth/logout", method: "GET", path: "/auth/logout", body: "" },
  { label: "List users", route: "/users", method: "GET", path: "/users", body: "" },
  { label: "Get user by ID", route: "/users/:id", method: "GET", path: "/users/1", body: "" },
  { label: "Create user", route: "/users", method: "POST", path: "/users", body: json({ name: "Alice Example", email: "alice@example.com", password: "secret123" }) },
  { label: "Replace user", route: "/users/:id", method: "PUT", path: "/users/1", body: json({ name: "Alice Example", email: "alice@example.com", password: "secret123" }) },
  { label: "Edit user", route: "/users/:id", method: "PATCH", path: "/users/1", body: json({ name: "Alice Updated" }) },
  { label: "Delete user", route: "/users/:id", method: "DELETE", path: "/users/1", body: "" },
  { label: "Register (users)", route: "/users/register", method: "POST", path: "/users/register", body: json({ name: "Alice Example", email: "alice@example.com", password: "secret123" }) },
  { label: "Login (users)", route: "/users/login", method: "POST", path: "/users/login", body: json({ email: "alice@example.com", password: "secret123" }) },
  { label: "Logout (users)", route: "/users/logout", method: "GET", path: "/users/logout", body: "" },
  { label: "List products", route: "/products", method: "GET", path: "/products", body: "" },
  { label: "Create product", route: "/products", method: "POST", path: "/products", body: json({ name: "Notebook", slug: "notebook", price: "4.99", stock: 10, categoryIds: [] }) },
  { label: "List categories", route: "/categories", method: "GET", path: "/categories", body: "" },
  { label: "Create category", route: "/categories", method: "POST", path: "/categories", body: json({ name: "Stationery", slug: "stationery" }) },
  { label: "Category products", route: "/categories/:slug/products", method: "GET", path: "/categories/stationery/products", body: "" },
  { label: "List brands", route: "/brands", method: "GET", path: "/brands", body: "" },
  { label: "Get brand by ID", route: "/brands/:id", method: "GET", path: "/brands/1", body: "" },
  { label: "Create brand", route: "/brands", method: "POST", path: "/brands", body: json({ name: "Example Brand", slug: "example-brand" }) },
  { label: "Get cart", route: "/cart/:userId", method: "GET", path: "/cart/1", body: "" },
  { label: "Add to cart", route: "/cart", method: "POST", path: "/cart", body: json({ userId: 1, productId: 1, quantity: 1 }) },
  { label: "Checkout", route: "/order/checkout", method: "POST", path: "/order/checkout", body: json({ userId: 1 }) },
  { label: "Admin dashboard", route: "/admin", method: "GET", path: "/admin", body: "" }
];

export function createRequest(path, method, bodyText, token, includeToken) {
  const normalizedMethod = method.toUpperCase();
  const headers = {};
  const options = { method: normalizedMethod, headers };
  const body = bodyText.trim();

  if (["GET", "HEAD"].includes(normalizedMethod) && body) {
    throw new Error(`${normalizedMethod} requests cannot include a body.`);
  }

  if (!["GET", "HEAD"].includes(normalizedMethod) && body) {
    try {
      JSON.parse(body);
    } catch {
      throw new Error("Request body must be valid JSON.");
    }
    headers["Content-Type"] = "application/json";
    options.body = body;
  }

  if (includeToken && token.trim()) headers.Authorization = `Bearer ${token.trim()}`;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return { url: `${API_BASE_URL}${normalizedPath}`, options };
}

export async function readResponse(response) {
  const text = await response.text();
  if (!text) return "";
  try {
    return JSON.stringify(JSON.parse(text), null, 2);
  } catch {
    return text;
  }
}

export async function sendApiRequest(input, fetchImpl = fetch) {
  const request = createRequest(input.path, input.method, input.bodyText, input.token, input.includeToken);
  const startedAt = performance.now();
  const response = await fetchImpl(request.url, request.options);
  return {
    ok: response.ok,
    status: response.status,
    statusText: response.statusText,
    durationMs: Math.round(performance.now() - startedAt),
    body: await readResponse(response)
  };
}
