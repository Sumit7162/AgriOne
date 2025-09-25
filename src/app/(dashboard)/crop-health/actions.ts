
'use server';

import { generateCropHealthReport, type GenerateCropHealthReportOutput } from '@/ai/flows/generate-crop-health-report';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { translateText } from '@/ai/flows/translate-text';
import { z } from 'zod';

export interface CropHealthState {
  report?: GenerateCropHealthReportOutput;
  audioDataUri?: string;
  error?: string;
}

const CropHealthSchema = z.object({
  description: z.string(),
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
    const report = await generateCropHealthReport(validatedFields.data);
    
    // Combine report for text-to-speech
    const fullReportText = `Plant Information: ${report.plantInfo}. Disease Diagnosis: ${report.diseaseDiagnosis}. Solution: ${report.solution}`;
    
    const audioResult = await textToSpeech({ text: fullReportText, voiceName: 'Algenib' });
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
     if (!media) {
      return { error: 'Audio generation is disabled. Please set your Gemini API key.' };
    }
    return { audioDataUri: media };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate audio. Please try again.' };
  }
}

export async function getTranslatedReport(
  report: GenerateCropHealthReportOutput,
  languageCode: string
): Promise<{ translatedReport?: GenerateCropHealthReportOutput; error?: string }> {
  if (!report) {
    return { error: 'Report text is missing.' };
  }
  if (languageCode === 'en') {
    return { translatedReport: report };
  }
  try {
    const [plantInfo, diseaseDiagnosis, solution] = await Promise.all([
        translateText({ text: report.plantInfo, targetLanguage: languageCode }),
        translateText({ text: report.diseaseDiagnosis, targetLanguage: languageCode }),
        translateText({ text: report.solution, targetLanguage: languageCode }),
    ]);

    return { 
        translatedReport: {
            plantInfo: plantInfo.translatedText,
            diseaseDiagnosis: diseaseDiagnosis.translatedText,
            solution: solution.translatedText,
        }
     };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to translate report. Please try again.' };
  }
}
