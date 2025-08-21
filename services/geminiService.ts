
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AiModel } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const modelPrompts = {
    [AiModel.MIDJOURNEY]: `You are an expert prompt engineer for Midjourney. Your task is to create a highly detailed and effective prompt for Midjourney V7. The prompt should be a single, cohesive string. Include specific keywords for style (e.g., photorealistic, cinematic, 8k, octane render), composition (e.g., wide shot, portrait), lighting (e.g., volumetric lighting, golden hour), and detail. Emphasize artistic styles as appropriate. Always consider adding relevant parameters like --ar 16:9, --style raw, or --v 7. Do not add any explanatory text, just the prompt itself.`,
    [AiModel.FLUX]: `You are an expert prompt creator for Flux Kontext. Your task is to generate an optimized prompt. The prompt should be a single string focusing on clear, descriptive natural language. Construct a narrative or descriptive sentence detailing the subject, their actions, the setting, the overall artistic style, and the mood. Flux prefers natural language over comma-separated keywords. Do not add any explanatory text, just the prompt itself.`
};

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });

    return {
        inlineData: {
            mimeType: file.type,
            data: await base64EncodedDataPromise,
        },
    };
};

export const generatePrompt = async (
    model: AiModel,
    textInput: string,
    imageInput: File | null
): Promise<string> => {
    const systemInstruction = modelPrompts[model];
    let userPrompt: string;
    const parts: any[] = [];

    if (imageInput) {
        userPrompt = `Analyze this image and generate a prompt that would recreate a similar image with the same style, subject, composition, and mood.`;
        const imagePart = await fileToGenerativePart(imageInput);
        parts.push(imagePart);
        parts.push({ text: userPrompt });
    } else {
        userPrompt = `Generate a prompt based on the following user description: "${textInput}"`;
        parts.push({ text: userPrompt });
    }

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts },
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
                topP: 0.95,
            }
        });

        const resultText = response.text.trim();
        if (!resultText) {
            throw new Error("Received an empty response from the AI. Try rephrasing your input.");
        }
        return resultText;

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate prompt. The model may be unavailable or the input might be inappropriate.");
    }
};
