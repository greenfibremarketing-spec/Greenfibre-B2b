import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn, spawnSync } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const { fileURLToPath } = await import("node:url");
const cwd = fileURLToPath(new URL("..", import.meta.url));
const testRoot = path.join(cwd, ".data");
await fs.mkdir(testRoot, { recursive: true });
const fixture = await fs.mkdtemp(path.join(testRoot, "seo-test-"));
const adminEmail = "greenfibre.marketing@gmail.com";
const password = "SeoFixturePassword123!";
const userId = "111111111111111111111111";
const buyerId = "222222222222222222222222";
const database = {
  b2b_users: [
    { _id: userId, email: adminEmail, password: createHash("sha256").update(password).digest("hex"), fullName: "SEO Test Marketing", companyName: "Green Fibre", role: "b2b_client" },
    { _id: buyerId, email: "buyer@example.com", password: createHash("sha256").update(password).digest("hex"), fullName: "Test Buyer", companyName: "Buyer", role: "b2b_client" }
  ],
  b2b_otps: [{ _id: "333333333333333333333333", email: adminEmail, type: "forgot_password", otp: "123456", verified: true, attempts: 0, expiresAt: new Date(Date.now() + 600000).toISOString() }]
};
await fs.writeFile(path.join(fixture, "local_db.json"), JSON.stringify(database));
const product = { _id: "444444444444444444444444", slug: "seo-test-mug", name: "SEO Test Mug", price: 500, moq: 10, unit: "piece", category: "Drinkware", images: ["/images/hero.jpg"], colours: ["Green"] };
const mock = createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  if (request.url.startsWith("/api/b2b/products/seo-test-mug")) response.end(JSON.stringify({ product }));
  else if (request.url.startsWith("/api/b2b/products")) response.end(JSON.stringify({ products: [product] }));
  else { response.statusCode = 404; response.end("{}"); }
});
await new Promise((resolve) => mock.listen(0, "127.0.0.1", resolve));
const mockUrl = `http://127.0.0.1:${mock.address().port}`;
const port = process.env.SEO_TEST_PORT || "3107";
const base = `http://localhost:${port}`;
const log = await fs.open(path.join(fixture, "server.log"), "w");
const child = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev", "-p", port], {
  cwd, windowsHide: true, stdio: ["ignore", log.fd, log.fd],
  env: { ...process.env, NODE_ENV: "development", MONGODB_URI: "", JWT_SECRET: randomBytes(48).toString("hex"), SEO_ADMIN_EMAILS: adminEmail, B2B_DATA_DIR: fixture, SEO_DATA_DIR: path.join(fixture, "seo"), B2B_API_URL: mockUrl, NEXT_PUBLIC_API_URL: mockUrl }
});

