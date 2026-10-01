import { MongoClient, ObjectId } from "mongodb";
import fs from "fs";
import path from "path";

let client = null;
let atlasFailedNoticeLogged = false;

// Fallback Local Storage Path (used if MongoDB Atlas is unreachable or IP is not yet whitelisted)
const fallbackFilePath = path.join(process.cwd(), ".data", "local_db.json");

function readFallbackData() {
  try {
    if (!fs.existsSync(fallbackFilePath)) {
      const dir = path.dirname(fallbackFilePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fallbackFilePath, JSON.stringify({ b2b_users: [], b2b_otps: [] }, null, 2));
      return { b2b_users: [], b2b_otps: [] };
    }
    const raw = fs.readFileSync(fallbackFilePath, "utf8");
    return JSON.parse(raw) || { b2b_users: [], b2b_otps: [] };
  } catch {
    return { b2b_users: [], b2b_otps: [] };
  }
}

function writeFallbackData(data) {
  try {
    const dir = path.dirname(fallbackFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(fallbackFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("[Local DB] Write error:", err);
  }
}

function createFallbackCollection(name) {
  return {
    find(query = {}) {
      const data = readFallbackData();
      const list = data[name] || [];
      const filtered = list.filter((item) => {
        return Object.entries(query).every(([k, v]) => {
          if (k === "_id") return String(item._id) === String(v);
          if (v && typeof v === "object" && v.$gt) {
            return new Date(item[k]) > new Date(v.$gt);
          }
          return item[k] === v;
        });
      });
      return {
        async toArray() {
          return filtered;
        },
      };
    },
    async findOne(query = {}) {
      const data = readFallbackData();
      const list = data[name] || [];
      return (
        list.find((item) => {
          return Object.entries(query).every(([k, v]) => {
            if (k === "_id") return String(item._id) === String(v);
            if (v && typeof v === "object" && v.$gt) {
              return new Date(item[k]) > new Date(v.$gt);
            }
            return item[k] === v;
          });
        }) || null
      );
    },
    async insertOne(doc) {
      const data = readFallbackData();
      if (!data[name]) data[name] = [];
      const newDoc = {
        _id: doc._id || new ObjectId().toString(),
        ...doc,
      };
      data[name].push(newDoc);
      writeFallbackData(data);
      return { insertedId: newDoc._id };
    },
    async updateOne(filter, update, options = {}) {
      const data = readFallbackData();
      if (!data[name]) data[name] = [];
      const index = data[name].findIndex((item) => {
        return Object.entries(filter).every(([k, v]) => {
          if (k === "_id") return String(item._id) === String(v);
          return item[k] === v;
        });
      });

      if (index >= 0) {
        const item = data[name][index];
        if (update.$set) Object.assign(item, update.$set);
        if (update.$inc) {
          Object.entries(update.$inc).forEach(([k, v]) => {
            item[k] = (item[k] || 0) + v;
          });
        }
        writeFallbackData(data);
        return { modifiedCount: 1 };
      }

      if (options.upsert) {
        const newDoc = {
          _id: new ObjectId().toString(),
          ...filter,
          ...(update.$set || {}),
        };
        data[name].push(newDoc);
        writeFallbackData(data);
        return { upsertedId: newDoc._id };
      }

      return { modifiedCount: 0 };
    },
    async deleteOne(filter) {
      const data = readFallbackData();
      if (!data[name]) return { deletedCount: 0 };
      const beforeLen = data[name].length;
      data[name] = data[name].filter((item) => {
        return !Object.entries(filter).every(([k, v]) => {
          if (k === "_id") return String(item._id) === String(v);
          return item[k] === v;
        });
      });
      writeFallbackData(data);
      return { deletedCount: beforeLen - data[name].length };
    },
    async countDocuments(query = {}) {
      const data = readFallbackData();
      const list = data[name] || [];
      if (!Object.keys(query).length) return list.length;
      return list.filter((item) => {
        return Object.entries(query).every(([k, v]) => {
          if (k === "_id") return String(item._id) === String(v);
          return item[k] === v;
        });
      }).length;
    },
  };
}

const fallbackDb = {
  collection(name) {
    return createFallbackCollection(name);
  },
};

let lastAtlasAttemptTime = 0;
const ATLAS_RETRY_INTERVAL = 60000; // 60 seconds

async function getClient() {
  if (!process.env.MONGODB_URI) return null;
  if (client) return client;

  // Don't wait on Atlas timeout on every request if it recently failed
  const now = Date.now();
  if (now - lastAtlasAttemptTime < ATLAS_RETRY_INTERVAL) {
    return null;
  }

  try {
    lastAtlasAttemptTime = now;
    const c = new MongoClient(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });
    client = await c.connect();
    atlasFailedNoticeLogged = false;
    return client;
  } catch (err) {
    if (!atlasFailedNoticeLogged) {
      console.warn(
        "\n[MongoDB Notice] Live Atlas connection failed (SSL alert 80 / IP access denied).",
        "\nUsing persistent local fallback database so OTP, registration, and login remain fully functional.",
        "\nTo connect to Atlas directly, whitelist IP in MongoDB Atlas -> Network Access -> Add IP Address.\n"
      );
      atlasFailedNoticeLogged = true;
    }
    client = null;
    return null;
  }
}

// B2B-specific database (for b2b_users, b2b orders, etc.)
export async function db() {
  const c = await getClient();
  if (c) {
    try {
      return c.db(process.env.MONGODB_DB || "greenfibre_b2b");
    } catch {
      return fallbackDb;
    }
  }
  return fallbackDb;
}

// Greenfibre main database (for products, categories, etc.)
export async function mainDb() {
  const c = await getClient();
  if (c) {
    try {
      return c.db("greenfibre");
    } catch {
      return fallbackDb;
    }
  }
  return fallbackDb;
}
