import http from "node:http";
import { readFile } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8"
};

export function createStaticServer() {
  return http.createServer((request, response) => {
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    } catch {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    const relativePath = pathname === "/" ? "index.html" : pathname.slice(1);
    const filePath = path.resolve(ROOT, relativePath);
    const relativeToRoot = path.relative(ROOT, filePath);
    if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not Found");
      return;
    }

    readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Not Found");
        return;
      }
      response.writeHead(200, { "Content-Type": MIME_TYPES[path.extname(filePath)] || "application/octet-stream" });
      if (request.method === "HEAD") response.end();
      else response.end(content);
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 3008);
  createStaticServer().listen(port, () => console.log(`Front end running at http://localhost:${port}`));
}
