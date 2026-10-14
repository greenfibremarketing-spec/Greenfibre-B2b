import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { persistentDb } from "@/lib/db";

const directory = () => process.env.SEO_DATA_DIR || path.join(process.cwd(), ".data", "seo");

export async function readSeoIndex() {
  if (process.env.NODE_ENV === "production") {
    const database = await persistentDb();
    const documents = await database.collection("seo_settings").find({}, { projection: { noindex: 1, canonical: 1, updatedAt: 1 } }).toArray();
    return Object.fromEntries(documents.map(({ _id, ...settings }) => [_id, settings]));
  }
  try { return JSON.parse(await fs.readFile(path.join(directory(), "settings.json"), "utf8")); }
  catch (error) { if (error.code === "ENOENT") return {}; throw error; }
}

export async function readSeoSettings(pagePath) {
  if (process.env.NODE_ENV === "production") {
    const database = await persistentDb();
    return database.collection("seo_settings").findOne({ _id: pagePath });
  }
  try {
    return JSON.parse(await fs.readFile(path.join(directory(), "settings.json"), "utf8"))[pagePath] || null;
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

// Serialize local updates so editing two pages cannot discard another save.
let pendingWrite = Promise.resolve();
export async function saveSeoSettings(pagePath, settings, email) {
  const document = { ...settings, updatedAt: new Date().toISOString(), updatedBy: email };
  if (process.env.NODE_ENV === "production") {
    const database = await persistentDb();
    await database.collection("seo_settings").updateOne({ _id: pagePath }, { $set: document }, { upsert: true });
  } else {
    const write = pendingWrite.catch(() => {}).then(async () => {
      await fs.mkdir(directory(), { recursive: true });
      const filename = path.join(directory(), "settings.json");
      let all = {};
      try { all = JSON.parse(await fs.readFile(filename, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
      all[pagePath] = document;
      const temporary = path.join(directory(), `${randomUUID()}.tmp`);
      await fs.writeFile(temporary, JSON.stringify(all, null, 2));
      await fs.rename(temporary, filename);
    });
    pendingWrite = write;
    await write;
  }
  return document;
}

export async function saveSeoImage(bytes, contentType) {
  const id = randomUUID();
  if (process.env.NODE_ENV === "production") {
    const database = await persistentDb();
    await database.collection("seo_images").insertOne({ _id: id, bytes, contentType, createdAt: new Date() });
  } else {
    await fs.mkdir(directory(), { recursive: true });
    await fs.writeFile(path.join(directory(), `${id}.json`), JSON.stringify({ contentType, bytes: bytes.toString("base64") }));
  }
  return `/api/seo/image/${id}`;
}

export async function readSeoImage(id) {
  if (process.env.NODE_ENV === "production") {
    const database = await persistentDb();
    const image = await database.collection("seo_images").findOne({ _id: id });
    return image && { contentType: image.contentType, bytes: Buffer.from(image.bytes.buffer) };
  }
  try {
    const image = JSON.parse(await fs.readFile(path.join(directory(), `${id}.json`), "utf8"));
    return { contentType: image.contentType, bytes: Buffer.from(image.bytes, "base64") };
  } catch (error) { if (error.code === "ENOENT") return null; throw error; }
}
