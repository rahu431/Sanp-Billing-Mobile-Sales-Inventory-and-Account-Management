import { GoogleGenAI, Type } from "@google/genai";
import { LineItem, Customer, Product } from "../types";

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

interface ParsedInvoiceData {
  customerName: string;
  items: { description: string; quantity: number; price: number }[];
  notes?: string;
}

interface CartAction {
  action: 'add' | 'remove';
  productId?: string; // If matched to inventory
  description: string;
  quantity: number;
  price?: number; // If matched
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

export const processVoiceCommand = async (
  transcript: string, 
  availableProducts: Product[]
): Promise<CartAction[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // Prepare a minified inventory list for context
    const inventoryContext = availableProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.price
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        User Voice Command: "${transcript}"
        
        Available Inventory: ${JSON.stringify(inventoryContext)}
        
        Instructions:
        1. Interpret the user's command to ADD or REMOVE items from a shopping cart.
        2. Match the item names to the 'Available Inventory' if possible (fuzzy match). 
        3. If matched, include the 'productId' and 'price'.
        4. If NOT matched, use the spoken description and set price to 0 (or infer from context if mentioned).
        5. Return a list of actions.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              action: { type: Type.STRING, enum: ["add", "remove"] },
              productId: { type: Type.STRING, nullable: true },
              description: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              price: { type: Type.NUMBER, nullable: true }
            },
            required: ["action", "description", "quantity"]
          }
        }
      }
    });

    const result = response.text;
    if (!result) return [];

    return JSON.parse(result) as CartAction[];

  } catch (error) {
    console.error("Gemini Voice Command Error:", error);
    return [];
  }
};