'use server';

import { generateCropHealthReport } from '@/ai/flows/generate-crop-health-report';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { translateText } from '@/ai/flows/translate-text';
import { z } from 'zod';

export interface CropHealthState {
  report?: string;
  audioDataUri?: string;
  error?: string;
}

const CropHealthSchema = z.object({
  description: z.string().min(1, { message: 'Description is required.' }),
  photoDataUri: z.string().min(1, { message: 'An image is required.' }),
});

export async function getCropHealthReport(
  prevState: CropHealthState,
  formData: FormData
): Promise<CropHealthState> {
  const validatedFields = CropHealthSchema.safeParse({
    description: formData.get('description'),
    photoDataUri: formData.get('photoDataUri'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const error = fieldErrors.description?.[0] || fieldErrors.photoDataUri?.[0];
    return {
      error: error,
    };
  }
  
  try {
    const reportResult = await generateCropHealthReport(validatedFields.data);
    if (!reportResult || !reportResult.report) {
        throw new Error("AI failed to generate a report.");
    }
    const { report } = reportResult;
    
    const audioResult = await textToSpeech({ text: report, voiceName: 'Algenib' });
     if (!audioResult || !audioResult.media) {
        throw new Error("AI failed to generate audio for the report.");
    }
    const { media } = audioResult;

    return { report, audioDataUri: media };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate crop health report: ${errorMessage}` };
  }
}


export async function getReportAudio(
  text: string,
  voiceName: string
): Promise<{ audioDataUri?: string; error?: string }> {
  if (!text) {
    return { error: 'Report text is missing.' };
  }
  if (!voiceName) {
    return { error: 'Voice selection is missing.' };
  }

  try {
    const { media } = await textToSpeech({ text, voiceName });
    return { audioDataUri: media };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate audio. Please try again.' };
  }
}

export async function getTranslatedReport(
  report: string,
  languageCode: string
): Promise<{ translatedText?: string; error?: string }> {
  if (!report) {
    return { error: 'Report text is missing.' };
  }
  if (languageCode === 'en') {
    return { translatedText: report };
  }
  try {
    const { translatedText } = await translateText({ text: report, targetLanguage: languageCode });
    return { translatedText };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to translate report. Please try again.' };
  }
}
