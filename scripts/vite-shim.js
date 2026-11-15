#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const wwwDir = path.join(rootDir, "www");
const indexHtmlPath = path.join(wwwDir, "index.html");

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  const routes = ["admin", "worker", "customer", "pitch"];
  for (const r of routes) {
    // 1. Write clean URL file (e.g. www/admin.html)
    fs.writeFileSync(path.join(wwwDir, `${r}.html`), indexHtml, "utf8");
    
    // 2. Write directory index (e.g. www/admin/index.html)
    const routeDir = path.join(wwwDir, r);
    if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, "index.html"), indexHtml, "utf8");
  }
}

console.log("Kaamzo static production assets ready in www/ (with SPA route shims & cleanUrls support)");
process.exit(0);
