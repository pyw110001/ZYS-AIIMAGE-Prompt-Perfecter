import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { AiModel } from '../types';

const modelPrompts = {
    [AiModel.MIDJOURNEY]: `You are an expert prompt engineer for Midjourney. Your task is to create a highly detailed and effective prompt for Midjourney V7. 
    Output a JSON object containing:
    1. "prompt": The English image generation prompt. It should be a single, cohesive string including specific keywords for style (e.g., photorealistic, cinematic, 8k), composition, lighting, and parameters like --ar 16:9, --v 7.
    2. "translation": A Chinese translation of the prompt, including a brief explanation of the artistic style chosen.`,
    
    [AiModel.NANO_BANANA]: `You are an expert prompt creator for Nano Banana Pro (Gemini 3 Pro Image). Your task is to generate an optimized prompt.
    Output a JSON object containing:
    1. "prompt": The English image generation prompt. It should be a clear, descriptive natural language narrative detailing subject, actions, setting, and mood.
    2. "translation": A Chinese translation of the prompt, capturing the mood and details.`
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
): Promise<{ prompt: string, translation: string }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
            model: 'gemini-3-flash-preview',
            contents: { parts },
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.8,
                topP: 0.95,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        prompt: { type: Type.STRING },
                        translation: { type: Type.STRING }
                    },
                    required: ["prompt", "translation"]
                }
            }
        });

        const resultText = response.text?.trim();
        if (!resultText) {
            throw new Error("Received an empty response from the AI.");
        }

        const parsed = JSON.parse(resultText);
        return {
            prompt: parsed.prompt || "",
            translation: parsed.translation || ""
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate prompt. The model may be unavailable or the input might be inappropriate.");
    }
};

export const generateImage = async (
    prompt: string, 
    referenceImage: File | null = null,
    aspectRatio: string = "1:1"
): Promise<string> => {
    // Create a new instance to ensure we use the latest API key (e.g. if selected via window.aistudio)
    const aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const parts: any[] = [];
    
    // Add reference image first if available (for consistency/context)
    if (referenceImage) {
        const imagePart = await fileToGenerativePart(referenceImage);
        parts.push(imagePart);
    }
    
    parts.push({ text: prompt });

    try {
        const response: GenerateContentResponse = await aiInstance.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: parts
            },
            config: {
                imageConfig: {
                    aspectRatio: aspectRatio,
                    imageSize: "1K"
                }
            }
        });

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    return `data:image/png;base64,${part.inlineData.data}`;
                }
            }
        }
        
        throw new Error("No image generated.");
    } catch (error) {
        console.error("Gemini Image Gen Error:", error);
        throw error;
    }
};