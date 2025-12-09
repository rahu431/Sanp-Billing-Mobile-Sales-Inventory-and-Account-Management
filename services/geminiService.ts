import { GoogleGenAI, Type } from "@google/genai";
import { LineItem, Customer } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface ParsedInvoiceData {
  customerName: string;
  items: { description: string; quantity: number; price: number }[];
  notes?: string;
}

export const parseInvoiceFromText = async (text: string): Promise<ParsedInvoiceData | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Extract invoice details from this text: "${text}". If a currency is mentioned, ignore it and just give numbers. If quantities are missing, assume 1.`,
      config: {
        systemInstruction: "You are a helpful billing assistant. Parse natural language into structured invoice data.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            customerName: { type: Type.STRING, description: "Name of the customer" },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  price: { type: Type.NUMBER }
                }
              }
            },
            notes: { type: Type.STRING, description: "Any extra context or notes" }
          },
          required: ["customerName", "items"]
        }
      }
    });

    const result = response.text;
    if (!result) return null;
    
    return JSON.parse(result) as ParsedInvoiceData;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};