import "dotenv/config";
import {GoogleGenAI} from "@google/genai";


const apikey= process.env.GEMINI_API_KEY;
if(!apikey) throw new Error("GEMINI_API_KEY is missing in backend");


export const ai= new GoogleGenAI({apikey});
export const MODEL = process.env.AI_MODEL || "gemini-3.7-flash";