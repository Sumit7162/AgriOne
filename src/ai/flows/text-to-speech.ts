'use server';

/**
 * @fileOverview Converts text to speech using a Genkit flow.
 *
 * - textToSpeech - A function that takes a string of text and a voice name and returns audio.
 */

import { ai } from '@/ai/genkit';
import { openai } from 'genkitx-openai';
import { z } from 'genkit';

const TextToSpeechInputSchema = z.object({
  text: z.string(),
  voiceName: z.string().default('alloy'),
});
export type TextToSpeechInput = z.infer<typeof TextToSpeechInputSchema>;

const TextToSpeechOutputSchema = z.object({
  media: z.string().describe('The audio data as a base64 encoded data URI.'),
});

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TextToSpeechInputSchema,
    outputSchema: TextToSpeechOutputSchema,
  },
  async ({ text, voiceName }) => {
    const { media } = await ai.generate({
      model: openai.tts1,
      config: {
        voice: voiceName as any,
      },
      prompt: text,
    });

    if (!media) {
      throw new Error('No media was returned from the text-to-speech model.');
    }

    // OpenAI returns audio in a format that can be directly used by the browser.
    // The 'wav' conversion is no longer necessary.
    return {
      media: media.url,
    };
  }
);

export async function textToSpeech(
  input: TextToSpeechInput
): Promise<z.infer<typeof TextToSpeechOutputSchema>> {
  return textToSpeechFlow(input);
}