let checks = 0;
async function request(url, options = {}, expected = 200) {
  const response = await fetch(base + url, { ...options, signal: AbortSignal.timeout(60000) });
  assert.equal(response.status, expected, `${options.method || "GET"} ${url}: ${await (response.status !== expected ? response.text() : Promise.resolve(""))}`);
  checks++;
  return response;
}
const bodyOptions = (body, cookie, method = "PUT", origin = base) => ({ method, headers: { "Content-Type": "application/json", Origin: origin, ...(cookie ? { Cookie: cookie } : {}) }, body: JSON.stringify(body) });
async function assertPublishedMetadata(pagePath, values) {
  const html = await (await request(pagePath)).text();
  const decode = (value = "") => value.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
  const attribute = (tag, name) => decode((tag.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1]);
  const meta = (name) => {
    const tag = (html.match(/<meta\b[^>]*>/g) || []).find((tag) => attribute(tag, "name") === name || attribute(tag, "property") === name);
    return tag ? attribute(tag, "content") : "";
  };
  assert.equal(decode((html.match(/<title>(.*?)<\/title>/) || [])[1]), values.title, "editor and HTML title agree");
  for (const [field, name] of Object.entries({ description: "description", ogTitle: "og:title", ogDescription: "og:description", twitterTitle: "twitter:title", twitterDescription: "twitter:description", socialImage: "og:image" })) {
    assert.equal(meta(name), values[field], `${pagePath} ${field} agrees with the SEO editor`);
  }
  assert.equal(meta("keywords"), values.keywords.split("\n").join(","));
  const canonical = (html.match(/<link\b[^>]*>/g) || []).find((tag) => attribute(tag, "rel") === "canonical");
  assert.equal(attribute(canonical, "href"), values.canonical);
  assert.equal(meta("robots"), `${values.noindex ? "noindex" : "index"}, ${values.nofollow ? "nofollow" : "follow"}`);
}
async function checkRedirect(url, cookie, destination) {
  const response = await fetch(base + url, { redirect: "manual", headers: cookie ? { Cookie: cookie } : {}, signal: AbortSignal.timeout(60000) });
  if (response.status === 307) assert.equal(new URL(response.headers.get("location"), base).pathname, destination);
  else {
    assert.equal(response.status, 200);
    const html = await response.text();
    // Next.js redirects after streaming begins use a redirect instruction in HTML.
    assert.ok(html.includes(`NEXT_REDIRECT;replace;${destination};307;`), `Streamed redirect to ${destination}`);
    assert.ok(!html.includes("Website SEO</h1>"), "No protected editor is rendered");
  }
  checks++;
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 90; attempt++) {
    if (child.exitCode !== null) throw new Error("Development server exited early.");
    try { const result = await fetch(base + "/api/seo", { signal: AbortSignal.timeout(1000) }); if (result.status === 403) { ready = true; break; } } catch {}
    await delay(500);
  }
  assert.ok(ready, "Development server is ready");
  await request("/api/seo", {}, 403);
  await checkRedirect("/status", null, "/status/login");
  await checkRedirect("/signup?redirect=%2Fstatus", null, "/status/login");
  await checkRedirect("/login?redirect=%2Fstatus", null, "/status/login");
  await checkRedirect("/status", "b2b_token=expired-invalid-token", "/status/login");
  const signInPage = await (await request("/status/login", { headers: { Cookie: "b2b_token=expired-invalid-token" } })).text();
  assert.ok(signInPage.includes("SEO Administrator Sign In"));
  assert.ok(!signInPage.includes("Create Enterprise Account"));
  await request("/api/seo/login", bodyOptions({ email: "buyer@example.com", password }, null, "POST"), 403);
  await request("/api/seo/login", bodyOptions({ email: adminEmail, password: "IncorrectPassword" }, null, "POST"), 401);
  await request("/api/seo/login", bodyOptions({ email: adminEmail, password }, null, "POST", "https://untrusted.example"), 403);
  const login = await request("/api/seo/login", bodyOptions({ email: adminEmail, password }, null, "POST"));
  const cookie = login.headers.get("set-cookie").split(";")[0];
  await checkRedirect("/status/login", cookie, "/status");
  const buyerLogin = await request("/api/b2b/login", bodyOptions({ email: "buyer@example.com", password }, null, "POST"));
  const buyerCookie = buyerLogin.headers.get("set-cookie").split(";")[0];
  await request("/api/seo", { headers: { Cookie: buyerCookie } }, 403);
  const loaded = await (await request("/api/seo?path=/&pages=1", { headers: { Cookie: cookie } })).json();
  assert.ok(loaded.pages.some((page) => page.path === "/products/seo-test-mug"));
  assert.equal(loaded.source, "defaults");
  await assertPublishedMetadata("/", loaded.effective);
  const productDefaults = await (await request("/api/seo?path=/products/seo-test-mug", { headers: { Cookie: cookie } })).json();
  await assertPublishedMetadata("/products/seo-test-mug", productDefaults.effective);
  assert.equal(productDefaults.defaults.twitterTitle, productDefaults.defaults.ogTitle);
  const settings = { ...loaded.settings, title: "Green Fibre SEO Test <safe>", description: "Server-rendered sustainable gifts test description.", keywords: "eco gifts\neco gifts\nrice husk", ogTitle: "Social SEO Test", twitterTitle: "Twitter SEO Test", noindex: true, nofollow: true, focusKeyword: "eco gifts" };
  await request("/api/seo", bodyOptions({ path: "/", settings }, cookie, "PUT", "https://untrusted.example"), 403);
  await request("/api/seo", bodyOptions({ path: "/", settings: { ...settings, canonical: "javascript:bad" } }, cookie), 422);
  await request("/api/seo", bodyOptions({ path: "/status", settings }, cookie), 404);
  await request("/api/seo", bodyOptions({ path: "/", settings }, buyerCookie), 403);
  const saved = await (await request("/api/seo", bodyOptions({ path: "/", settings }, cookie))).json();
  assert.equal(saved.settings.keywords, "eco gifts\nrice husk");
  const html = await (await request("/")).text();
  assert.ok(html.includes("<title>Green Fibre SEO Test &lt;safe&gt;</title>"), "exact escaped SEO title is in the server HTML");
  assert.ok(html.includes('name="description" content="Server-rendered sustainable gifts test description."'));
  assert.ok(html.includes('property="og:title" content="Social SEO Test"'));
  assert.ok(html.includes('name="twitter:title" content="Twitter SEO Test"'));
  assert.ok(html.includes('name="robots" content="noindex, nofollow"'));
  const restored = await (await request("/api/seo?path=/", { headers: { Cookie: cookie } })).json();
  assert.equal(restored.settings.title, settings.title);
  assert.equal(restored.source, "saved");
  await assertPublishedMetadata("/", restored.effective);
  const sitemap = await (await request("/sitemap.xml")).text();
  assert.ok(!sitemap.includes("<loc>https://trade.greenfibre.org/</loc>"), "noindex homepage omitted from sitemap");
  const statusHtml = await (await request("/status", { headers: { Cookie: cookie } })).text();
  assert.ok(statusHtml.includes("Website SEO"));
  assert.ok(statusHtml.includes('href="/status"'), "admin navigation link appears");
  await checkRedirect("/status", buyerCookie, "/status/login");
  await request("/api/b2b/reset-password", bodyOptions({ email: adminEmail, otp: "999999", newPassword: "AttemptedTakeover123" }, null, "POST"), 400);
  await request("/api/seo/image", { method: "POST", headers: { Cookie: cookie, Origin: base }, body: "not an image" }, 422);
  const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a2ioAAAAASUVORK5CYII=", "base64");
  const upload = await (await request("/api/seo/image", { method: "POST", headers: { Cookie: cookie, Origin: base, "Content-Type": "image/png" }, body: png })).json();
  const image = await request(upload.url);
  assert.equal(image.headers.get("content-type"), "image/png");
  assert.deepEqual(Buffer.from(await image.arrayBuffer()), png);
  const robots = await (await request("/robots.txt")).text();
  assert.ok(robots.includes("Allow: /api/seo/image/"), "public uploaded share images are crawlable");
  assert.ok(robots.includes("Disallow: /api/"), "other API routes remain excluded");
  const catalog = await (await request("/api/seo?path=/products", { headers: { Cookie: cookie } })).json();
  assert.equal(catalog.defaults.socialImage, "https://trade.greenfibre.org/images/hero.jpg", "catalog shares the mock catalog product photo, not the decorative default");
  await assertPublishedMetadata("/products", catalog.effective);
  const catalogSaved = await (await request("/api/seo", bodyOptions({ path: "/products", settings: { ...catalog.settings, noindex: false, socialImage: upload.url } }, cookie))).json();
  assert.equal(catalogSaved.effective.socialImage, `https://trade.greenfibre.org${upload.url}`, "an uploaded SEO image takes priority over the catalog default");
  await assertPublishedMetadata("/products", catalogSaved.effective);
  const filtered = await (await request("/products?q=mug")).text();
  assert.ok(filtered.includes('name="robots" content="noindex, follow"'));
  const category = await (await request("/api/seo?path=/category/drinkware", { headers: { Cookie: cookie } })).json();
  await request("/api/seo", bodyOptions({ path: "/category/drinkware", settings: { ...category.settings, title: "Custom Drinkware SEO" } }, cookie));
  assert.ok((await (await request("/category/drinkware")).text()).includes("<title>Custom Drinkware SEO</title>"));
  const categoryState = await (await request("/api/seo?path=/category/drinkware", { headers: { Cookie: cookie } })).json();
  await assertPublishedMetadata("/category/drinkware", categoryState.effective);
  const detail = await (await request("/api/seo?path=/products/seo-test-mug", { headers: { Cookie: cookie } })).json();
  await request("/api/seo", bodyOptions({ path: "/products/seo-test-mug", settings: { ...detail.settings, title: "Custom Mug SEO" } }, cookie));
  assert.ok((await (await request("/products/seo-test-mug")).text()).includes("<title>Custom Mug SEO</title>"));
  const partial = { ...detail.settings, title: "Changed live mug", description: "Updated product description", ogTitle: "", ogDescription: "", twitterTitle: "", twitterDescription: "", canonical: "", socialImage: "", keywords: "" };
  const partialSaved = await (await request("/api/seo", bodyOptions({ path: "/products/seo-test-mug", settings: partial }, cookie))).json();
  await assertPublishedMetadata("/products/seo-test-mug", partialSaved.effective);
  assert.equal(partialSaved.effective.twitterTitle, partial.title);
  console.log(`Passed ${checks} HTTP checks plus metadata, persistence, permissions, sitemap, image and OTP assertions.`);
  if (process.argv.includes("--keep-open")) {
    console.log(`Isolated UI preview: ${base}/status/login (fixture login ${adminEmail}, password ${password}).`);
    await new Promise((resolve) => { process.once("SIGINT", resolve); process.once("SIGTERM", resolve); });
  }
} catch (error) {
  console.error(await fs.readFile(path.join(fixture, "server.log"), "utf8"));
  throw error;
} finally {
  if (process.platform === "win32") spawnSync("taskkill", ["/PID", String(child.pid), "/T", "/F"], { windowsHide: true, stdio: "ignore" });
  else child.kill("SIGTERM");
  mock.close();
  await log.close();
  const resolved = path.resolve(fixture);
  if (path.dirname(resolved) !== path.resolve(testRoot) || !path.basename(resolved).startsWith("seo-test-")) throw new Error("Unexpected test cleanup path.");
  await fs.rm(resolved, { recursive: true, force: true });
}
