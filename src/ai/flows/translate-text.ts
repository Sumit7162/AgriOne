'use server';

/**
 * @fileOverview Translates text to a specified language using Hugging Face.
 *
 * - translateText - A function that translates text.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  text: z.string().describe('The text to translate.'),
  targetLanguage: z.string().describe('The target language code (e.g., "hi" for Hindi).'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translatedText: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(
  input: TranslateTextInput
): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

// Map language codes to Hugging Face model names
const languageModelMap: Record<string, string> = {
  hi: 'Helsinki-NLP/opus-mt-en-hi',
  bn: 'Helsinki-NLP/opus-mt-en-mul', // Using a multilingual model as a fallback
  te: 'Helsinki-NLP/opus-mt-en-mul',
  mr: 'Helsinki-NLP/opus-mt-en-mr',
  ta: 'Helsinki-NLP/opus-mt-en-ta',
  ur: 'Helsinki-NLP/opus-mt-en-ur',
  gu: 'Helsinki-NLP/opus-mt-en-gu',
  kn: 'Helsinki-NLP/opus-mt-en-mul',
  or: 'Helsinki-NLP/opus-mt-en-mul',
  pa: 'Helsinki-NLP/opus-mt-en-pa',
  ml: 'Helsinki-NLP/opus-mt-en-ml',
  as: 'Helsinki-NLP/opus-mt-en-mul',
  mai: 'Helsinki-NLP/opus-mt-en-mul',
};

async function queryHuggingFace(text: string, model: string): Promise<string> {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
        throw new Error('Hugging Face API key is not configured.');
    }

    const response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
            headers: { Authorization: `Bearer ${apiKey}` },
            method: "POST",
            body: JSON.stringify({ "inputs": text }),
        }
    );

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Hugging Face API request failed: ${response.statusText} - ${errorBody}`);
    }

    const result = await response.json();
    return result[0]?.translation_text || text;
}


const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async ({ text, targetLanguage }) => {
    if (targetLanguage === 'en') {
      return { translatedText: text };
    }

    const model = languageModelMap[targetLanguage];
    if (!model) {
      throw new Error(`Translation to '${targetLanguage}' is not supported.`);
    }

    try {
      const translatedText = await queryHuggingFace(text, model);
      return { translatedText };
    } catch (error) {
       console.error(`Translation failed for ${targetLanguage}:`, error);
       // Fallback to the original text if translation fails
       return { translatedText: text };
    }
  }
);