
'use server';

import { generateCropHealthReport, type GenerateCropHealthReportOutput } from '@/ai/flows/generate-crop-health-report';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { translateText } from '@/ai/flows/translate-text';
import { z } from 'zod';

export interface CropHealthState {
  report?: GenerateCropHealthReportOutput;
  error?: string;
}

const PhotoSchema = z.string().min(1, { message: 'An image is required.' });

export async function getCropHealthReport(
  prevState: CropHealthState,
  formData: FormData
): Promise<CropHealthState> {
  const photoDataUri = formData.get('photoDataUri');
  const description = (formData.get('description') as string | null) ?? '';

  const validatedPhoto = PhotoSchema.safeParse(photoDataUri);

  if (!validatedPhoto.success) {
    return {
      error: validatedPhoto.error.flatten().formErrors[0],
    };
  }
  
  try {
    const report = await generateCropHealthReport({
        photoDataUri: validatedPhoto.data,
        description: description,
    });
    
    return { report };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { error: `Failed to generate crop health report: ${errorMessage}` };
  }
}


export async function getReportAudio(
  text: string
): Promise<{ audioDataUri?: string; error?: string }> {
  if (!text) {
    return { error: 'Report text is missing.' };
  }

  try {
    const { media } = await textToSpeech({ text, voiceName: 'Algenib' });
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
    return { error: 'Original report is missing.' };
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
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to translate report. Please try again.' };
  }
}
