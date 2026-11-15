#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const wwwDir = path.join(rootDir, "www");
const indexHtmlPath = path.join(wwwDir, "index.html");

if (fs.existsSync(indexHtmlPath)) {
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  const routes = [
    "admin",
    "worker",
    "worker/home",
    "worker/jobs",
    "worker/radar",
    "worker/active",
    "worker/history",
    "worker/wallet",
    "worker/rewards",
    "worker/profile",
    "worker/support",
    "worker/settings",
    "customer",
    "customer/home",
    "customer/find-workers",
    "customer/radar",
    "customer/post-job",
    "customer/bookings",
    "customer/tools/scan-badge",
    "customer/tools/crew",
    "customer/tools/khata",
    "customer/safety",
    "customer/ai-shortlist",
    "customer/support",
    "customer/profile",
    "customer/settings",
    "pitch"
  ];
  for (const r of routes) {
    // 1. Write directory index (e.g. www/customer/home/index.html)
    const routeDir = path.join(wwwDir, r);
    if (!fs.existsSync(routeDir)) fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, "index.html"), indexHtml, "utf8");

    // 2. Write clean URL file (e.g. www/admin.html, www/customer/radar.html)
    fs.writeFileSync(path.join(wwwDir, `${r}.html`), indexHtml, "utf8");
  }
}

console.log("Kaamzo static production assets ready in www/ (with SPA route shims & cleanUrls support)");
process.exit(0);
