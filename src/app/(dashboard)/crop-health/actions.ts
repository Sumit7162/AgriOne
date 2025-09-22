'use server';

import { generateCropHealthReport } from '@/ai/flows/generate-crop-health-report';
import { z } from 'zod';

export interface CropHealthState {
  report?: string;
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
    return { report };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate crop health report. Please try again.' };
  }
}
