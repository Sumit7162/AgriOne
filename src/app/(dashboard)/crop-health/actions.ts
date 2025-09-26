
'use server';

import { generateCropHealthReport, type GenerateCropHealthReportOutput } from '@/ai/flows/generate-crop-health-report';
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
