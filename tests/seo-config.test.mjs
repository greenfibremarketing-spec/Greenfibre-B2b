import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../lib/seo-config.js", import.meta.url), "utf8");
const { validateSeoSettings, mergeSeoMetadata, SEO_FIELDS } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
const empty = () => ({ ...Object.fromEntries(Object.keys(SEO_FIELDS).map((key) => [key, ""])), noindex: false, nofollow: false });

test("keywords are normalized and deduplicated", () => {
  const clean = validateSeoSettings({ ...empty(), title: "  Green Fibre  ", keywords: "tableware, corporate gifts\ntableware\n" });
  assert.equal(clean.title, "Green Fibre");
  assert.equal(clean.keywords, "tableware\ncorporate gifts");
});

test("invalid field types, oversized values and unsafe URLs are rejected", () => {
  for (const change of [{ title: {} }, { title: "x".repeat(201) }, { noindex: "false" }, { canonical: "javascript:alert(1)" }, { canonical: "https://user:password@example.com" }, { socialImage: "//example.com/a.jpg" }, { socialImage: "/\\example.com/a.jpg" }]) {
    assert.throws(() => validateSeoSettings({ ...empty(), ...change }));
  }
  assert.equal(validateSeoSettings({ ...empty(), socialImage: "/api/seo/image/123" }).socialImage, "/api/seo/image/123");
});

test("saved metadata preserves unrelated values and emits an exact title", () => {
  const merged = mergeSeoMetadata({ title: "Old", alternates: { languages: { en: "/" } }, openGraph: { type: "website" } }, { ...empty(), title: "New | Green Fibre", description: "New description", canonical: "https://trade.greenfibre.org/", socialImage: "/image.png", noindex: true, nofollow: true });
  assert.deepEqual(merged.title, { absolute: "New | Green Fibre" });
  assert.equal(merged.alternates.languages.en, "/");
  assert.equal(merged.openGraph.type, "website");
  assert.equal(merged.openGraph.title, "New | Green Fibre");
  assert.equal(merged.twitter.description, "New description");
  assert.deepEqual(merged.twitter.images, ["/image.png"]);
  assert.equal(merged.robots.googleBot.index, false);
  assert.equal(merged.robots.googleBot.follow, false);
  assert.equal(merged.focusKeyword, undefined);
});

test("blank values retain defaults and social-specific overrides win", () => {
  const base = { title: "Original", description: "Original description", openGraph: { title: "OG original" } };
  assert.equal(mergeSeoMetadata(base, empty()).title, "Original");
  assert.equal(mergeSeoMetadata(base, empty()).openGraph.title, "OG original");
  assert.equal(mergeSeoMetadata(base, { ...empty(), title: "Main", ogTitle: "Social" }).openGraph.title, "Social");
  assert.equal(mergeSeoMetadata(base, null), base);
});

test("filtered or missing pages cannot be made indexable by an override", () => {
  const merged = mergeSeoMetadata({ robots: { index: false, follow: true } }, empty());
  assert.equal(merged.robots.index, false);
  assert.equal(merged.robots.googleBot.index, false);
});
