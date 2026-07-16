#!/usr/bin/env node
/* =====================================================================
   MENU DE PROJETOS — servidor estático único
   -------------------------------------------------------------------
   Serve o menu e os 3 projetos (joes-coffee/, le-cercle/, lumiere/) a
   partir de uma única porta. Suporta HTTP Range (necessário para o
   vídeo do Le Cercle poder ser "seekado" no browser).

   Uso:  node server.js            (porta 5182 por omissão)
         node server.js 5190       (porta à escolha)
   ===================================================================== */
"use strict";

const http = require("http");
const fs   = require("fs");
const path = require("path");

const ROOT = __dirname;
const PORT = parseInt(process.argv[2], 10) || 5182;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
  ".mp4":  "video/mp4",
  ".webm": "video/webm",
  ".ogg":  "video/ogg",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png":  "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".map":  "application/json; charset=utf-8"
};

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Allow": "GET, HEAD" });
    return res.end("405 Method Not Allowed");
  }

  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath.endsWith("/")) urlPath += "index.html";

  // Resolve dentro de ROOT e impede path traversal (../).
  let filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("403 Forbidden");
  }

  fs.stat(filePath, (err, stat) => {
    // Pasta sem index.html explícito → tenta path/index.html
    if (err || !stat.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("404 Not Found");
    }

    const ext  = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const total = stat.size;
    const range = req.headers.range;

    const baseHeaders = {
      "Content-Type": type,
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-cache"
    };

    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
      if (m) {
        let start = m[1] === "" ? NaN : parseInt(m[1], 10);
        let end   = m[2] === "" ? NaN : parseInt(m[2], 10);

        if (Number.isNaN(start)) { start = total - end; end = total - 1; }
        if (Number.isNaN(end))   { end = total - 1; }

        if (start > end || start < 0 || end >= total) {
          res.writeHead(416, { "Content-Range": `bytes */${total}` });
          return res.end();
        }

        res.writeHead(206, {
          ...baseHeaders,
          "Content-Range":  `bytes ${start}-${end}/${total}`,
          "Content-Length": end - start + 1
        });
        if (req.method === "HEAD") return res.end();
        return fs.createReadStream(filePath, { start, end }).pipe(res);
      }
    }

    res.writeHead(200, { ...baseHeaders, "Content-Length": total });
    if (req.method === "HEAD") return res.end();
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Menu de Projetos → http://127.0.0.1:${PORT}`);
  console.log(`A servir: ${ROOT}`);
});
