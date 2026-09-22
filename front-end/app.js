import { ROUTE_PRESETS, sendApiRequest } from "./api.js";
import { TOKEN_KEY, persistToken, updateTokenAfterResponse } from "./session.js";
const elements = Object.fromEntries(
  ["preset", "method", "path", "body", "token", "include-token", "clear-token", "send", "status", "response"]
    .map((id) => [id, document.getElementById(id)])
);

function applyPreset(index) {
  const preset = ROUTE_PRESETS[index];
  elements.method.innerHTML = ["GET", "POST", "PUT", "PATCH", "DELETE"]
    .map((method) => `<option value="${method}">${method}</option>`).join("");
  elements.method.value = preset.method;
  elements.path.value = preset.path;
  elements.body.value = preset.body;
  elements.body.disabled = ["GET", "HEAD"].includes(preset.method);
}

function showResult(result) {
  elements.status.textContent = `${result.status} ${result.statusText} · ${result.durationMs} ms`;
  elements.status.className = `status ${result.ok ? "success" : "error"}`;
  elements.response.textContent = result.body || "(empty response)";
}

async function submitRequest() {
  elements.send.disabled = true;
  elements.status.textContent = "Sending…";
  elements.status.className = "status";
  try {
    persistToken(localStorage, elements.token.value);
    const result = await sendApiRequest({
      path: elements.path.value,
      method: elements.method.value,
      bodyText: elements.body.value,
      token: elements.token.value,
      includeToken: elements["include-token"].checked
    });
    showResult(result);
    elements.token.value = updateTokenAfterResponse(localStorage, elements.path.value, result, elements.token.value);
  } catch (error) {
    elements.status.textContent = "Request failed";
    elements.status.className = "status error";
    elements.response.textContent = error.message;
  } finally {
    elements.send.disabled = false;
  }
}

ROUTE_PRESETS.forEach((preset, index) => {
  const option = document.createElement("option");
  option.value = index;
  option.textContent = `${preset.method} ${preset.route} — ${preset.label}`;
  elements.preset.append(option);
});
elements.preset.addEventListener("change", () => applyPreset(elements.preset.value));
elements.method.addEventListener("change", () => {
  if (["GET", "HEAD"].includes(elements.method.value)) elements.body.value = "";
  elements.body.disabled = ["GET", "HEAD"].includes(elements.method.value);
});
elements.send.addEventListener("click", submitRequest);
elements.clearToken.addEventListener("click", () => {
  elements.token.value = persistToken(localStorage, "");
});
elements.token.value = localStorage.getItem(TOKEN_KEY) || "";
applyPreset(0);
elements.body.disabled = true;
