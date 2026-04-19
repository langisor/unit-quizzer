import { promises as fs } from "fs";
import path from "path";

 export class JSONProvider {
    
    // Generic method to load any json file from ../data/*
    static async load<T>(filename: string): Promise<T> {
        try {
            const filePath = path.join(process.cwd(), "src", "unit-quizzer", "data", filename);
            const fileContents = await fs.readFile(filePath, "utf8");
            const data = JSON.parse(fileContents) as T;
            return data;
        } catch (error) {
            console.error(`Error loading JSON file ${filename}:`, error);
            throw error;
        }
    }
    
 }