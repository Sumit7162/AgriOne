'use server';

import { generateCropHealthReport } from '@/ai/flows/generate-crop-health-report';
import { textToSpeech } from '@/ai/flows/text-to-speech';
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
    return {
      error: validatedFields.error.flatten().fieldErrors.description?.[0] || validatedFields.error.flatten().fieldErrors.photoDataUri?.[0],
    };
  }
  
  try {
    const { report } = await generateCropHealthReport(validatedFields.data);
    
    // Generate audio in parallel, but don't block the response for it
    const audioPromise = textToSpeech(report);

    // To avoid making the user wait, we can return the report first, 
    // and then handle the audio generation on the client-side in a separate action
    // For simplicity here, we'll wait for both.
    const { media } = await audioPromise;

    return { report, audioDataUri: media };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate crop health report. Please try again.' };
  }
}
