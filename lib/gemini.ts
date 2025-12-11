import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function generateMeditationScript(mood: string, detailedMood: string, type: string, duration: number) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn("GEMINI_API_KEY is missing, returning mock script.");
        return `This is a mock meditation script for someone feeling ${mood} because they are ${detailedMood}. Take a deep breath...`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Calculate approximate word count for duration (avg 130 wpm for slow speaking)
    // But for meditation, it's much slower. Maybe 60-80 words per minute of actual speech, plus pauses.
    // We'll ask for a script suitable for X minutes.

    const prompt = `
    You are an expert meditation guide. Create a personalized ${type} meditation script for a user who is feeling "${mood}" specifically because "${detailedMood}".
    
    The session should last approximately ${duration} minutes.
    
    Instructions:
    1. Tone: Soothing, empathetic, calm, and supportive.
    2. Structure: 
       - Brief introduction acknowledging their state.
       - Body of the meditation (breathwork, visualization, or body scan as per '${type}').
       - Gentle conclusion.
    3. Formatting: clear paragraphs. Do not include "Scene direction" or audio cues, just the spoken text.
    4. Speak directly to the user ("You", "Your").
    
    Write the script now.
  `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Gemini Generation Error:", error);
        // Fallback to mock script so the app doesn't crash
        const errorMessage = error instanceof Error ? error.message : String(error);
        return `(Fallback Script) Welcome to your ${type} meditation session. Close your eyes and take a deep breath. Inhale... and exhale. You are feeling ${mood}, and that is okay. Let's take a few moments to find stillness together. Focus on your breath... \n\n[System Note: AI generation failed. Reason: ${errorMessage}]`;
    }
}
