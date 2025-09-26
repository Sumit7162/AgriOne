'use server';

import { textToSpeech } from '@/ai/flows/text-to-speech';

export async function getAudioForText(
  text: string
): Promise<{ audioDataUri?: string; error?: string }> {
  if (!text) {
    return { error: 'Text is missing.' };
  }

  try {
    const { media } = await textToSpeech({ text, voiceName: 'Algenib' });
    if (!media) {
      return {
        error:
          'Audio generation is disabled. Please set your Gemini API key.',
      };
    }
    return { audioDataUri: media };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate audio: ${errorMessage}` };
  }
}
