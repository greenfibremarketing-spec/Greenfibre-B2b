import {MongoClient} from "mongodb";
let p;
export async function db(){
  if(!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  p ||= new MongoClient(process.env.MONGODB_URI).connect();
  return (await p).db(process.env.MONGODB_DB||"greenfibre_b2b");
}
