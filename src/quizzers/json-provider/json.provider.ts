import { promises as fs } from "fs";
import path from "path";
import { JsonCache } from "./json.cache";

 export class JSONProvider {
    
    // Generic method to load any json file from ../data/*
   static async load<T>(filePath: string): Promise<T> {

    // Step 1: Check if data is already cached
    const cached = JsonCache.get<T>(filePath)
    if (cached !== null) {
      // Cache hit — return immediately without reading disk
      return cached
    }

    // Step 2: Cache miss — read from disk
    const absolutePath = path.join(process.cwd(), filePath)
    const fileContents = await fs.readFile(absolutePath, "utf8")
    const data = JSON.parse(fileContents) as T

    // Step 3: Store in cache for future requests
    JsonCache.set(filePath, data)

    return data
  }
    
 }