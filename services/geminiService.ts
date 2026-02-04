
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
- Atmospheric Setting: Write a highly detailed, cinematic opening. 
  CRITICAL: Break this into 4-6 very short, distinct paragraphs. 
  - Para 1: Visuals (lighting, shadows, architecture).
  - Para 2: Sounds (ambient noise, mechanical hums, distant voices).
  - Para 3: Scents (stale air, sharp perfumes, rain, coffee).
  - Para 4: Tactile (texture of the chair, coldness of the table, weight of clothing).
  - Para 5: Internal Physiology (the knot in your stomach, the pulse in your neck).
  Each paragraph must be only 1-2 sentences. Use blank lines between them.

- Psychological Conflict: Establish immediate high tension.
- Micro-Expression clues: Provide sharp, clinical behavioral analysis of the other person's subtle ticks.
- 3 Interactive Choices:
  1. Emotional Reaction (Visceral, impulsive)
  2. Avoidant / Passive Response (Submissive, defensive)
  3. Strategic Psychological Control (Calculated, status-focused, high EQ)

PHASE 2 - THE REVEAL RULES:
- Detailed Narrative Outcome: The immediate consequence. Use 2-3 short paragraphs max.
- Masterclass Analysis: 
  Structure this with bold sub-headers:
  **THE PSYCHOLOGY**
  - Point about the specific behavior.
  **SOCIAL DYNAMICS**
  - Point about status or power shifts.
  **REAL-WORLD APPLICATION**
  - Actionable advice.

EYE-COMFORT WRITING STYLE:
- Maximum 2 sentences per paragraph.
- Always include a blank line between paragraphs.
- Use bolding for emphasis on key psychological terms.
- Use bullet points for all lists.
- Avoid dense blocks of text.
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
    Adhere strictly to the EYE-COMFORT WRITING STYLE: short paragraphs, bold sub-headers, and bullet points.
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
