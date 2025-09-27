
'use server';

/**
 * @fileOverview Translates text to a specified language using Google AI.
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

// Map language codes to full language names for the AI prompt
const languageNameMap: Record<string, string> = {
  hi: 'Hindi',
  bn: 'Bengali',
  te: 'Telugu',
  mr: 'Marathi',
  ta: 'Tamil',
  ur: 'Urdu',
  gu: 'Gujarati',
  kn: 'Kannada',
  or: 'Odia',
  pa: 'Punjabi',
  ml: 'Malayalam',
  as: 'Assamese',
  mai: 'Maithili',
};

const prompt = ai.definePrompt({
    name: 'translateTextPrompt',
    input: { schema: z.object({ text: z.string(), targetLanguageName: z.string() }) },
    output: { schema: TranslateTextOutputSchema },
    prompt: `Translate the following text to {{targetLanguageName}}. Respond with only the translated text, without any introductory phrases or explanations.

Text to translate:
"{{{text}}}"`,
});

// Helper function for retrying promises
async function retry<T>(fn: () => Promise<T>, retries = 2, delay = 500): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (e instanceof Error && (e.message.includes('503') || e.message.toLowerCase().includes('service unavailable'))) {
        await new Promise(res => setTimeout(res, delay * (i + 1)));
      } else {
        throw e;
      }
    }
  }
  throw lastError;
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

    const targetLanguageName = languageNameMap[targetLanguage];
    if (!targetLanguageName) {
      console.warn(`Translation to '${targetLanguage}' is not supported, returning original text.`);
      return { translatedText: text };
    }

    try {
      const { output } = await retry(() => prompt({ text, targetLanguageName }));
      if (!output) {
        throw new Error('AI failed to generate a translation.');
      }
      return output;
    } catch (e) {
       console.error(`Translation failed for ${targetLanguage}:`, e);
       if (e instanceof Error && (e.message.includes('503') || e.message.toLowerCase().includes('service unavailable'))) {
           throw new Error('The AI service is temporarily unavailable. Please try again in a few moments.');
       }
       // Fallback to the original text if translation fails for other reasons
       return { translatedText: text };
    }
  }
);
