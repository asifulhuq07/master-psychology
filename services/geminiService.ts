
import { GoogleGenAI, Type } from "@google/genai";
import { Simulation, IntensityLevel, ConflictType, CoreSkill, Choice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPT = `
You are the MASTER PSYCHOLOGY INTERACTIVE ENGINE (V5.0).
Your goal is to provide high-stakes behavioral simulations that are deeply immersive and psychologically complex.

UNIVERSAL LANGUAGE PROTOCOL:
- Adapt to the user's input language. 
- If input is Romanized Bengali (Banglish), reply in formal Bengali script (বাংলা).
- Regardless of language (English or Bengali), the STRUCTURAL QUALITY must be identical.

PHASE 1 - THE SETUP RULES:
- Clearly define the user's role.
- Atmospheric Setting: 4-6 very short, distinct paragraphs. 
- Micro-Expression clues: Sharp, clinical analysis.
- 3 Interactive Choices: Emotional, Avoidant, and Strategic.

PHASE 2 - THE REVEAL RULES:
- Detailed Narrative Outcome: The immediate consequence. (2-3 short paragraphs).
- Masterclass Analysis: This MUST be structured with clear sections.
  
  FORMATTING RULES FOR ANALYSIS (MANDATORY):
  1. Use **SECTION TITLE IN ALL CAPS** for headers.
  2. Every single point MUST be a bullet point starting with a dash (-).
  3. Every bullet point MUST be followed by a double newline so they don't look cluttered.
  4. Use bolding (**word**) for key psychological concepts.
  5. NEVER write a long paragraph in the analysis. Break everything into points.

EYE-COMFORT WRITING STYLE:
- Maximum 2 sentences per paragraph.
- Always include a blank line between every single point or paragraph.
- Use bullet points for all analysis data.
- Ensure the English version is as spaced-out and organized as the Bengali version.
`;

export const generateSimulation = async (userInput: string): Promise<Partial<Simulation>> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: userInput || 'Start a new high-stakes professional simulation.',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          role: { type: Type.STRING },
          scene: { type: Type.STRING },
          microExpressions: { type: Type.STRING },
          choices: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.NUMBER },
                label: { type: Type.STRING },
                type: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["id", "label", "type", "text"]
            }
          }
        },
        required: ["title", "role", "scene", "microExpressions", "choices"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse simulation JSON", e);
    throw new Error("Invalid simulation format received from engine.");
  }
};

export const generateReveal = async (simulation: Simulation, choice: Choice): Promise<{ outcome: string, analysis: string, log: any }> => {
  const prompt = `
    Based on this simulation: "${simulation.title}" 
    The user chose: "${choice.label}: ${choice.text}"
    
    Provide the Outcome, Masterclass Analysis, and Simulation Log.
    REINFORCEMENT: Ensure the Analysis is NOT hijibiji. Use bold headers and separate every point with space. 
    Make the English output look exactly as organized as the Bengali version.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          outcome: { type: Type.STRING },
          analysis: { type: Type.STRING },
          log: {
            type: Type.OBJECT,
            properties: {
              language: { type: Type.STRING },
              conflictType: { type: Type.STRING },
              intensityLevel: { type: Type.NUMBER },
              coreSkill: { type: Type.STRING },
              strategicEssence: { type: Type.STRING }
            },
            required: ["language", "conflictType", "intensityLevel", "coreSkill", "strategicEssence"]
          }
        },
        required: ["outcome", "analysis", "log"]
      }
    }
  });

  try {
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Failed to parse reveal JSON", e);
    throw new Error("Invalid reveal format received from engine.");
  }
};
