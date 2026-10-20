import { writeFile } from "node:fs/promises";

const site = "https://trade.greenfibre.org";
const decode = (text = "") => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
function attribute(tag, name) { return decode((tag.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1] || ""); }
function meta(html, name) { const tag = (html.match(/<meta\b[^>]*>/g) || []).find((tag) => attribute(tag, "name") === name || attribute(tag, "property") === name); return tag ? attribute(tag, "content") : ""; }
const sitemap = await (await fetch(`${site}/sitemap.xml`)).text();
const urls = [...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decode(match[1])))];
const results = [];
for (let offset = 0; offset < urls.length; offset += 4) {
  results.push(...await Promise.all(urls.slice(offset, offset + 4).map(async (url) => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
      const html = await response.text();
      const canonical = (html.match(/<link\b[^>]*>/g) || []).find((tag) => attribute(tag, "rel") === "canonical");
      return { url, status: response.status, title: decode((html.match(/<title>(.*?)<\/title>/s) || [])[1]), description: meta(html, "description"), canonical: canonical ? attribute(canonical, "href") : "", robots: meta(html, "robots"), ogTitle: meta(html, "og:title"), ogDescription: meta(html, "og:description"), socialImage: meta(html, "og:image"), twitterTitle: meta(html, "twitter:title"), twitterDescription: meta(html, "twitter:description"), twitterImage: meta(html, "twitter:image"), h1: decode((html.match(/<h1\b[^>]*>(.*?)<\/h1>/s) || [])[1]?.replace(/<[^>]+>/g, "")) };
    } catch (error) { return { url, error: error.message }; }
  })));
}
const report = { checkedAt: new Date().toISOString(), source: "Public server-rendered HTML; no authenticated SEO records were accessed or edited.", pages: results };
const filename = process.argv[2];
if (filename) await writeFile(filename, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ pages: results.length, errors: results.filter((page) => page.error || page.status !== 200).map((page) => page.url), missingMetadata: results.filter((page) => !page.title || !page.description || !page.canonical).map((page) => page.url), differingSocialImages: results.filter((page) => page.socialImage !== page.twitterImage).map((page) => page.url), products: results.filter((page) => page.url.includes("/products/")).slice(0, 2), sampleCategory: results.find((page) => page.url.endsWith("/category/kitchen-dining")) }, null, 2));
