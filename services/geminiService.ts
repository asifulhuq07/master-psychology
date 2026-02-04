
import { GoogleGenAI, Type } from "@google/genai";
import { Simulation, IntensityLevel, ConflictType, CoreSkill, Choice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_PROMPT = `
You are the MASTER PSYCHOLOGY INTERACTIVE ENGINE (V5.0).
Your goal is to provide high-stakes behavioral simulations that are deeply immersive and psychologically complex.

UNIVERSAL LANGUAGE PROTOCOL:
Adapt to the user's input language. If they use Romanized Bengali (Banglish), reply in formal Bengali script (বাংলা).

PHASE 1 - THE SETUP RULES:
- Clearly define the user's role.
- Atmospheric Setting: Write a highly detailed, cinematic, and multi-sensory opening. 
  Describe the lighting, the ambient sounds (the hum of an AC, the muffled city noise, the scraping of a chair), 
  the scent in the air (stale coffee, expensive cologne, ozone), and the physical sensations (the coldness of a marble table, the tightness in the user's chest).
  The setting should feel like a high-end film scene.
- Psychological Conflict: Establish immediate high tension.
- Micro-Expression clues: Provide sharp, clinical behavioral analysis of the other person's subtle ticks.
- 3 Interactive Choices:
  1. Emotional Reaction (Visceral, impulsive)
  2. Avoidant / Passive Response (Submissive, defensive)
  3. Strategic Psychological Control (Calculated, status-focused, high EQ)

PHASE 2 - THE REVEAL RULES:
- Detailed Narrative Outcome: The immediate consequence of the action.
- Masterclass Analysis: Bullet points on what happened, why, and real-life application.
- Simulation Log: JSON-compatible metadata.

EYE-COMFORT: 2-3 sentences per paragraph. Blank lines between paragraphs. Bold headings.
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
    Scene: "${simulation.scene}"
    The user chose: "${choice.label}: ${choice.text}" (Type: ${choice.type})
    
    Provide the Outcome, Masterclass Analysis, and Simulation Log.
    The analysis must be deep, clinical, and strategic.
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
