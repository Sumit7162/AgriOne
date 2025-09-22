'use server';

import { generateCropHealthReport } from '@/ai/flows/generate-crop-health-report';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { z } from 'zod';

export interface CropHealthState {
  report?: string;
  audioDataUri?: string;
  error?: string;
  formKey?: number;
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
    return {
      error: validatedFields.error.flatten().fieldErrors.description?.[0] || validatedFields.error.flatten().fieldErrors.photoDataUri?.[0],
      formKey: prevState.formKey,
    };
  }
  
  try {
    const { report } = await generateCropHealthReport(validatedFields.data);
    
    // Default audio generation on report creation
    const { media } = await textToSpeech({ text: report, voiceName: 'Algenib' });

    return { report, audioDataUri: media, formKey: (prevState.formKey || 0) + 1 };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate crop health report. Please try again.', formKey: prevState.formKey };
  }
}


export async function getReportAudio(
  report: string,
  voiceName: string
): Promise<{ audioDataUri?: string; error?: string }> {
  if (!report) {
    return { error: 'Report text is missing.' };
  }
  if (!voiceName) {
    return { error: 'Voice selection is missing.' };
  }

  try {
    const { media } = await textToSpeech({ text: report, voiceName });
    return { audioDataUri: media };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate audio. Please try again.' };
  }
}
