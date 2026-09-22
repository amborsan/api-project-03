export const TOKEN_KEY = "api-testing-token";

export function persistToken(storage, value) {
  const token = value.trim();
  if (token) storage.setItem(TOKEN_KEY, token);
  else storage.removeItem(TOKEN_KEY);
  return token;
}

export function updateTokenAfterResponse(storage, path, result, currentToken) {
  const cleanPath = path.split("?", 1)[0];
  if (result.ok && ["/auth/logout", "/users/logout"].includes(cleanPath)) {
    storage.removeItem(TOKEN_KEY);
    return "";
  }
  if (!result.ok || !["/auth/login", "/users/login"].includes(cleanPath)) return currentToken;
  try {
    const token = JSON.parse(result.body).token;
    return token ? persistToken(storage, token) : currentToken;
  } catch {
    return currentToken;
  }
}
