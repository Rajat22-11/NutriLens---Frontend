// Copy index.html into a folder per client-side route so static hosts serve the app
// on deep links/refreshes even without a rewrite rule (e.g. /dashboard -> dashboard/index.html).
import { copyFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const ROUTES = ["auth", "login", "index", "scan", "dashboard", "history", "settings"];
const dist = new URL("../dist/", import.meta.url).pathname;
const index = join(dist, "index.html");

for (const route of ROUTES) {
  mkdirSync(join(dist, route), { recursive: true });
  copyFileSync(index, join(dist, route, "index.html"));
}
copyFileSync(index, join(dist, "404.html"));
console.log(`SPA fallback written for: ${ROUTES.join(", ")}`);
