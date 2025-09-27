
'use server';

import { getPersonalizedFarmingAdvice, type PersonalizedFarmingAdviceOutput } from '@/ai/flows/get-personalized-farming-advice';
import { translateText } from '@/ai/flows/translate-text';
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

// Helper function for retrying promises
async function retry<T>(fn: () => Promise<T>, retries = 2, delay = 500): Promise<T> {
  let lastError: Error | undefined;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (e instanceof Error && (e.message.includes('503') || e.message.toLowerCase().includes('service unavailable'))) {
        await new Promise(res => setTimeout(res, delay * (i + 1)));
      } else {
        throw e;
      }
    }
  }
  throw lastError;
}


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
    const advice = await retry(() => getPersonalizedFarmingAdvice(validatedFields.data));
    return { advice };
  } catch (e) {
    console.error(e);
    let errorMessage = 'Failed to generate farming plan. Please try again.';
    if (e instanceof Error) {
      if (e.message.includes('503') || e.message.toLowerCase().includes('service unavailable')) {
        errorMessage = 'The AI service is temporarily unavailable. Please try again in a few moments.';
      } else {
        errorMessage = `Failed to generate farming plan: ${e.message}`;
      }
    }
    return { error: errorMessage };
  }
}


export async function getTranslatedPlan(
  advice: PersonalizedFarmingAdviceOutput,
  languageCode: string
): Promise<{ translatedAdvice?: PersonalizedFarmingAdviceOutput; error?: string }> {
  if (!advice) {
    return { error: 'Original advice is missing.' };
  }
  if (languageCode === 'en') {
    return { translatedAdvice: advice };
  }
  try {
    const [irrigation, fertilization, pestControl] = await Promise.all([
      translateText({ text: advice.irrigationRecommendations, targetLanguage: languageCode }),
      translateText({ text: advice.fertilizationRecommendations, targetLanguage: languageCode }),
      translateText({ text: advice.pestControlRecommendations, targetLanguage: languageCode }),
    ]);

    return {
      translatedAdvice: {
        ...advice,
        irrigationRecommendations: irrigation.translatedText,
        fertilizationRecommendations: fertilization.translatedText,
        pestControlRecommendations: pestControl.translatedText,
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to translate farming plan. Please try again.' };
  }
}
