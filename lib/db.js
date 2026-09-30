import { MongoClient } from "mongodb";

let client;

async function getClient() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  if (!client) {
    client = await new MongoClient(process.env.MONGODB_URI).connect();
  }
  return client;
}

// B2B-specific database (for b2b_users, b2b orders, etc.)
export async function db() {
  const c = await getClient();
  return c.db(process.env.MONGODB_DB || "greenfibre_b2b");
}

// Greenfibre main database (for products, categories, etc.)
export async function mainDb() {
  const c = await getClient();
  return c.db("greenfibre");
}
