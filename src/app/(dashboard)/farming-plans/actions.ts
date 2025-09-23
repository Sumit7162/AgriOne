'use server';

import { getPersonalizedFarmingAdvice, type PersonalizedFarmingAdviceOutput } from '@/ai/flows/get-personalized-farming-advice';
import { z } from 'zod';

export interface FarmingPlanState {
  advice?: PersonalizedFarmingAdviceOutput;
  error?: string;
}

const FarmingPlanSchema = z.object({
  farmDetails: z.string().min(1, { message: 'Farm details are required.' }),
  cropType: z.string().min(1, { message: 'Crop type is required.' }),
  currentPractices: z.string().min(1, { message: 'Current practices are required.' }),
});

export async function getFarmingPlan(
  prevState: FarmingPlanState,
  formData: FormData
): Promise<FarmingPlanState> {
  const validatedFields = FarmingPlanSchema.safeParse({
    farmDetails: formData.get('farmDetails'),
    cropType: formData.get('cropType'),
    currentPractices: formData.get('currentPractices'),
  });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      error: errors.farmDetails?.[0] || errors.cropType?.[0] || errors.currentPractices?.[0],
    };
  }

  try {
    const advice = await getPersonalizedFarmingAdvice(validatedFields.data);
    return { advice };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate farming plan. Please try again.' };
  }
}
