#!/usr/bin/env node
/* =====================================================================
   PROJECT MENU - single static dev server
   -------------------------------------------------------------------
   Serves the landing page and all demo sites (aurion/, joes-coffee/,
   le-cercle/, lumiere/, monrion-travel/) from one port. Supports HTTP
   Range requests, which the Le Cercle scroll-scrubbed hero video needs
   so the browser can seek inside it.

   Usage:  node server.js            (default port 5182)
           node server.js 5190       (custom port)
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

  // Resolve inside ROOT and block path traversal (../).
  let filePath = path.join(ROOT, path.normalize(urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("403 Forbidden");
  }

  fs.stat(filePath, (err, stat) => {
    // Missing file or directory without an explicit index.html -> 404
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

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Project menu -> http://127.0.0.1:${PORT}`);
  console.log(`Serving: ${ROOT}`);
});
